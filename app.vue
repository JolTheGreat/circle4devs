<template>
  <LandingHeader v-if="header"></LandingHeader>
  <AppHeader v-else></AppHeader>
    <NuxtPage />
</template>

<script>
import appheader from "~/components/AppHeader.vue";
import landingheader from "~/components/LandingHeader.vue";

export default {
  name: "App",
  components: { appheader, landingheader },
  computed: {
    header() {
      const route = useRoute();
      return (
        route.path === "/" ||
        route.path === "/auth" ||
        route.path === "/privacy"
      );
    },
  },
  mounted() {

  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Noto Sans JP", serif;
}

body {
  margin-top: 5rem;
}
</style>
<script setup lang="ts">
</script>