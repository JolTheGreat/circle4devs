<template>
  <div id="landing">
    <div class="title-page">
      <div class="title-page-content">
        <div class="title-wrapper">
          <h1>個人開発を一歩先へ</h1>
          <p>開発したアプリを共有しよう！</p>
          <button @click="start">Circleを開く</button>
        </div>
        <div class="social-links">
          <a href=""><font-awesome-icon icon="fa-brands fa-twitter" /></a>
          <a href="#"><font-awesome-icon icon="fa-brands fa-discord" /></a>
        </div>
      </div>
      <img
        class="vector-art"
        src="../../assets/undraw_software_engineer_re_tnjc.svg"
        alt="vector art"
      />
    </div>
    <section id="about">
      <h1>Circleとは</h1>
      <p>
        <strong>Circle</strong>
        は、個人開発者同士がアプリを通じて交わるためのプラットフォームです。下記はこれから実装していきたい機能の一覧です。今のところ、他の個人開発者が作っているものを把握し、出版したアプリをXなどで共有することができます。
      </p>
      <div id="communication">
        <img src="../../assets/undraw_chat_re_re1u.svg" alt="vector art" />
        <div>
          <h2>開発者とユーザーのコミュニケーション</h2>
          <p>
            Circleは、ユーザー同士がアプリやコンテンツについての感想、評価、コメントを共有できる場所です。ユーザーのレビューやコメントを通じて、開発者はアプリの改善・修正に励めます。
          </p>
        </div>
      </div>
      <div id="like">
        <div>
          <h2>いいね、共感、評価</h2>
          <p>
            Circleでは、アプリやレビューに対する「いいね」や「共感」のリアクションを使って、共感を示し、評価を行います。評価を元にユーザーは質の高いアプリを見極め、それらを積極的に使うようになるでしょう。
          </p>
        </div>
        <img src="../../assets/undraw_love_it_xkc2.svg" alt="vector art" />
      </div>
      <div id="ranking">
        <img
          src="../../assets/undraw_personal_goals_re_iow7.svg"
          alt="vector art"
        />
        <div>
          <h2>ランキングと発見</h2>
          <p>
            Circleは、人気コンテンツやトピックをランキング化し、新たな発見をサポートし、あなたの興味に合ったコンテンツやトピックを簡単に見つけます。
          </p>
          <p>
            Circleを使って、新しいコミュニティに参加し、アプリやコンテンツについての新たな視点を手に入れましょう。共感し、評価し、楽しむための場所、それがCircleです。
          </p>
        </div>
      </div>
      <h2>さあ、Circleで新しいコミュニティに参加しましょう！</h2>
    </section>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "LandingPage",
  components: { FontAwesomeIcon },
  methods: {
    start() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#landing {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Corporate Logo ver3", sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background: #2dbfbf;
  animation: fadeIn 1s ease-in-out;
  overflow-x: hidden;
}

h1,
h2 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-weight: 400;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #555;
}

ul {
  list-style: none;
  margin-bottom: 1rem;
}

li {
  font-weight: 500;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.vector-art {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.title-page {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 20% auto auto;
  padding-bottom: 30%;
  align-content: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
  padding-left: 2rem;
  padding-right: 2rem;
}

.title-page-content {
  width: 50%;
}

.title-page-content .title-wrapper {
  margin-bottom: 30px;
}

.title-wrapper button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  background-color: #fbbf14;
  color: #fff;
  font-size: 1.2rem;
}

.title-wrapper button:hover {
  background-color: #c99812;
}

.title-page-content h1 {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.title-page-content p {
  font-size: 1.5rem;
  line-height: 2rem;
}

.social-links {
  display: flex;
  margin-top: 30px;
}

.social-links a {
  margin-right: 20px;
  color: #fff;
  font-size: 1.5rem;
  text-decoration: none;
}

.social-links a:hover {
  color: #ccc;
}

#about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

#about img {
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

#communication {
  margin-bottom: 2rem;
  margin-top: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#communication img {
  width: 100%;
  max-width: 500px;
  margin-right: 2rem;
}

#communication div {
  width: 100%;
  max-width: 500px;
}

#like {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#like img {
  width: 100%;
  max-width: 500px;
  margin-left: 2rem;
}

#like div {
  width: 100%;
  max-width: 500px;
}

#ranking {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#ranking img {
  width: 100%;
  max-width: 500px;
  margin-right: 2rem;
}

#ranking div {
  width: 100%;
  max-width: 500px;
}

@media (max-width: 768px) {
  .title-page {
    flex-direction: column;
    //margin: 0 auto;
    //padding-bottom: 0;
  }

  .title-page-content {
    width: 100%;
    margin-bottom: 30px;
    text-align: center;
  }

  .vector-art {
    width: 100%;
    height: 100%;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
