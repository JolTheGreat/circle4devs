<script>
import {getAuth} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "AuthPage",
  data() {
    return {
      username: undefined,
      password: undefined,
    };
  },

  async mounted() {
    const firebaseui = await import('firebaseui/dist/esm__ja')
    const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(getAuth());
    ui.start("#firebaseui-auth-container", {
      signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID, firebase.auth.TwitterAuthProvider.PROVIDER_ID],
      signInFlow: "popup",
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      tosUrl: "/privacy",
      privacyPolicyUrl: "/privacy",
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          const user = authResult.user;
          user.getIdToken().then(function (accessToken) {
            document.cookie = `token=${accessToken}`;
          });
          navigateTo("/dashboard");
        },
      },
    });
  },
  methods: {},
};
</script>

<template>
  <div id="container">
    <h2>新規登録・サインイン</h2>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  color: black;
}

#firebaseui-auth-container {
  margin-top: 2rem;
}
</style>
