<script>
import {
  collection,
  doc, getDoc, getDocs, query, where,
} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "UserPage",
  components: {FontAwesomeIcon},
  data() {
    return {
      user: {},
      apps: [],
      badges: [],
    };
  },
  async mounted() {
    const auth = getAuth();
    const userId = this.$route.params.id;

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.uid === userId) {
          navigateTo("/profile");
        }
      }
    });

    const userRef = doc(this.$db, "users", userId);
    const userSnap = await getDoc(userRef);
    this.user = userSnap.data();
    for (const badge of this.user.badges) {
      const badgeDoc = doc(this.$db, "badges", badge.id);
      const badgeData = await (await getDoc(badgeDoc)).data();
      this.badges.push(badgeData);
    }

    const apps = await getDocs(
        query(
            collection(this.$db, "apps"),
            where("owner", "==", userRef),
            where("draft", "==", false))
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
      <div id="badges">
        <div id="badges-list">
          <template v-for="badge in badges" :key="badge.id">
            <font-awesome-icon
                v-if="badge.name==='新人バッジ'"
                icon="fa-solid fa-star"
                size="xl"
                :title="badge.name + '\n\n説明：' + badge.description + '\n\n条件：' + badge.condition"
                style="color: #007BFF"
            />
            <font-awesome-icon
                v-if="badge.name==='パイオニアバッジ'"
                icon="fa-solid fa-star"
                size="xl"
                :title="badge.name + '\n\n説明：' + badge.description + '\n\n条件：' + badge.condition"
                style="color: #fff900"
            />
            <font-awesome-icon
                v-if="badge.name==='管理者バッジ'"
                icon="fa-solid fa-star"
                size="xl"
                :title="badge.name + '\n\n説明：' + badge.description + '\n\n条件：' + badge.condition"
                style="color: #e30000"
            />
          </template>
        </div>
      </div>
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

#badges {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#badges-list:hover {
  cursor: help;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  overflow-y: hidden;
  background: whitesmoke;
}

</style>