<script>
import {getAuth} from "firebase/auth";
import {
  getFirestore,
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
import {db} from "@/main";

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
        //reauthenticate the user so the email state is up-to-date
        await user.getIdToken(true).then((idToken) => {
          document.cookie = `token=${idToken}`;
        });

        console.log("user is signed in");
        this.auth.isLoggedIn = true;
        this.auth.user = user;

        const draftId = new URLSearchParams(window.location.search).get(
            "draftId"
        );

        if (draftId) {
          const docRef = doc(db, "apps", draftId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            this.title = docSnap.data().title;
            this.catchphrase = docSnap.data().catchphrase;
            this.uploadedImages = docSnap.data().images;
            this.description = docSnap.data().description;
            this.uploadedImages = docSnap.data().images;
            this.url = docSnap.data().url;
            this.tags = docSnap.data().tags;
            this.isDraft = docSnap.data().draft;
          } else {
            window.history.pushState({}, null, "/create");
          }
        } else {
          window.history.pushState({}, null, "/create");
        }

        const value = doc(db, "users", user.uid);

        try {
          const docs = await getDocs(
              query(
                  collection(db, "apps"),
                  where("owner", "==", value),
                  where("draft", "==", true)
              )
          );
          this.drafts = docs.docs.map((doc) => {
            return {
              id: doc.id,
              title: doc.data().title,
              catchphrase: doc.data().catchphrase,
              images: doc.data().images,
              description: doc.data().description,
              url: doc.data().url,
              tags: doc.data().tags,
            };
          });
          console.log(this.drafts);
        } catch (e) {
          console.log(e);
        }
      } else {
        this.auth.isLoggedIn = false;
      }
    });
  },
  methods: {
    getUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        return user;
      } else {
        return null;
      }
    },
    async publishApp() {
      if (!this.isAppValid()) {
        return;
      }
      const url = new URL(window.location.href);
      const draftId = url.searchParams.get("draftId");

      if (draftId === null) {
        await this.createAppDoc(false);
      } else {
        //update the current draft
        const docRef = doc(db, "apps", draftId);

        if (!(await getDoc(docRef)).exists()) {
          await this.createAppDoc(false);
          return;
        }

        await setDoc(
            docRef,
            {
              title: this.title,
              catchphrase: this.catchphrase,
              images: this.uploadedImages,
              description: this.description,
              url: this.url,
              tags: this.tags,
              draft: false,
            },
            {merge: true}
        );
        console.log("Document written with ID: ", docRef.id);
      }
      this.$toast.open({
        message: "アプリを出版しました",
        type: "success",
        position: "bottom",
        duration: 8000,
        dismissible: true,
      });
      this.isDraft = false;
      window.location.href = `/dashboard`;
    },
    async saveDraft() {
      const url = new URL(window.location.href);
      const draftId = url.searchParams.get("draftId");

      if (draftId === null) {
        await this.createAppDoc(true);
      } else {
        //update the current draft
        const docRef = doc(db, "apps", draftId);

        if (!(await getDoc(docRef)).exists()) {
          await this.createAppDoc(true);
          return;
        }

        await setDoc(
            docRef,
            {
              title: this.title,
              catchphrase: this.catchphrase,
              images: this.uploadedImages,
              description: this.description,
              url: this.url,
              tags: this.tags,
              draft: true,
            },
            {merge: true}
        );
        console.log("Document written with ID: ", docRef.id);
      }
      this.sendNotification("下書きを保存しました", "info");
      this.isDraft = true;
    },

    async deleteDraft(draftId) {
      await deleteDoc(doc(db, "apps", draftId));
      this.sendNotification("下書きを削除しました", "info");
      this.drafts = this.drafts.filter((draft) => draft.id !== draftId);
    },

    openDraft(draftId) {
      window.location.href = `/create?draftId=${draftId}`;
    },
    sendNotification(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "bottom",
        duration: 8000,
        dismissible: true,
      });
    },
    isAppValid() {
      //check that the title is under 20 characters and the description is under 1000 characters
      if (this.title.length > 60) {
        this.sendNotification("アプリ名は60文字以下でお願いします", "error");
        return false;
      }

      if (this.title.length === 0) {
        this.sendNotification("アプリ名を入力してください", "error");
        return false;
      }

      if (this.catchphrase.length > 100) {
        this.sendNotification(
            "キャッチフレーズは100文字以下でお願いします",
            "error"
        );
        return false;
      }

      if (this.catchphrase.length === 0) {
        this.sendNotification("キャッチフレーズを入力してください", "error");
        return false;
      }

      if (this.description.length < 200) {
        this.sendNotification(
            "アプリの説明は200文字以上でお願いします",
            "error"
        );
        return false;
      }

      if (this.url.length === 0) {
        this.sendNotification("アプリのURLを入力してください", "error");
        return false;
      }

      if (this.uploadedImages.length === 0) {
        this.sendNotification(
            "アプリの画像を最低でも１枚入力してください",
            "error"
        );
        return false;
      }

      if (this.tags.length === 0) {
        this.sendNotification(
            "タグを最低でも１つ入力してください",
            "error"
        );
        return false;
      } else if (this.tags.length > 5) {
        this.sendNotification(
            "タグは５つまでしか入力できません",
            "error"
        );
        return false;
      }
      return true;
    },
    async createAppDoc(draft) {
      const db = getFirestore();
      const collectionRef = collection(db, "apps");
      const owner = doc(db, "users", this.auth.user.uid);
      const data1 = {
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
      console.log(data1);
      console.log(owner.id);
      console.log(this.auth.user);
      const docRef = await addDoc(collectionRef, data1);
      console.log("Document written with ID: ", docRef.id);
      window.history.pushState({}, null, `/create?draftId=${docRef.id}`);
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        //restrict image file type (only allow png and jpg (jpeg))
        if (
            file.type !== "image/png" &&
            file.type !== "image/jpg" &&
            file.type !== "image/jpeg"
        ) {
          this.sendNotification(
              "アプリの画像はpngかjpg(jpeg)でお願いします",
              "error"
          );
          const upload = document.getElementById("upload");
          upload.value = "";
          return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          if (img.width !== 300 || img.height !== 200) {
            this.sendNotification(
                "アプリの画像は300×200pxでお願いします",
                "error"
            );
            const upload = document.getElementById("upload");
            upload.value = "";
          } else {
            const storage = getStorage();
            const reference = storageRef(storage, `app_images/${file.name}`);
            await uploadBytes(reference, file);
            this.imageUrl = await getDownloadURL(reference);
            this.uploadedImages.push(this.imageUrl);
          }
        };
      }
    },

    removeImage(index) {
      const imagePath = this.uploadedImages[index];
      let name = imagePath.substr(imagePath.indexOf('%2F') + 3, (imagePath.indexOf('?')) - (imagePath.indexOf('%2F') + 3));
      name = name.replace('%20', ' ');
      const desertRef = storageRef(
          getStorage(),
          `app_images/${name}`
      );
      deleteObject(desertRef)
          .then(() => {
            console.log("File deleted successfully");
            this.uploadedImages.splice(index, 1);
          })
          .catch((error) => {
            console.log("Uh-oh, an error occurred!");
            console.log(error);
          });
    },
    addTag() {
      const input = document.getElementById("input-tag");
      if (input.value.length === 0) {
        return;
      }
      this.tags.push(input.value);
      input.value = "";
    },
  },
};
</script>

<template>
  <div id="general-container">
    <h1>アプリを出版する</h1>

    <div v-if="auth.isLoggedIn && drafts.length !== 0" id="drafts">
      <h2>下書き一覧</h2>
      <div
          v-for="draft in drafts"
          :key="draft.id"
          :class="draft"
          id="draft-container"
      >
        <h3>{{ draft.title }}</h3>
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
  width: 20%;
  height: 35px;
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
  width: 20%;
  height: 35px;
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
