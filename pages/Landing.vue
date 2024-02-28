<template>
  <Head>
    <Title>Circle4Devsとは？</Title>
    <Meta name="description" content="開発したアプリを発信しよう！"/>
    <Meta property="og:title" content="Circle4Devsとは？"/>
    <Meta property="og:description" content="開発したアプリを発信しよう！"></Meta>
    <Meta property="og:url" content="https://circle4devs.netlify.app/"/>
    <Meta property="og:type" content="website"/>
    <Meta property="og:site_name" content="Circle4Devs"/>
    <Meta name="twitter:card" content="summary_large_image"/>
    <Meta name="twitter:site" content="@Circle4Devs"/>
    <Meta name="twitter:title" content="Circle4Devsとは？"/>
    <Meta name="twitter:description" content="開発したアプリを発信しよう！"/>
    <Meta name="twitter:url" content="https://circle4devs.netlify.app/"/>
    <Meta name="twitter:domain" content="Circle4Devs"/>

    <Meta name="google-site-verification" content="ss-wDpzNen2Gl_UZVF9Y4x_Bg2APqP5TwLZQp7y9Obk" />
  </Head>
  <div id="landing">
    <div class="title-page">
      <div class="title-page-content">
        <div class="title-wrapper">
          <h1>個人開発を一歩先へ</h1>
          <p>あなたのアプリが、あなたの未来を切り開く</p>
          <button @click="start">Circle4Devsを開く</button>
        </div>
        <div class="social-links">
          <a href="">
            <font-awesome-icon icon="fa-brands fa-twitter"/>
          </a>
          <a href="#">
            <font-awesome-icon icon="fa-brands fa-discord"/>
          </a>
        </div>
      </div>
      <img
          class="vector-art"
          src="/assets/undraw_software_engineer_re_tnjc.svg"
          alt="vector art"
      />
    </div>
    <section id="about">
      <h1>Circle4Devsとは</h1>
      <p>
        <strong>Circle4Devs</strong>
        は、個人開発者同士がアプリを通じて交わるためのプラットフォームです。個人開発者が開発するアプリはWebアプリやモバイルアプリがありますが、それらの評価や使い勝手などはXやAppStoreといった様々な場所に散らばっています。小規模で開発されているアプリをまとめて、開発者にとっての最大の喜びである「使ってもらうこと」を満たすために、Circle4Devsは開発したアプリを発信し、他の開発者が使ってあげることで自分と似たような開発者たちに還元できる仕組みになっています。下記はこれから実装していきたい機能の一覧です。今のところ、他の個人開発者が作っているものを把握し、出版したアプリをXなどで共有することができます。上記のXとDiscordは整備中です！
      </p>
      <div id="communication" class="section">
        <img src="assets/undraw_chat_re_re1u.svg" alt="vector art" class="vector-art"/>
        <div>
          <h2>開発者とユーザーのコミュニケーション</h2>
          <p>
            開発者同士がそれぞれ開発したアプリを発信し、それらについての感想、評価、コメントを共有できる場所です。開発者が集まることから、初期ユーザーを集めることなどに適しています。
          </p>
        </div>
      </div>
      <div id="like" class="section">
        <div>
          <h2>いいね、共感、評価</h2>
          <p>
            Circle4Devsでは、アプリやレビューに対する「いいね」や「共感」のリアクションを使って、開発者のアプリが評価されます。評価を元に、開発者はアプリに求められているものを把握し、改善に務めることができます。
          </p>
        </div>
        <img src="/assets/undraw_love_it_xkc2.svg" alt="vector art" class="vector-art"/>
      </div>
      <div id="ranking" class="section">
        <img src="/assets/undraw_personal_goals_re_iow7.svg" alt="vector art" class="vector-art"/>
        <div>
          <h2>ランキングと発見</h2>
          <p>
            Circle4Devsは、人気コンテンツやトピックをランキング化し、新たな発見をサポートし、あなたの興味に合ったコンテンツやトピックを簡単に見つけます。
          </p>
        </div>
      </div>
      <h2>さあ、Circle4Devsで新しい個人開発を始めましょう！</h2>
    </section>
    <section id="job-hunting">
      <h1>転職を考えているあなたへ</h1>
      <p>
        <strong>Circle4Devs</strong>は、転職を考えている開発者のためのプラットフォームでもあります。あなたがこれまでに開発したアプリを投稿し、それを通じて自分のスキルをアピールすることができます。また、他の開発者からフィードバックを得ることで、自分のスキルをさらに磨くことができます。
      </p>
      <div id="portfolio" class="section">
        <img src="/assets/undraw_about_me_re_82bv.svg" alt="vector art" class="vector-art"/>
        <div>
          <h2>ポートフォリオ作成</h2>
          <p>
            Circle4Devsでは、あなたが開発したアプリを投稿することで、自分だけのポートフォリオを作成することができます。これにより、転職活動時に自分のスキルを具体的に示すことができます。
          </p>
        </div>
      </div>
      <div id="feedback" class="section">
        <div>
          <h2>フィードバックと評価</h2>
          <p>
            Circle4Devsでは、他の開発者からフィードバックや評価を得ることができます。これにより、自分のスキルを客観的に理解し、改善することができます。
            ↑ユーザーが集まり次第、実装予定です。
          </p>
        </div>
        <img src="/assets/undraw_feedback_re_urmj.svg" alt="vector art" class="vector-art"/>
      </div>
      <div id="networking" class="section">
        <img src="/assets/undraw_social_networking_re_i1ex.svg" alt="vector art" class="vector-art"/>
        <div>
          <h2>ネットワーキング</h2>
          <p>
            Circle4Devsは、開発者同士が交流する場でもあります。新たな機会を見つけることができ、また他の開発者と協力してプロジェクトを進めることも可能になります。
            ↑ユーザーが集まり次第、実装予定です。
          </p>
        </div>
      </div>
      <h2>さあ、Circle4Devsで新しいキャリアを始めましょう！</h2>
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
