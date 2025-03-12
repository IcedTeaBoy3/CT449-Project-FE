
import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../pages/AdminPage.vue';
import AdminProductPage from '../pages/AdminProductPage.vue';
import AdminUserPage from '../pages/AdminUserPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
import AdminNXBPage from '../pages/AdminNXBPage.vue';
import HomePage from '../pages/HomePage.vue';
import ProductDetailPage from '../pages/ProductDetailPage.vue';
import SignInPage from '../pages/SignInPage.vue';
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
      },
      {
        path: 'nxb',
        component: AdminNXBPage,
      }
    ]
    
  },
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/product-detail/:id',
    component: ProductDetailPage,
    props: true,
  },
  {
    path: '/sign-in',
    component: SignInPage,
    meta: { hideLayout: true } // Trang đăng nhập sẽ ẩn Header & Footer
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
