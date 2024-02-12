<script>
import {getAuth} from "firebase/auth";
import {
  where,
  query,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default {
  name: "CreatePage",
  data() {
    return {
      drafts: [],
      title: "",
      catchphrase: "",
      description: "",
      url: "",
      isDraft: true,
      uploadedImages: [],
      tags: [],
      auth: {
        isLoggedIn: false,
        user: null,
      },
    };
  },
  async mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.updateUserToken(user);

        this.auth.isLoggedIn = true;
        this.auth.user = user;

        const draftId = new URLSearchParams(window.location.search).get(
            "draftId"
        );

        if (draftId) {
          await this.loadDraft(draftId);
        } else {
          window.history.pushState({}, null, "/create");
        }

        await this.loadUserDrafts(user);
      } else {
        this.auth.isLoggedIn = false;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.isDraft) {
      const confirmMessage = "このページを離れると保存されていないデータが削除されます。";
      if (confirm(confirmMessage)) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    async updateUserToken(user) {
      try {
        const idToken = await user.getIdToken(true);
        document.cookie = `token=${idToken}`;
      } catch (error) {
        console.error("Error updating user token:", error);
      }
    },
    openDraft(draftId) {
      window.history.pushState({}, null, `/create?draftId=${draftId}`);
      this.loadDraft(draftId);
    },
    async loadDraft(draftId) {
      try {
        const docRef = doc(this.$db, "apps", draftId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.title = data.title;
          this.catchphrase = data.catchphrase;
          this.uploadedImages = data.images;
          this.description = data.description;
          this.url = data.url;
          this.tags = data.tags;
          this.isDraft = data.draft;
        } else {
          window.history.pushState({}, null, "/create");
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    },
    async loadUserDrafts(user) {
      try {
        const value = doc(this.$db, "users", user.uid);
        const docs = await getDocs(
            query(
                collection(this.$db, "apps"),
                where("owner", "==", value),
                where("draft", "==", true)
            )
        );
        this.drafts = docs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error loading user drafts:", error);
      }
    },
    async publishApp() {
      if (!this.isAppValid()) return;

      const draftId = new URLSearchParams(window.location.search).get(
          "draftId"
      );

      if (!draftId) {
        await this.createOrUpdateApp(false);
      } else {
        await this.updateAppDraft(draftId, false);
      }

      this.notifyUser("アプリを出版しました", "success");
      this.isDraft = false;
      window.location.href = `/dashboard`;
    },
    async saveDraft() {
      const draftId = new URLSearchParams(window.location.search).get(
          "draftId"
      );

      if (!draftId) {
        await this.createOrUpdateApp(true);
      } else {
        await this.updateAppDraft(draftId, true);
      }

      this.notifyUser("下書きを保存しました", "info");
      this.isDraft = true;
    },
    async createOrUpdateApp(draft) {
      try {
        const collectionRef = collection(this.$db, "apps");
        const owner = doc(this.$db, "users", this.auth.user.uid);
        const data = {
          title: this.title,
          catchphrase: this.catchphrase,
          images: this.uploadedImages,
          description: this.description,
          url: this.url,
          tags: this.tags,
          owner: owner,
          likedByUsers: [],
          draft: draft,
          createdAt: new Date(),
        };
        const docRef = await addDoc(collectionRef, data);
        window.history.pushState({}, null, `/create?draftId=${docRef.id}`);
      } catch (error) {
        console.error("Error creating/updating app:", error);
      }
    },
    async updateAppDraft(draftId, draft) {
      try {
        const docRef = doc(this.$db, "apps", draftId);
        await setDoc(
            docRef,
            {
              title: this.title,
              catchphrase: this.catchphrase,
              images: this.uploadedImages,
              description: this.description,
              url: this.url,
              tags: this.tags,
              draft: draft,
            },
            {merge: true}
        );
      } catch (error) {
        console.error("Error updating app draft:", error);
      }
    },
    async deleteDraft(draftId) {
      try {
        await deleteDoc(doc(this.$db, "apps", draftId));
        this.notifyUser("下書きを削除しました", "info");
        this.drafts = this.drafts.filter((draft) => draft.id !== draftId);
      } catch (error) {
        console.error("Error deleting draft:", error);
      }
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          if (img.width / img.height !== 3 / 2) {
            this.notifyUser("アプリの画像は3:2でお願いします", "error");
          } else if (this.uploadedImages.length === 5) {
            this.notifyUser("アプリの画像は５枚までしか入力できません", "error");
          } else if (file.size > 1000000) {
            this.notifyUser("アプリの画像は1MB以下でお願いします", "error");
          } else {
            const storage = getStorage();
            const reference = storageRef(
                storage,
                `app_images/${file.name}`
            );
            await uploadBytes(reference, file);
            this.imageUrl = await getDownloadURL(reference);
            this.uploadedImages.push(this.imageUrl);
          }
        };
      } catch (error) {
        console.error("Error handling file change:", error);
      }
    },
    removeImage(index) {
      try {
        const imagePath = this.uploadedImages[index];
        let name = imagePath.substr(
            imagePath.indexOf("%2F") + 3,
            imagePath.indexOf("?") - (imagePath.indexOf("%2F") + 3)
        );
        name = name.replace("%20", " ");
        const desertRef = storageRef(
            getStorage(),
            `app_images/${name}`
        );
        deleteObject(desertRef)
            .then(() => {
              this.uploadedImages.splice(index, 1);
            })
            .catch((error) => {
              console.error("Error removing image:", error);
            });
      } catch (error) {
        console.error("Error removing image:", error);
      }
    },
    addTag() {
      const input = document.getElementById("input-tag");
      if (input.value.length === 0) return;

      this.tags.push(input.value);
      input.value = "";
    },
    notifyUser(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "bottom",
        duration: 8000,
        dismissible: true,
      });
    },
    isAppValid() {
      if (this.title.length > 60) {
        this.notifyUser("アプリ名は60文字以下でお願いします", "error");
        return false;
      }
      // Check other validation rules
      return true;
    },
  },
};
</script>

<!-- Template code remains unchanged -->


<template>
  <Head>
    <Title>アプリを出版する</Title>
  </Head>
  <div id="general-container">
    <h1>アプリを出版する</h1>
    <span>保存をお忘れなく！</span>

    <div v-if="auth.isLoggedIn && drafts.length !== 0" id="drafts">
      <h2>下書き一覧</h2>
      <div
          v-for="draft in drafts"
          :key="draft.id"
          :class="draft"
          id="draft-container"
      >
        <h3>{{ draft.title }}</h3>
        <h4>{{ draft.catchphrase }}</h4>
        <p>{{ draft.url }}</p>
        <button @click="deleteDraft(draft.id)">削除</button>
        <button @click="openDraft(draft.id)">編集</button>
      </div>
    </div>
    <br/>
    <div id="form">
      <label for="title">アプリ名</label>
      <input type="text" id="title" name="title" v-model="title"/>

      <label for="catchphrase">キャッチフレーズ</label>
      <input
          type="text"
          id="catchphrase"
          name="catchphrase"
          v-model="catchphrase"
      />

      <label for="upload">アプリの画像（300×200px ５枚まで)</label>
      <input type="file" multiple @change="onFileChange" id="upload"/>
      <div
          v-for="(image, index) in uploadedImages"
          :key="index"
          id="image-container"
      >
        <img :src="image" alt="Uploaded Image" width="300" height="200"/>
        <button @click="removeImage(index)">削除</button>
      </div>

      <label for="description"
      >アプリの説明（<a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
      >Markdown</a>可）
      </label>
      <textarea
          id="description"
          name="description"
          v-model="description"
      ></textarea>

      <label for="url">アプリのURL</label>
      <input type="url" id="url" name="url" v-model="url"/>

      <label for="tags">タグ</label>
      <ul class="tags">

        <li v-for="tag in tags" :key="tag">
          <button @click="tags.splice(tags.indexOf(tag), 1)">×</button>
          {{ tag }}
        </li>
      </ul>
      <input type="text" id="input-tag" name="tags" @keydown.enter="addTag">


      <button @click="saveDraft" v-if="isDraft" id="save">
        下書きを保存
      </button>
      <button @click="publishApp" v-if="isDraft" id="publish">出版</button>
    </div>
  </div>
</template>

<style scoped>
#general-container {
  height: max-content;
  margin: 0;
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#drafts {
  display: flex;
  width: 80%;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid black;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

#draft-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  padding: 10px;
  margin: 15px;
}

#form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#title {
  width: 40%;
  height: 30px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

#catchphrase {
  width: 50%;
  height: 30px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

#upload {
  width: min-content;
  height: 30px;
  background: #e0dede;
  margin: 20px auto;
  border: none;
  outline: none;
  border-radius: 5px;
}

:deep(#image-container) {
  width: 50%;
  height: max-content;
  background: #e0dede;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

:deep(#image-container img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(#image-container button) {
  width: 20%;
  height: 35px;
  background: red;
  color: white;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-left: 20px;
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

#description {
  width: 90%;
  height: 600px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

#url {
  width: 50%;
  height: 30px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tags li {
  margin: 0 10px 10px 0;
  padding: 5px;
  background: #2dc6e0;
  border-radius: 5px;
}

.tags li a {
  display: block;
  padding: 0 10px;
  line-height: 30px;
  text-decoration: none;
  color: #000;
}

.tags li a:hover {
  color: #fff;
  background: #000;

}

#input-tag {
  width: 20%;
  height: 30px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

#save {
  background: #125c5a;
  color: white;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 20px auto;
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

#save:hover {
  background-color: #0b3d3b;
}

#publish {
  background: #30c0bc;
  color: white;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 20px auto;
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
}

#publish:hover {
  background-color: #1d7a7a;
}
</style>
