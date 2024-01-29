<script>
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import CardPart from "@/components/parts/Card.vue";
export default {
  name: "SearchPage",
  components: { CardPart },
  data() {
    return {
      searchClient: algoliasearch(
        "VFQE8S5Y20",
        "2352cde0d4c737c8389b852a1c8b348c"
      ),
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
            <CardPart v-bind:id="item.objectID" />
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
