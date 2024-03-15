<script>

import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "ProfilePage",
  components: {FontAwesomeIcon},
  data() {
    return {
      owner: "",
      apps: [],
      badges: []
    };
  },
  mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const appUser = doc(this.$db, "users", user.uid);
        this.owner = await (await getDoc(appUser)).data();
        for (const badge of this.owner.badges) {
          const badgeDoc = doc(this.$db, "badges", badge.id);
          const badgeData = await (await getDoc(badgeDoc)).data();
          this.badges.push(badgeData);
        }

        const apps = await getDocs(
            query(
                collection(this.$db, "apps"),
                where("owner", "==", appUser),
                where("draft", "==", false)
            )
        );

        apps.docs.forEach((app, index) => {
          this.apps.push(app.data());
          this.apps[index].id = app.id;
        });
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
          navigateTo("/");
        });
      }
    }
  }
};

</script>

<template>
  <Head>
    <Title>{{ owner.name }}</Title>
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
          <div id="actions">
            <button class="action-button" @click="navigateTo('/edituser')">
              <font-awesome-icon icon="pen" style="color: #007BFF;"/>
            </button>
            <button class="action-button" @click="deleteAccount">
              <font-awesome-icon icon="fa-solid fa-trash" style="color: #fe001e;"/>
            </button>

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

#actions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.action-button {
  margin-top: 5%;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
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
  border-radius: 12px;
}

</style>