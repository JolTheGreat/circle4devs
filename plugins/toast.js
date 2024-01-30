import vueToast, {useToast} from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vueToast);
    nuxtApp.provide("toast", useToast());

})