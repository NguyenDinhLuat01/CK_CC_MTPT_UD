<script setup>
import { onMounted, onUnmounted } from 'vue';
import TheNavBar from '@/components/TheNavBar.vue';
import AIChatbot from '@/components/AIChatbot.vue';
import { useCartStore } from '@/stores/cartStore.js';
import { useProductStore } from '@/stores/productStore.js';

const cartStore = useCartStore();
const productStore = useProductStore();

let resizeTimer = null;

// Lifecycle Hook: onMounted
// Tải dữ liệu danh sách sản phẩm và khôi phục giỏ hàng từ LocalStorage khi App mount
onMounted(() => {
  productStore.fetchProducts();
  cartStore.initFromStorage();

  // Ví dụ xử lý sự kiện toàn cục có cleanup
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Logic xử lý khi cửa sổ resize nếu cần
    }, 200);
  };

  window.addEventListener('resize', handleResize);
});

// Lifecycle Hook: onUnmounted
// Dọn dẹp sự kiện và timers để chống rò rỉ bộ nhớ (Memory Leak prevention)
onUnmounted(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- Thanh điều hướng cố định phía trên -->
    <TheNavBar />

    <!-- Khu vực hiển thị động các trang con qua Vue Router -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer chung -->
    <footer class="bg-white border-t border-slate-200/80 py-10 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="md:col-span-2">
            <span class="text-xl font-black bg-gradient-to-r from-brand-700 to-slate-900 bg-clip-text text-transparent">LuxeAccessories</span>
            <p class="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
              Thương hiệu phụ kiện thời trang cao cấp. Trải nghiệm mua sắm trực tuyến tối ưu với công nghệ Vue 3 Single Page Application và Trợ lý AI Stylist thông minh.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm mb-3">Liên Kết Nhanh</h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li><router-link to="/" class="hover:text-brand-600">Trang Chủ</router-link></li>
              <li><router-link to="/cart" class="hover:text-brand-600">Giỏ Hàng</router-link></li>
              <li><router-link to="/about" class="hover:text-brand-600">Về Chúng Tôi</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm mb-3">Hỗ Trợ Khách Hàng</h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li>Hotline: 1900-LUXE (08:00 - 21:00)</li>
              <li>Email: contact@luxeaccessories.vn</li>
              <li>Bảo hành 12 tháng chính hãngg</li>
              <li>Miễn phí đổi trả trong 7 ngày</li>
            </ul>
          </div>
        </div>
        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 LuxeAccessories SPA. Bài tập lớn môn Công cụ & Môi trường phát triển.</p>
          <p>Vue 3 + Pinia + Vue Router 4 </p>
        </div>
      </div>
    </footer>

    <!-- Widget Chatbot AI nổi ở góc dưới -->
    <AIChatbot />
  </div>
</template>

<style>
/* Transition page animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
