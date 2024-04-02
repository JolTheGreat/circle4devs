<script setup>
import {collection, deleteDoc, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import Markdown from "markdown-it";
import {deleteObject, getStorage, ref as storageRef} from "firebase/storage";
import {useRoute} from "vue-router";
import {getAuth} from "firebase/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const nuxtApp = useNuxtApp();
const route = useRoute();
const id = route.params.id;
const auth = getAuth();

const data = await reactive(nuxtApp.$app);
const date = data.createdAt.toDate();
//１日前などの表記に変換。今日だったら時刻を表示
const dateText = (() => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);
  if (diffDays < 1) {
    return `${date.getHours()}時${date.getMinutes()}分`;
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)}日前`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}週間前`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  } else {
    return `${Math.floor(diffDays / 365)}年前`;
  }
})();

let isOwner = ref(false);
let loggedIn = ref(false);
let satisfactionScore = ref(1);

auth.onAuthStateChanged((user) => {
  if (user) {
    isOwner.value = user.uid === data.owner.id;
    loggedIn.value = true;
    for (let i = 0; i < data.satisfactions.length; i++) {
      if (data.satisfactions[i].userId === auth.currentUser.uid) {
        satisfactionScore.value = data.satisfactions[i].score;
      }
    }
  }
});


useSeoMeta({
  title: data.title,
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

const alreadyLiked = () => {
  if (!auth.currentUser) {
    return false;
  }

  for (let i = 0; i < data.likes.length; i++) {
    if (data.likes[i].userId === auth.currentUser.uid) {
      return true;
    }
  }

  return false;
}

const likeApp = async () => {
  if (!auth.currentUser) {
    navigateTo("/auth");
  }

  if (alreadyLiked()) {
    return;
  }

  const likesCollection = collection(nuxtApp.$db, "apps", id, "likes");
  //use user id as an id
  await setDoc(doc(likesCollection, auth.currentUser.uid), {
    userId: auth.currentUser.uid,
    appId: id,
  });

  data.likes.push({
    userId: auth.currentUser.uid,
    appId: id,
  });
  data.likeCount++;
};

const unlikeApp = async () => {
  if (!auth.currentUser) {
    navigateTo("/auth");
  }

  if (!alreadyLiked()) {
    return;
  }

  const likesCollection = collection(nuxtApp.$db, "apps", id, "likes");
  const likesDoc = await getDoc(doc(likesCollection, auth.currentUser.uid));
  await deleteDoc(likesDoc.ref);

  for (let i = 0; i < data.likes.length; i++) {
    if (data.likes[i].userId === auth.currentUser.uid) {
      data.likes.splice(i, 1);
      break;
    }
  }
  data.likeCount--;
};


const setSatisfactionScore = (score) => {
  if (!auth.currentUser) {
    navigateTo("/auth?redirect=" + route.fullPath);
  }

  const satisfactionCollection = collection(nuxtApp.$db, "apps", id, "satisfactions");
  const scoreCount = Number(score);
  setDoc(doc(satisfactionCollection, auth.currentUser.uid), {
    userId: auth.currentUser.uid,
    appId: id,
    score: scoreCount,
  });

  if (data.satisfactions.some(satisfaction => satisfaction.userId === auth.currentUser.uid)) {
    for (let i = 0; i < data.satisfactions.length; i++) {
      if (data.satisfactions[i].userId === auth.currentUser.uid) {
        data.satisfactions[i].score = scoreCount;
        break;
      }
    }
  } else {
    data.satisfactions.push({
      userId: auth.currentUser.uid,
      appId: id,
      score: scoreCount,
    });
  }
  console.log(data.satisfactions);
  //loop through satisfactions and calculate the average
  let total = 0;
  for (let i = 0; i < data.satisfactions.length; i++) {
    total += data.satisfactions[i].score;
  }
  data.satisfactionScore = (total / (data.satisfactions.length - 1)).toFixed(1);
};

const deleteSatisfactionScore = async () => {
  if (!auth.currentUser) {
    navigateTo("/auth");
  }

  const satisfactionCollection = collection(nuxtApp.$db, "apps", id, "satisfactions");
  const satisfactionDoc = await getDoc(doc(satisfactionCollection, auth.currentUser.uid));

  if (!satisfactionDoc.exists()) {
    return;
  }
  await deleteDoc(satisfactionDoc.ref);

  for (let i = 0; i < data.satisfactions.length; i++) {
    if (data.satisfactions[i].userId === auth.currentUser.uid) {
      data.satisfactions.splice(i, 1);
      break;
    }
  }

  let total = 0;
  for (let i = 0; i < data.satisfactions.length; i++) {
    total += data.satisfactions[i].score;
  }

  if (total === 0) {
    data.satisfactionScore = 0;
  } else {
    data.satisfactionScore = (total / (data.satisfactions.length - 1)).toFixed(1);
  }
};
</script>

<template>
  <div id="article">
    <div class="article-header">
      <h1>{{ data.title }}</h1>
      <p>{{ data.catchphrase }}</p>
      <p style="font-size: 15px; color: black">{{ dateText }}</p>
      <div id="stats">
        <div>
          <span id="user-icon" title="ユーザー数（評価の数から算出されます）"><font-awesome-icon icon="fa-solid fa-user" size="2xl"/></span>
          <p>{{data.satisfactions.length - 1}}人</p>
        </div>
        <div>
          <span id="satisfaction-icon" title="満足度"><font-awesome-icon icon="fa-solid fa-face-smile" size="2xl"/></span>
          <p>{{ data.satisfactionScore }}%</p>
        </div>
      </div>
      <div id="rating">
        <div id="like">
          <font-awesome-icon v-if="alreadyLiked()" @click="unlikeApp" icon="fa-solid fa-heart" style="color: #f91880"
                             id="unlike-button"/>
          <font-awesome-icon v-else icon="fa-regular fa-heart" @click="likeApp" style="color: #f91880"
                             id="like-button"/>
          <span>{{ data.likeCount }}</span>
        </div>
        <div id="satisfaction">
          <input type="range" min="1" max="100" v-model="satisfactionScore" style="width: 100px;"/>
          <span>あなたの評価：　{{ satisfactionScore }}%</span>
          <button @click="setSatisfactionScore(satisfactionScore)">評価する</button>
          <button v-if="loggedIn && data.satisfactions.some(satisfaction => satisfaction.userId === auth.currentUser.uid)"
                  @click="deleteSatisfactionScore()">評価を取り消す
          </button>
        </div>
      </div>
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

#stats {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

#stats p {
  color: black;
}

#stats div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
}

#user-icon {
  color: #2dbfbf;
}

#satisfaction-icon {
  color: #f91880;
}

#unlike-button:hover {
  cursor: pointer;
}

#rating {
  display: flex;
  flex-direction: row;
  width: 50%;
  margin-top: 40px;
  align-items: center;
}

#rating span {
  font-weight: bold;
}

#like {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}

#like:hover {
  cursor: pointer;
}

#like span {
  margin-left: 10px;
}

#like span:hover {
  cursor: auto;
}

#satisfaction {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: 20px;
}

#satisfaction span {
  font-weight: bold;
}

#satisfaction button {
  padding: 5px 10px;
  width: 5rem;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: #2dbfbf;
  color: #fff;
}

#satisfaction button:hover {
  background-color: #219191;
}

#main-image {
  width: 100%;
  max-width: 600px;
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
  width: 75%;
  max-width: 500px;
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
  margin-top: 40px;
  border-left: 8px solid #2dbfbf; /* Width represents higher significance */
  padding-left: 10px;
}

:deep(.article-content) h2 {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 40px;
  border-left: 6px solid #2dbfbf; /* Moderately significant */
  padding-left: 10px;
}

:deep(.article-content) h3 {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 40px;
  border-left: 4px solid #2dbfbf; /* Less significant */
  padding-left: 10px;
}

:deep(.article-content) h4 {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 40px;
  border-left: 3px solid #2dbfbf; /* Even less significant */
  padding-left: 10px;
}

:deep(.article-content) h5 {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 40px;
  border-left: 2px solid #2dbfbf; /* Relatively minor */
  padding-left: 10px;
}

:deep(.article-content) h6 {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 40px;
  border-left: 1px solid #2dbfbf; /* Least significant */
  padding-left: 10px;
}

:deep(.article-content) img {
  width: 70%;
  max-width: 600px;
  height: 70%;
  display: block;
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
  margin-left: 16px;
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
