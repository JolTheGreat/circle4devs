import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path.startsWith("/app")) {
        const nuxtApp = useNuxtApp();
        const runtimeConfig = useRuntimeConfig();
        initializeApp(runtimeConfig.public.firebase);

        if (!nuxtApp.$db || !nuxtApp.$storage) {
            const db = getFirestore();
            const storage = getStorage();

            nuxtApp.provide("db", db);
            nuxtApp.provide("storage", storage);
        }

        const id = to.params.id;
        getAuth();
        const docRef = doc(nuxtApp.$db, "apps", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const documentData = docSnap.data();
            const title = documentData.title;
            const catchphrase = documentData.catchphrase;
            const images = documentData.images;
            const tags = documentData.tags;
            const description = documentData.description;
            const owner =  (await getDoc(documentData.owner)).data();
            const url = documentData.url;

            nuxtApp.provide("app", {
                title: title,
                catchphrase: catchphrase,
                images: images,
                tags: tags,
                description: description,
                owner: owner,
                url: url,
            });


        } else {
        }
    }
});
