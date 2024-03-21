<script>
import {doc, getDoc} from "firebase/firestore";

export default {
  name: "CardPart",
  props: {
    id: String,
    title: String,
    catchphrase: String,
    image: String,
    owner: Object,
    tags: Array,
  },
  data() {
    return {
      idd: "",
      t: "",
      c: "",
      i: "",
      o: {},
      tgs: []
    };
  },
  async mounted() {
    if (
        this.id === undefined ||
        this.title === undefined ||
        this.catchphrase === undefined ||
        this.image === undefined ||
        this.owner === undefined ||
        this.tags === undefined
    ) {
      const docRef = doc(this.$db, "apps", this.id);
      const docSnap = await getDoc(docRef);

      if (this.id === undefined) {
        this.idd = docSnap.id;
      } else {
        this.idd = this.id;
      }

      if (this.title === undefined) {
        this.t = docSnap.data().title;
      } else {
        this.t = this.title;
      }

      if (this.catchphrase === undefined) {
        this.c = docSnap.data().catchphrase;
      } else {
        this.c = this.catchphrase;
      }

      if (this.image === undefined) {
        this.i = docSnap.data().images[0];
      } else {
        this.i = this.image;
      }

      if (this.owner === undefined) {
        this.o = docSnap.data().owner;
      } else {
        this.o = this.owner;
      }

      if (this.tags === undefined) {
        this.tgs = docSnap.data().tags;
      } else {
        this.tgs = this.tags;
      }
    } else {
      this.idd = this.id;
      this.t = this.title;
      this.c = this.catchphrase;
      this.i = this.image;
      this.o = this.owner;
      this.tgs = this.tags;
    }


    const owner = await getDoc(this.o);
    this.o = owner.data();
  },
  methods: {
    openArticle() {
      navigateTo(`/app/${this.idd}`, {external: true});
    },
  },
};
</script>

<template>
  <article class="card" @click="openArticle">
    <div class="card-image">
      <img v-bind:src="i" alt="image"/>
    </div>
    <div class="card-content">
      <h2>{{ t }}</h2>
      <p>{{ c }}</p>
      <div class="tags">
        <span v-for="tag in tgs" :key="tag">#{{ tag }}</span>
      </div>
      <div class="user">
        <img v-bind:src="o.photoUrl" alt="user"/>
        <a v-bind:href="'/user/' + o.id">{{ o.name }}</a>
      </div>
    </div>
  </article>

  <!-- Add more cards here -->
</template>
<style scoped>
.card {
  width: 300px;
  height: 480px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  white-space: nowrap;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.card-image {
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
  background: white;
  height: 100%;
}

.card-content h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-content p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem
}

.tags span {
  font-size: 0.8rem;
  height: min-content;
  color: #333;
  background: #eee;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.user {
  display: flex;
  align-items: center;
}

.user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.user a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.user a:hover {
  color: #555;
  text-decoration: underline;
}
</style>
