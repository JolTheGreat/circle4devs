<script>

import CardPart from "@/components/parts/Card.vue";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "@/main";
import {getAuth} from "firebase/auth";

export default {
  name: "ProfilePage",
  components: { CardPart },
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
        const appUser = doc(db, "users", user.uid);
        this.owner = await (await getDoc(appUser)).data();
        console.log(this.owner)
        const apps = await getDocs(
            query(
                collection(db, "apps"),
                where("owner", "==", appUser)
            )
        );
        // add apps to this.apps and add id to each app
        apps.docs.forEach((app, index) => {
          this.apps.push(app.data());
          this.apps[index].id = app.id;
        });
        console.log(this.apps )
      } else {
        this.$router.push("/");
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
          this.$router.push("/");
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }
};

</script>

<template>
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
          <div v-for="app in apps" :key="app.id" id="app">
            <CardPart
                      :id="app.id"
                      :title="app.title"
                      :catchphrase="app.catchphrase"
                      :image="app.images[0]"
                      :owner="app.owner"
                      :tags="app.tags"
            />
          </div>
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow-x: scroll;
  margin-top: 20px;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}


</style>