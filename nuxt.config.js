import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
    $development: undefined, $env: undefined, $meta: undefined, $production: undefined, $test: undefined,
    ssr: true,
    devtools: {enabled: true},
    buildModules: ['@nuxtjs/firebase'],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    hooks: {
        'pages:extend'(pages) {
            pages.push({
                'name': 'landing',
                'path': '/',
                file: '~/pages/Landing.vue'
            })
        }
    },
    plugins: [
        {
            src: '~/plugins/fontawesome.js',
            mode: 'client'
        },
        {
            src: '~/plugins/firebase.js',
            mode: 'client'
        },
        {
            src: '~/plugins/toast.js',
            mode: 'client'
        },
        {
            src: '~/plugins/algolia.js',
            mode: 'client'
        }
    ],
    modules: [['@nuxtjs/algolia', {
        applicationId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        instantSearch: {theme: 'satellite'}
    }],
        '@nuxtjs/seo', '@nuxtjs/sitemap'],
    seo: {
        fallbackTitle: false
    },
    app: {
        head: {
            titleTemplate: '%s | Circle4Devs'
        }
    },
    sitemap: {
        hostname: 'https://circle4devs.com',
        gzip: true,
        exclude: [
            '/admin/**',
            '/EditUser',
            '/Create',
            '/Dashboard'
        ],
        sources: [
            '/api/__sitemap__/sitemap'
        ]
    },
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
