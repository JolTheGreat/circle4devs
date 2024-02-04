import {getAuth} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    initializeApp(runtimeConfig.public.firebase);

    const auth = getAuth();
    const {id} = await readBody(event);
    const docRef = await doc(this.$db, "apps", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const documentData = docSnap.data();
        const title = documentData.title;
        const catchphrase = documentData.catchphrase;
        const images = documentData.images;
        const tags = documentData.tags;
        const description = documentData.description;
        const owner = await getDoc(documentData.owner).data();
        const url = documentData.url;
        let isOwner;

        auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.uid === owner.id) {
                    isOwner = true;
                }
            }
        });

        const newVar = {
            title: title,
            catchphrase: catchphrase,
            images: images,
            tags: tags,
            description: description,
            owner: owner,
            url: url,
            isOwner: isOwner,
        };
        console.log("ges")
        console.log(newVar)
        return newVar;
    } else {
        console.log("No such document!");
    }
})