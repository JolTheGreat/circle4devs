<script>
import "instantsearch.css/themes/satellite.css";
import algoliasearch from "algoliasearch/lite.js";

export default {
  name: "SearchPage",
  data() {
    return {
      query: "",
      hits: [],
      index: null,
    };
  },
  mounted() {
    const searchClient = algoliasearch(
        "VFQE8S5Y20",
        "2352cde0d4c737c8389b852a1c8b348c"
    );
    this.index = searchClient.initIndex("apps");
    const query = this.$route.query.q;
    if (query) {
      this.query = query;
    }
    this.search();
  },
  methods: {
    search() {
      this.index.search(this.query).then(({hits}) => {
        this.hits = hits;
      });
    }
  },
};
</script>

<template>
  <Head>
    <Title>検索</Title>
  </Head>
  <div id="container">
    <h2>検索</h2>
    <div id="search-box">
      <input v-model="query" @input="search" type="text" placeholder="検索"/>
      <div id="hits">
        <template v-for="hit in hits" :key="hit.objectID" class="entries">
          <Card
              :id="hit.objectID"
          />
        </template>
      </div>
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
  margin-bottom: 5rem;
}

#search-box input {
  width: 50%;
  height: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

#hits {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

:deep(.card) {
  margin: 1rem;
}



@media (max-width: 768px) {
  #container {
    padding: 120px;
  }
}
</style>
