<script>
import { getAuth, signOut } from "firebase/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "AppHeader",
  components: {FontAwesomeIcon},
  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  },
  methods: {
    logOut: async function () {
      signOut(getAuth())
        .then(() => {
          navigateTo("/auth");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    publish: function () {
      if (!this.isLoggedIn) {
        navigateTo("/auth");
        return;
      }
      navigateTo("/create");
    },
  },
};
</script>

<template>
  <div id="header">
    <img
      src="@/assets/logo.png"
      alt="logo"
      @click="navigateTo('/dashboard')"
    />
    <ul>
      <li>
        <button @click="publish" id="post-button">アプリを出版する</button>
      </li>
    </ul>
    <div id="pane">
      <button @click="navigateTo('/search')">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      </button>
      <button @click="navigateTo('/profile')">
        <font-awesome-icon icon="fa-solid fa-user" />
      </button>
      <button v-if="isLoggedIn" @click="logOut">ログアウト</button>
      <button v-else @click="navigateTo('/auth')">ログイン</button>
    </div>
  </div>
</template>

<style scoped>
#header {
  top: 0;
  font-family: "Corporate-Logo-V3-Bold", sans-serif;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 1rem 2rem;
  width: 100%;
  height: 5rem;
  z-index: 200;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#header img {
  width: auto;
  height: 3rem;
}

#header img:hover {
  cursor: pointer;
}

#header ul {
  display: flex;
  list-style: none;
}

#header ul li {
  margin-left: 1rem;
}

#header ul li a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
}

#header ul li a:hover {
  color: #555;
}

button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
}

#post-button {
  background-color: #2dbfbf;
  color: #fff;
}

#post-button:hover {
  background-color: #1d7a7a;
}

#header ul {
  display: flex;
  list-style: none;
  align-items: center;
}

#pane {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>
