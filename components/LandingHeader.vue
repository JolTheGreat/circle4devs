<script>
export default {
  name: "HeaderView",
  methods: {
    register() {
      navigateTo("/auth")
    },
    login() {
      navigateTo("/auth")
    },
  },
};
</script>

<template>
  <div id="header">
    <img src="@/assets/logo.png" @click="navigateTo('/')" alt="logo" />
    <ul>
      <!--      <li><router-link to="/">Circle4Devsのご紹介</router-link></li>-->
      <li>
        <router-link to="/privacy">プライバシーポリシー＆利用規約</router-link>
      </li>

      <li><button @click="register" id="register">登録する</button></li>
      <li><button @click="login" id="login">ログインする</button></li>
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

#register,
#login {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
}

#register {
  background-color: #2dbfbf;
  color: #fff;
}

#login {
  background-color: #fff;
  color: #2dbfbf;
  border: 1px solid #2dbfbf;
}

#register:hover {
  background-color: #1d7a7a;
}

#login:hover {
  background-color: #fff;
  color: #1d7a7a;
  border: 1px solid #1d7a7a;
}

#header ul {
  display: flex;
  list-style: none;
  align-items: center;
}

@media (max-width: 768px) {
  #header {
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 18rem;
  }

  #header img {
    margin-bottom: 1rem;
  }

  #header ul {
    flex-direction: column;
  }

  #header ul li {
    margin-left: 0;
    margin-bottom: 1rem;
  }

  #header ul li a {
    font-size: 1.2rem;
  }
}
</style>
