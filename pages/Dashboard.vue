<script>
import {getAuth} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  doc,
} from "firebase/firestore";
import Card from "~/components/card.vue";

export default {
  name: "DashboardPage",
  components: {Card},
  data() {
    return {
      isLoggedIn: false,
      user: [],
      recommends: [],
    };
  },
  metaInfo: {
    title: "This is title"
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
      //add document id to the data
      console.log(this.recommends);
      this.recommends.forEach((recommend, index) => {
        recommend.id = recommends.docs[index].id;
      });
    });
  },
  methods: {
    getUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        return user;
      } else {
        return null;
      }
    },
  },
};
</script>

<template>
  <div id="home">
    <div class="page">
      <h1>Circle Dashboard</h1>

      <div class="section">
        <h2 v-if="isLoggedIn">{{ getUser().displayName }}さんにオススメのアプリ</h2>
        <h2 v-else>オススメのアプリ</h2>
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
      <!-- Create a section for a trending app -->
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

.card {
  margin: 15px;
}
</style>
