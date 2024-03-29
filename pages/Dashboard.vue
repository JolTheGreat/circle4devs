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
    <Meta name="description" content="Circle4Devsのダッシュボードです"></Meta>
  </Head>
  <div id="home">
    <div class="page">
      <h1>Circle4Devs Dashboard</h1>

      <div class="section" v-if="isLoggedIn">
        <h2>{{ getUser().displayName }}さんにオススメのアプリ</h2>
        <div class="app-container">
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
        <div class="app-container">
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
    <Footer></Footer>
  </div>
</template>

<style scoped>
#home {
  margin: 0;
  top: 0;
  padding: 0;
  font-size: 1rem;
  height: max-content;
  line-height: 1.5;
  color: #333;
  background: #2dbfbf;
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
  position: relative;
  padding: 4rem 2rem 3rem;
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

.app-container {
  margin-top: 2rem;
  padding: 1rem;
  height: max-content;
  border-radius: 1rem;
  background: whitesmoke;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  overflow-y: hidden;
}




.card {
  margin: 15px;
}

@media (max-width: 768px) {
  .page {
    padding-left: 1rem;
    padding-right: 1rem;
  }

}


</style>
