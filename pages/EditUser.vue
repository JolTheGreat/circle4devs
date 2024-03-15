<script setup lang="js">

import { ref } from 'vue';
import { getAuth, updateProfile } from "firebase/auth";
import {getStorage, ref as firebaseRef, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";

const nuxtApp = useNuxtApp();
const auth = getAuth();
const user = auth.currentUser;
const storage = getStorage();
const firestore = getFirestore();

let name = ref("");
let previousName = ref("");
let profileImage = ref("");
let previousProfileImage = ref("");

let userDoc = null;

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    navigateTo("/auth");
  }

  const userRef = doc(firestore, "users", user.uid);
  userDoc = await getDoc(userRef);
  console.log(userDoc.data())
  previousName.value = userDoc.data().name;
  previousProfileImage.value = userDoc.data().photoUrl;

  const name = document.getElementById("name");
  name.value = previousName.value;
  console.log(user)

});

const onFileChange = (e) => {
  profileImage.value = e.target.files[0];
};

const update = async () => {
  if (name.value === previousName.value && !profileImage.value) {
    navigateTo("/profile");
  }

  if (name.value === "") {
    name.value = previousName.value;
  }

  if (profileImage.value) {
    console.log(profileImage.value)
    const storageRef = firebaseRef(storage, `profileImages/${user.uid}`);
    await uploadBytes(storageRef, profileImage.value);
    const url = await getDownloadURL(storageRef);

    await updateProfile(user, {
      displayName: name.value,
      photoURL: url
    });

    await updateDoc(userDoc.ref, {
      name: name.value,
      photoUrl: url
    })
  } else {
    await updateProfile(user, {
      displayName: name.value
    });

    await updateDoc(userDoc.ref, {
      name: name.value
    })

  }
  await nuxtApp.$toast.open({
    message: "プロフィールを更新しました",
    type: "success",
    position: "bottom",
    duration: 5000,
    dismissible: true,
  });

  navigateTo("/profile");
};



</script>

<template>
  <Head>
    <Title>プロフィール編集</Title>
  </Head>

  <div id="edit">
    <div id="form">
      <h2>プロフィール編集</h2>
      <div id="form-box">
        <div class="form-item">
          <label for="name">名前</label>
          <input type="text" id="name" v-model="name" v-bind:placeholder="previousName"/>
        </div>
        <div class="form-item">
          <label for="profile-image">プロフィール画像</label>
          <img :src="previousProfileImage" alt="プロフィール画像" id="profile-image-preview"/>
          <input type="file" id="profile-image" @change="onFileChange"/>
        </div>
        <button @click="update">更新</button>
      </div>
    </div>
  </div>

</template>

<style scoped>

#edit {
  margin: 0;
  top: 0;
  padding: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background: #2dbfbf;
  display: flex;
  justify-content: center;
  align-items: center;
}

#form {
  width: 80%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 20px;
  padding: 1rem;
  background: whitesmoke;
}

#form-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-item {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1rem;
}

input {
  width: 12rem;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #000;
  margin-top: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  background: #FBBF14;
  color: #181869;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background: #d9a512;
}

#profile-image-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 0.5rem;
}


</style>