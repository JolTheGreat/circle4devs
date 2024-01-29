<script>
export default {
  name: "VerifyPage",
};
</script>

<template>
  <div>
    <h1>認証用メールを送信しました</h1>

    <p>
      メールアドレスを確認してください。(XやGithubでログインした場合、それらのアカウントに紐づいているメールアドレスをご確認ください）
    </p>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.5em;
  margin: 0.67em 0;
}
p {
  margin: 0;
}
div {
  text-align: center;
  margin: 20% auto;
  width: 80%;
}
</style>
