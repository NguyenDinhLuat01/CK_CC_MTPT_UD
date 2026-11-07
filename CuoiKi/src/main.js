import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

// 1. Khởi tạo Vue Application instance
const app = createApp(App);

// 2. Khởi tạo và đăng ký Pinia Store
const pinia = createPinia();
app.use(pinia);

// 3. Đăng ký Vue Router 4
app.use(router);

// 4. Mount ứng dụng lên thẻ div#app trong index.html
app.mount('#app');
