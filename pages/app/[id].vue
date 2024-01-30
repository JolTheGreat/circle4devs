<script>
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import Markdown from "markdown-it";
import {getAuth} from "firebase/auth";
import {deleteObject, getStorage, ref as storageRef} from "firebase/storage";
import {updateDoc} from "firebase/firestore";

export default {
  name: "AppPage",
  data() {
    return {
      title: "",
      catchphrase: "",
      images: [],
      description: "",
      owner: "",
      url: "",
      isOwner: false,
    };
  },
  mounted() {
    const auth = getAuth();
    const id = this.$route.params.id;
    const docRef = doc(this.$db, "apps", id);
    getDoc(docRef).then(async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        this.title = data.title;
        this.catchphrase = data.catchphrase;
        this.images = data.images;
        console.log(this.images)
        this.description = data.description;
        this.owner = await (await getDoc(data.owner)).data();
        this.url = data.url;

        auth.onAuthStateChanged((user) => {
          if (user) {
            if (user.uid === this.owner.id) {
              this.isOwner = true;
            }
          }
        });
      } else {
        console.log("No such document!");
      }
    });
  },
  computed: {
    getMarkdown() {
      const md = new Markdown();
      return md.render(this.description);
    },
  },
  methods: {
    openApp() {
      window.open(this.url, "_blank");
    },
    async deleteApp() {
      if (confirm("アプリを削除しますか？ この操作は取り消せません")) {
        const id = this.$route.params.id;
        const docRef = doc(this.$db, "apps", id);
        const app = await getDoc(docRef);

        app.data().images.forEach((imagePath) => {
          let name = imagePath.substr(imagePath.indexOf('%2F') + 3, (imagePath.indexOf('?')) - (imagePath.indexOf('%2F') + 3));
          name = name.replace('%20', ' ');
          console.log(name)
          const imageRef = storageRef(getStorage(), `app_images/${name}`);
          deleteObject(imageRef).then(() => {
          }).catch(() => {
          });
        });



        deleteDoc(docRef).then(() => {
          alert("アプリを削除しました")
          navigateTo("/dashboard");
        });
      }
    },
    async revertToDraft() {
      const id = this.$route.params.id;
      const docRef = doc(this.$db, "apps", id);
      await updateDoc(docRef, {
        draft: true,
      });
      alert("下書きに戻しました。アプリを出版するときの画面にて確認できます。")
      navigateTo("/dashboard");
    }
  },
};
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta name="description" :content="catchphrase"/>
    <Meta property="og:title" :content="title"/>
    <Meta property="og:description" :content="catchphrase"/>
    <Meta property="og:image" :content="images[0]"/>
    <Meta property="og:url" :content="url"/>
    <Meta property="og:type" content="website"/>
    <Meta property="og:site_name" content="Circle4Devs"/>
    <Meta name="twitter:card" content="summary_large_image"/>
    <Meta name="twitter:site" content="@Circle4Devs"/>
    <Meta name="twitter:title" :content="title"/>
    <Meta name="twitter:description" :content="catchphrase"/>
    <Meta name="twitter:image" :content="images[0]"/>
    <Meta name="twitter:url" :content="url"/>
    <Meta name="twitter:domain" content="Circle4Devs"/>

  </Head>

  <div id="article">
    <div class="article-header">
      <h1>{{ title }}</h1>
      <p>{{ catchphrase }}</p>
      <div id="images" v-for="image in images" v-bind:key="image">
        <img v-bind:src="image" alt="image"/>
      </div>
      <div class="user">
        <img v-bind:src="owner.photoUrl" alt="user"/>
        <a v-bind:href="'/user/' + owner.id">{{ owner.name }}</a>
      </div>
      <button id="open-button" @click="openApp">アプリを開く</button>
      <button v-if="isOwner" id="delete-button" @click="deleteApp">アプリを削除</button> <!-- Add this line -->
      <button v-if="isOwner" id="edit-button" @click="revertToDraft">下書きに戻す</button> <!-- Add this line -->
    </div>
    <div class="article-content">
      <div v-html="getMarkdown"></div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Source+Code+Pro&display=swap");

#article {
  width: 100%;
  margin: 100px auto;
  padding-left: 20px;
  padding-right: 20px;
}

.article-header {
  margin-bottom: 50px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}

.article-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

.article-header p {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 10px;
  color: #777;
}

#images {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow-x: scroll;
}

#images img {
  width: 300px;
  height: 200px;
  margin: 20px;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.user img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user a {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2dbfbf;
  text-decoration: none;
}

.user a:hover {
  color: #219191;
}

#open-button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: #2dbfbf;
  color: #fff;
}

#open-button:hover {
  background-color: #219191;
}

#delete-button {
  margin-top: 20px;
  margin-left: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: red;
  color: #fff;
}

#delete-button:hover {
  background-color: #c91818;
}

#edit-button {
  margin-top: 20px;
  margin-left: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: #125c5a;
  color: #fff;
}

#edit-button:hover {
  background-color: #0b3d3b;
}

.article-content a {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2dbfbf;
}

.article-content a:hover {
  color: #219191;
}

/* Style for the Markdown-rendered content */
.article-content {
  font-family: "Arial", sans-serif;
  line-height: 1.6;
  font-size: 16px;
  color: #333;
}

:deep(.article-content) h1 {
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 8px solid #2dbfbf; /* Width represents higher significance */
  padding-left: 10px;
}

:deep(.article-content) h2 {
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 6px solid #2dbfbf; /* Moderately significant */
  padding-left: 10px;
}

:deep(.article-content) h3 {
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 4px solid #2dbfbf; /* Less significant */
  padding-left: 10px;
}

:deep(.article-content) h4 {
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 3px solid #2dbfbf; /* Even less significant */
  padding-left: 10px;
}

:deep(.article-content) h5 {
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 2px solid #2dbfbf; /* Relatively minor */
  padding-left: 10px;
}

:deep(.article-content) h6 {
  font-weight: bold;
  margin-bottom: 20px;
  border-left: 1px solid #2dbfbf; /* Least significant */
  padding-left: 10px;
}

:deep(.article-content) img {
  width: 70%;
  height: 70%;
}

:deep(.article-content) p {
  margin-bottom: 10px;
}

:deep(.article-content) a:hover {
  color: #219191;
}

:deep(.article-content) ul {
  margin-bottom: 10px;
  margin-left: 2%;
}

:deep(.article-content) ol {
  margin-bottom: 10px;
}

:deep(.article-content) li {
  margin-bottom: 8px;
}

:deep(.article-content) blockquote {
  margin-bottom: 10px;
}

:deep(.article-content) pre {
  margin-bottom: 10px;
}

:deep(.article-content) code {
  margin-bottom: 10px;
}

:deep(.article-content) table {
  margin-bottom: 10px;
}
</style>
