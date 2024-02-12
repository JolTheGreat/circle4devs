import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {defineNuxtPlugin} from "#app";
import {getAnalytics} from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const app = initializeApp(runtimeConfig.public.firebase);

    const db = getFirestore();
    const storage = getStorage();

    getAnalytics(app)
    nuxtApp.provide("db", db);
    nuxtApp.provide("storage", storage);
})