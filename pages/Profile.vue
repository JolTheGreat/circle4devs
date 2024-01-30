<script>

import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {getAuth} from "firebase/auth";

export default {
  name: "ProfilePage",
  data() {
    return {
      owner: "",
      apps: [],
    };
  },
  mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const appUser = doc(this.$db, "users", user.uid);
        this.owner = await (await getDoc(appUser)).data();
        console.log(this.owner)
        const apps = await getDocs(
            query(
                collection(this.$db, "apps"),
                where("owner", "==", appUser)
            )
        );
        // add app to this.app and add id to each app
        apps.docs.forEach((app, index) => {
          this.apps.push(app.data());
          this.apps[index].id = app.id;
        });
        console.log(this.apps )
      } else {
        navigateTo("/");
      }
    });
  },
  methods: {
    deleteAccount() {
      if (confirm("アカウントを削除しますか？ この操作は取り消せません")) {
        const auth = getAuth();
        const user = auth.currentUser;
        user.delete().then(() => {
          console.log("deleted");
          navigateTo("/");
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }
};

</script>

<template>
  <Head>
    <Title>{{owner.name}}</Title>
  </Head>
  <div id="container">
    <h2>プロフィール</h2>
    <div id="profile-box">
      <div id="profile">
        <div id="profile-image">
          <img :src="owner.photoUrl" alt="プロフィール画像"/>
        </div>
        <div id="profile-name">
          <h3>{{ owner.name }}</h3>
        </div>
        <button id="delete-button" @click="deleteAccount">アカウントを削除</button>
      </div>
      <div id="apps">
        <h3>投稿したアプリ</h3>
        <div id="apps-list">
          <template v-for="app in apps" :key="app.id">
            <Card
                :id="app.id"
                :title="app.title"
                :catchphrase="app.catchphrase"
                :image="app.images[0]"
                :owner="app.owner"
                :tags="app.tags"
            />
          </template>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10%;
}

#profile-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#profile {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  border-radius: 8px;
  padding: 2%;
  margin-bottom: 10%;
  margin-top: 5%;
}

#profile-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#profile-image img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

#profile-name {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

#profile-name h3 {
  font-size: 2rem;
  font-weight: bold;
}

#delete-button {
  margin-top: 5%;
}

#apps {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#apps h3 {
  font-size: 2rem;
  font-weight: bold;
}

#apps-list {
  margin-top: 2rem;
  padding: 1rem;
  height: max-content;
  justify-content: space-between;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  border-radius: 1rem;
  background: whitesmoke;
}

#apps-list::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

#apps-list::-webkit-scrollbar-thumb {
  background: #2dbfbf;
  border-radius: 10px;
  box-shadow: inset 2px 2px 2px hsla(0, 0%, 100%, 0.25),
  inset -2px -2px 2px rgba(0, 0, 0, 0.25);
}

#apps-list::-webkit-scrollbar-track {
  background: linear-gradient(90deg, #201c29, #201c29 1px, #17141d 0, #17141d);
}

.card {
  margin: 15px;
}

</style>