
import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../pages/AdminPage.vue';
import AdminProductPage from '../pages/AdminProductPage.vue';
import AdminUserPage from '../pages/AdminUserPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
// Định nghĩa các route
const routes = [
  {

    path: '/admin',
    component: AdminPage,
    children: [
      {
        path: 'products',
        component: AdminProductPage,
      },
      {
        path: 'users',
        component: AdminUserPage,
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  }
];

// Tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
