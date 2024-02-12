import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
    ssr: true,
    devtools: {enabled: true},
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    hooks: {
        'pages:extend'(pages) {
            pages.push({
                'name': 'landing',
                'path': '/',
                file: '~/pages/Landing.vue',
            })
        }
    },
    plugins: [
        {
            src: '~/plugins/fontawesome.js',
            mode: 'client',
        },
        {
            src: '~/plugins/firebase.js',
            mode: 'client',
        },
        {
            src: '~/plugins/toast.js',
            mode: 'client',
        },
        {
            src: '~/plugins/algolia.js',
            mode: 'client',
        }
    ],
    modules: [['@nuxtjs/algolia', {
        applicationId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        instantSearch: {theme: 'satellite'}
    }]],
    runtimeConfig: {
        public: {
            firebase: {
                apiKey: process.env.API_KEY,
                authDomain: process.env.AUTH_DOMAIN,
                projectId: process.env.PROJECT_ID,
                storageBucket: process.env.STORAGE_BUCKET,
                messagingSenderId: process.env.MESSAGING_SENDER_ID,
                appId: process.env.APP_ID,
                measurementId: process.env.MEASUREMENT_ID
            }
        }
    }
})
