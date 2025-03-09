import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import routes from './routes'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Nếu cần icon
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue'
const pinia = createPinia();
createApp(App).use(pinia).use(routes).mount('#app')

// createApp(App).use(routes).mount('#app')
