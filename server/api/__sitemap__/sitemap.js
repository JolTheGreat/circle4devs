import {
    collection, getDocs, getFirestore, query, where
} from "firebase/firestore";
import {initializeApp} from "firebase/app";

export default defineSitemapEventHandler(async () => {
    const data = [];
    const runtimeConfig = useRuntimeConfig();
    initializeApp(runtimeConfig.public.firebase);
    const db = getFirestore();
    const querySnapshot = await getDocs(
        query(
            collection(db, "apps"),
            where("draft", "==", false)
        )
    );

    querySnapshot.forEach((doc) => {
        data.push("/app/" + doc.id)
    });

    const userQuerySnapshot = await getDocs(
        query(
            collection(db, "users")
        )
    );
    userQuerySnapshot.forEach((doc) => {
        data.push("/user/" + doc.id)
    });

    return data;
})