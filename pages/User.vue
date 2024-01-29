<script>
import {
  collection,
  doc, getDoc, getDocs, query, where,
} from "firebase/firestore";
import {db} from "@/main";
import CardPart from "@/components/parts/Card.vue";
import {getAuth} from "firebase/auth";

export default {
  name: "UserPage",
  components: {CardPart},
  data() {
    return {
      user: {},
      apps: []
    };
  },
  async mounted() {
    const auth = getAuth();
    const userId = this.$route.params.id;

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.uid === userId) {
          this.$router.push("/profile");
        }
      }
    });

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    this.user = userSnap.data();

    const apps = await getDocs(
        query(
            collection(db, "apps"),
            where("owner", "==", userRef)
        )
    );
    apps.docs.forEach((app, index) => {
      this.apps.push(app.data());
      this.apps[index].id = app.id;
    });
  },
  methods: {},
};

</script>

<template>
  <div id="container">
    <div id="profile">
      <div id="profile-image">
        <img :src="user.photoUrl" alt="プロフィール画像"/>
      </div>
      <div id="profile-name">
        <h3>{{ user.name }}</h3>
      </div>
    </div>

    <div id="apps">
      <h3>投稿したアプリ</h3>
      <div id="apps-list">
        <div v-for="app in apps" :key="app.id" id="app">
          <CardPart :id="app.id"
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
  padding: 10%;
}

</style>