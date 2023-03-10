import { createApp } from 'vue'
import App from './App.vue'
import Todo from './components/todo.vue'
import Typing from './components/typing.vue'
import { createRouter, createWebHistory } from 'vue-router'
// import * as VueRouter from 'vue-router'

import './assets/main.css'
import './index.css'

const routes = [
    {
        path: '/todo',
        name: 'Todo',
        // components: {
        //     Todo: Todo
        // }
        component: () => import('./components/todo.vue')

    },
    {
        path: '/typing',
        name: 'Typing',
        // components: {
        //     Typing: Typing
        // },
        component: () => import('./components/typing.vue')

        // props: true
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


// createApp(App).mount('#app')

// const app = createApp({})
const app = createApp(App)
app.use(router)
app.mount('#app')
