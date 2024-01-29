import {
    faTwitter,
    faGithub,
    faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import {faMagnifyingGlass, faUser} from "@fortawesome/free-solid-svg-icons";
import {config, library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

library.add(faTwitter, faGithub, faDiscord, faMagnifyingGlass, faUser)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {})
})
