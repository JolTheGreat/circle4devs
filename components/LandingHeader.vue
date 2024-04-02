<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "HeaderView",
  components: {FontAwesomeIcon},
};
</script>

<template>
  <div id="header">
    <img src="@/assets/logo.png" @click="navigateTo('/')" alt="logo" />
    <ul>
      <li>
        <router-link to="/privacy"><font-awesome-icon icon="fa-solid fa-file-contract"></font-awesome-icon></router-link>
      </li>

      <li>
        <router-link to="/auth"><font-awesome-icon icon="fa-solid fa-sign-in-alt"></font-awesome-icon></router-link>
      </li>
    </ul>
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

#header ul {
  display: flex;
  list-style: none;
  align-items: center;
}

li:hover {
  cursor: pointer;
}

</style>
