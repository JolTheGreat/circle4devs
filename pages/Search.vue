<script>
import "instantsearch.css/themes/satellite.css";

export default {
  name: "SearchPage",
  data() {
    return {
      searchClient: useAlgoliaRef()
    };
  },
  mounted() {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q");

    if (query !== null) {
      document.getElementById("search-box").scrollIntoView();
    }
  },
};
</script>

<template>
  <div id="container">
    <h2>検索</h2>
    <div id="search-box">
      <ais-instant-search :search-client="searchClient" index-name="firestore">
        <ais-search-box />
        <ais-hits>
          <template v-slot:item="{ item }">
            <Card v-bind:id="item.objectID" />
          </template>
        </ais-hits>
      </ais-instant-search>
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
  padding-top: 10%;
}

#search-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
