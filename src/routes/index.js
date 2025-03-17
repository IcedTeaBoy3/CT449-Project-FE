
import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../pages/AdminPage.vue';
import AdminProductPage from '../pages/AdminProductPage.vue';
import AdminUserPage from '../pages/AdminUserPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
import AdminNXBPage from '../pages/AdminNXBPage.vue';
import HomePage from '../pages/HomePage.vue';
import ProductDetailPage from '../pages/ProductDetailPage.vue';
import SignInPage from '../pages/SignInPage.vue';
import { useUserStore } from '../stores/userStore';
import MyBorrowBooks from '../pages/MyBorrowBooks.vue';
import AdminBorrowBook from '../pages/AdminBorrowBook.vue';
// Định nghĩa các route
const routes = [
  {

    path: '/admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }, // Chặn truy cập nếu không phải admin
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
      },
      {
        path: 'borrow-books',
        component: AdminBorrowBook, // Trang quản lý mượn sách
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
    path: '/my-borrow-books',
    component: MyBorrowBooks,
    meta: { requiresAuth: true }, // Chặn truy cập nếu chưa đăng nhập
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

// 🛡 Navigation Guard để bảo vệ route
router.beforeEach((to, from, next) => {
  const authStore = useUserStore(); // Nếu dùng Pini
  const isAdmin = authStore.isAdmin; // Kiểm tra có phải admin không
  const isAuthenticated = authStore.access_token; // Kiểm tra đã đăng nhập chưa

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Nếu chưa đăng nhập → chuyển hướng đến đăng nhập
    return next('/sign-in');
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    // Nếu không phải admin → chặn lại và chuyển về trang not found
    return next('/:pathMatch(.*)*');
  }

  next();
});


export default router;
