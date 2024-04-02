<template>
  <Head>
    <Title>Circle4Devsとは？</Title>
    <Meta name="title" content="Circle4Devs ホーム"/>
    <Meta name="description" content="開発したアプリを共有し、他の開発者と繋がれる画期的なプラットフォーム"/>
    <Meta name="keywords" content="Circle4Devs, アプリ, 開発, プラットフォーム"/>
    <Meta name="author" content="Circle4Devs"/>
    <Meta property="og:title" content="Circle4Devsとは？"/>
    <Meta property="og:description" content="開発したアプリを発信しよう！"></Meta>
    <Meta property="og:url" content="https://circle4devs.netlify.app/"/>
    <Meta property="og:type" content="website"/>
    <Meta property="og:site_name" content="Circle4Devs"/>
    <Meta property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/circle-404609.appspot.com/o/logo.png?alt=media&token=2baccc57-95f9-4c60-b80c-c74d8fb51cf9"/>
    <Meta name="twitter:card" content="summary_large_image"/>
    <Meta name="twitter:site" content="@Circle4Devs"/>
    <Meta name="twitter:title" content="Circle4Devsとは？"/>
    <Meta name="twitter:description" content="開発したアプリを発信しよう！"/>
    <Meta name="twitter:url" content="https://circle4devs.netlify.app/"/>
    <Meta name="twitter:domain" content="Circle4Devs"/>
    <Meta name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/circle-404609.appspot.com/o/logo.png?alt=media&token=2baccc57-95f9-4c60-b80c-c74d8fb51cf9"/>

    <Meta name="google-site-verification" content="ss-wDpzNen2Gl_UZVF9Y4x_Bg2APqP5TwLZQp7y9Obk"/>
  </Head>
  <div id="landing">
    <div class="title-page">
      <div class="title-page-content">
        <div class="title-wrapper">
          <h1>個人開発を一歩先へ</h1>
          <p>開発したアプリを共有しよう！</p>
          <button @click="start">Circle4Devsを開く</button>
        </div>
        <div class="social-links">
          <a href="#">
            <font-awesome-icon icon="fa-brands fa-twitter"/>
          </a>
          <a href="#">
            <font-awesome-icon icon="fa-brands fa-discord"/>
          </a>
        </div>
      </div>
      <img
          src="/assets/undraw_software_engineer_re_tnjc.svg"
          alt="vector art"
      />
    </div>
    <section id="about">
      <h1>Circle4Devsについて</h1>
      <p>
        <strong>Circle4Devs</strong>
        は、個人開発者が作成したアプリを一覧表示し、共有するためのプラットフォームです。開発者同士が互いのアプリを発見し、フィードバックを交換することで、より良いアプリを生み出すことを目指しています。また、ユーザーと開発者の間での円滑なフィードバックを実現させます。
      </p>
      <div id="communication" class="section">
        <img src="assets/undraw_chat_re_re1u.svg" alt="vector art" class="vector-art"/>
        <div>
          <h2>開発者とユーザーのコミュニケーション</h2>
          <p>
            開発者は自分のアプリを登録し、他のアプリを閲覧できます。また、今後はいいね機能やコメント機能など、コミュニティ機能を追加する予定です。開発者同士がアプリについて感想や評価を共有し、より良いアプリを作り上げていくための場所です。
          </p>
        </div>
      </div>
      <div id="rating" class="section">
        <div>
          <h2>いいね、共感、評価</h2>
          <p>
            Circle4Devsでは、開発者が自分のアプリを共有し、他のアプリを閲覧できます。また、いいね機能や共感機能を利用して、開発者のアプリが評価されます。評価を元に、開発者はアプリの改善に取り組むことができます。
          </p>
        </div>
        <img src="/assets/undraw_love_it_xkc2.svg" alt="vector art" class="vector-art"/>
      </div>
      <div id="ranking" class="section">
        <img src="/assets/undraw_personal_goals_re_iow7.svg" alt="vector art" class="vector-art"/>
        <div>
          <h2>ランキングと発見</h2>
          <p>
            Circle4Devsは、開発者が互いのアプリを発見し、フィードバックを交換するための場所です。人気コンテンツやトピックをランキング化し、新たな発見をサポートし、より良いアプリを作り上げていくことを目指しています。Coming soon...
          </p>
        </div>
      </div>

      di
      <h2>Circle4Devsで新しい個人開発を始めよう！</h2>
    </section>
  </div>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "LandingPage",
  components: {FontAwesomeIcon},
  methods: {
    start() {
      navigateTo("/dashboard");
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
  padding: 25px;
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

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

img {
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
  margin-top: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.section div {
  width: 100%;
  max-width: 500px;
}


@media (max-width: 768px) {
  .title-page {
    flex-direction: column;
  }

  .section {
    flex-direction: column;
  }

  .title-page-content {
    width: 100%;
    margin-bottom: 30px;
    text-align: center;
  }


  .social-links {
    justify-content: center;
  }
}
</style>
