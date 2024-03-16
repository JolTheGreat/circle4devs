import { initializeApp } from "firebase/app";
import {collection, doc, getDoc, getDocs, getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path.startsWith("/app")) {
        await app(to)
    }
});

async function app(to) {
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
        const createdAt = documentData.createdAt;
        const description = documentData.description;
        const owner = (await getDoc(documentData.owner)).data();
        const url = documentData.url;

        const likesCollection = collection(nuxtApp.$db, "apps", id, "likes");
        const likesDocs = await getDocs(likesCollection);
        const likes = likesDocs.docs.map((doc) => doc.data());
        const likeCount = documentData.likeCount;

        const satisfactionsCollection = collection(nuxtApp.$db, "apps", id, "satisfactions");
        const satisfactionsDocs = await getDocs(satisfactionsCollection);
        const satisfactions = satisfactionsDocs.docs.map((doc) => doc.data());
        const satisfactionScore = documentData.satisfactionScore;

        nuxtApp.provide("app", {
            title: title,
            catchphrase: catchphrase,
            images: images,
            tags: tags,
            createdAt: createdAt,
            description: description,
            owner: owner,
            url: url,
            likes: likes,
            likeCount: likeCount,
            satisfactions: satisfactions,
            satisfactionScore: satisfactionScore,
        });
    }
}
