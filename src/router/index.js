import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const DEFAULT_TITLE = 'Dima Payne'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: DEFAULT_TITLE },
    },
    {
      path: '/frontend',
      name: 'frontend',
      component: () => import('../views/FrontendView.vue'),
      meta: { title: `${DEFAULT_TITLE} – Frontend` },
    },
    {
      path: '/sound',
      name: 'sound',
      component: () => import('../views/SoundView.vue'),
      meta: { title: `${DEFAULT_TITLE} – Sound` },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: `404 – Page Not Found` },
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

export default router
