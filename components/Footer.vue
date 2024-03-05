<template>
  <footer id="footer">
    <div class="links">
      <router-link to="/">ホーム</router-link>
      <router-link to="/privacy">プライバシーポリシー</router-link>
      <router-link to="/auth">ログイン</router-link>
    </div>
    <div class="copyright">
      &copy; {{ getCurrentYear() }} Circle4Devs
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  methods: {
    getCurrentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
#footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

#footer .links {
  display: flex;
  list-style: none;
}

#footer .links a {
  margin-left: 1rem;
  text-decoration: none;
  color: #000;
  font-weight: 500;
}

#footer .links a:hover {
  color: #555;
}

#footer .copyright {
  font-weight: 500;
}

@media (max-width: 768px) {
  #footer {
    padding: 1rem;
  }
}
</style>
