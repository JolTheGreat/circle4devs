<script>
import {getAuth} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  doc,
  startAfter
} from "firebase/firestore";
import Card from "~/components/Card.vue";
import axios from "axios";

export default {
  name: "DashboardPage",
  data() {
    return {
      isLoggedIn: false,
      user: [],
      recommends: [],
      apps: {
        apps: [],
        lastDoc: null
      }
    };
  },
  async mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      this.isLoggedIn = user !== null;

      let recommends = undefined;

      if (this.isLoggedIn) {
        recommends = await getDocs(
            query(
                collection(this.$db, "apps"),
                where("owner", "!=", doc(this.$db, "users", user.uid)),
                where("draft", "==", false),
                limit(10)
            )
        );
      } else {
        recommends = await getDocs(
            query(
                collection(this.$db, "apps"),
                where("draft", "==", false),
                limit(10)
            )
        );
      }
      this.recommends = recommends.docs.map((doc) => doc.data());
      this.recommends.forEach((recommend, index) => {
        recommend.id = recommends.docs[index].id;
      });
    });


    await this.getApps();
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
    async getApps() {
      let appQuery = null;

      if (this.apps.lastDoc) {
        appQuery = query(
            collection(this.$db, "apps"),
            where("draft", "==", false),
            limit(10),
            startAfter(this.apps.lastDoc)
        );
      } else {
        appQuery = query(
            collection(this.$db, "apps"),
            where("draft", "==", false),
            limit(10)
        );
      }


      const apps = await getDocs(appQuery);
      const map = apps.docs.map((doc) => doc.data());
      map.forEach((app, index) => {
        app.id = apps.docs[index].id;
      });
      this.apps.apps.push(...map)

      this.apps.lastDoc = apps.docs[apps.docs.length - 1];

      return apps.size;
    },
    async loadMore() {
      await this.getApps();
    },
  }
};
</script>

<template>
  <Head>
    <Title>Circle4Devsダッシュボード</Title>
  </Head>
  <div id="home">
    <div class="page">
      <h1>Circle4Devs Dashboard</h1>

      <div class="section" v-if="isLoggedIn">
        <h2>{{ getUser().displayName }}さんにオススメのアプリ</h2>
        <div id="recommends">
          <template v-for="recommend in recommends" :key="recommend.id">
            <Card
                :id="recommend.id"
                :title="recommend.title"
                :catchphrase="recommend.catchphrase"
                :image="recommend.images[0]"
                :owner="recommend.owner"
                :tags="recommend.tags"
                class="card"
            ></Card>
          </template>
        </div>
      </div>
      <div class="section" id="apps-section">
        <h2>アプリ一覧</h2>
        <div id="apps">
          <template v-for="(app, index) in apps.apps" :key="app.id">
            <Card
                :id="app.id"
                :title="app.title"
                :catchphrase="app.catchphrase"
                :image="app.images[0]"
                :owner="app.owner"
                :tags="app.tags"
                class="card"
            ></Card>
            <button v-if="index % 10 === 0 && index !== 0" @click="loadMore()">Load more</button>
          </template>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#home {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Corporate Logo ver3", sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background: #2dbfbf;
  overflow-x: hidden;
}

h1 {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 0.5em;
  color: white;
  border-bottom: 1px solid white;
}

h2 {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 0.5em;
  color: #333;
  border-left: 5px solid #333;
  padding-left: 0.5em;
}

.page {
  width: 100%;
  height: 100vh;
  margin: 10% auto auto;
  padding-bottom: 30%;
  position: relative;
  padding-left: 2rem;
  padding-right: 2rem;
}

.section {
  width: 100%;
  height: max-content;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
}

#recommends {
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

#recommends::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

#recommends::-webkit-scrollbar-thumb {
  background: #2dbfbf;
  border-radius: 10px;
  box-shadow: inset 2px 2px 2px hsla(0, 0%, 100%, 0.25),
  inset -2px -2px 2px rgba(0, 0, 0, 0.25);
}

#recommends::-webkit-scrollbar-track {
  background: linear-gradient(90deg, #201c29, #201c29 1px, #17141d 0, #17141d);
}

#apps-section{
  scroll-behavior: smooth;
  height: 800px;
  overflow-y: scroll;
}

#apps {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.card {
  margin: 15px;
}
</style>
