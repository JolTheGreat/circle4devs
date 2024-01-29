import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    initializeApp(runtimeConfig.public.firebase);

    const db = getFirestore();
    const storage = getStorage();

    nuxtApp.provide("db", db);
    nuxtApp.provide("storage", storage);
})