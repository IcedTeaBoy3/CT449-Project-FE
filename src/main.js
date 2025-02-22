import { createApp } from 'vue'
import './style.css'
import routes from './routes'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Nếu cần icon
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue'

createApp(App).use(routes).mount('#app')
