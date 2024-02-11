<script setup>
import {deleteDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import Markdown from "markdown-it";
import {deleteObject, getStorage, ref as storageRef} from "firebase/storage";
import {useRoute} from "vue-router";
import {getAuth} from "firebase/auth";

const nuxtApp = useNuxtApp();
const route = useRoute();
const id = route.params.id;
const auth = getAuth();

const data = await reactive(nuxtApp.$app);
let isOwner = ref(false);

auth.onAuthStateChanged((user) => {
  if (user) {
    isOwner.value = user.uid === data.owner.id;
  }
});

useSeoMeta({
  title: data.title + "　-　Circle4Devs",
  description: data.catchphrase,
  image: data.images[0],
  twitterCard: "summary_large_image",
  twitterSite: "@Circle4Devs",
  twitterCreator: "@Circle4Devs",
  twitterImage: data.images[0],
  ogType: "article",
  ogSiteName: "Circle",
  ogTitle: data.title,
  ogDescription: data.catchphrase,
  ogImage: data.images[0],
  ogUrl: data.url,
})

const getMarkdown = () => {
  const md = new Markdown();
  return md.render(data.description);
};

const openApp = () => {
  window.open(data.url, "_blank");
};

const deleteApp = async () => {
  if (confirm("アプリを削除しますか？ この操作は取り消せません")) {
    const id = route.params.id;
    const docRef = doc(nuxtApp.$db, "apps", id);
    const app = await getDoc(docRef);

    app.data().images.forEach((imagePath) => {
      let name = imagePath.substr(imagePath.indexOf('%2F') + 3, (imagePath.indexOf('?')) - (imagePath.indexOf('%2F') + 3));
      name = name.replace('%20', ' ');
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
};

const revertToDraft = async () => {
  const docRef = doc(nuxtApp.$db, "apps", id);
  await updateDoc(docRef, {
    draft: true,
  });
  alert("下書きに戻しました。アプリを出版するときの画面にて確認できます。")
  navigateTo("/dashboard");
};
</script>

<template>
  <div id="article">
    <div class="article-header">
      <h1>{{ data.title }}</h1>
      <p>{{ data.catchphrase }}</p>
      <img :src="data.images[0]" alt="image" id="main-image"/>
      <div id="images" v-for="image in data.images.slice(1)" :key="image">
        <img :src="image" alt="image"/>
      </div>
      <div id="tags" v-for="tag in data.tags" :key="tag">
        <span>#{{ tag }}</span>
      </div>
      <div class="user">
        <img :src="data.owner.photoUrl" alt="user"/>
        <a :href="'/user/' + data.owner.id">{{ data.owner.name }}</a>
      </div>
      <button id="open-button" @click="openApp()">アプリを開く</button>
      <button v-if="isOwner" id="delete-button" @click="deleteApp()">アプリを削除</button>
      <button v-if="isOwner" id="edit-button" @click="revertToDraft()">下書きに戻す</button>
    </div>
    <div class="article-content">
      <div v-html="getMarkdown()"></div>
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

#main-image {
  width: 600px;
  height: 300px;
  object-fit: cover;
  margin-top: 20px;
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
  margin-top: 20px;
}

#tags {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

#tags span {
  font-size: 0.8rem;
  color: #333;
  background: #eee;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
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
