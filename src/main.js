import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { GoogleLogin } from "vue3-google-login"; // Import đúng
import './style.css'
import routes from './routes'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Nếu cần icon
import 'bootstrap-icons/font/bootstrap-icons.css';
// Đăng nhập Google

import App from './App.vue'
const pinia = createPinia();
// Kiểm tra xem biến môi trường có giá trị hay không
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const app = createApp(App);
app.use(pinia);
app.use(routes);
app.use(GoogleLogin, {
  clientId: clientId,
});
app.mount('#app')
