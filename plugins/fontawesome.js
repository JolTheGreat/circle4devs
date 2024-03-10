import {
    faTwitter,
    faGithub,
    faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import {
    faFileContract,
    faMagnifyingGlass,
    faPlus,
    faRightFromBracket,
    faRightToBracket,
    faUser,
    faStar,
    faHeart as faHeartSolid
} from "@fortawesome/free-solid-svg-icons";
import {
    faHeart as faHeartRegular
} from "@fortawesome/free-regular-svg-icons";
import {config, library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

config.autoAddCss = false

library.add(
    faTwitter,
    faGithub,
    faDiscord,
    faMagnifyingGlass,
    faUser,
    faPlus,
    faRightToBracket,
    faRightFromBracket,
    faFileContract,
    faStar,
    faHeartSolid,
    faHeartRegular
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {})
})
