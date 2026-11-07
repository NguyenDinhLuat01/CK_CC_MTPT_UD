<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cartStore.js';
import { useAIStore } from '@/stores/aiStore.js';
import { ShoppingBag, Sparkles, Home, Info, Search } from 'lucide-vue-next';
import { useProductStore } from '@/stores/productStore.js';

// Khởi tạo stores
const cartStore = useCartStore();
const aiStore = useAIStore();
const productStore = useProductStore();

// Trích xuất State & Getters bằng storeToRefs để đảm bảo tính phản ứng (Reactivity)
const { totalItems } = storeToRefs(cartStore);
const { searchQuery } = storeToRefs(productStore);
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20 gap-4">
        
        <!-- Logo thương hiệu -->
        <router-link to="/" class="flex items-center gap-2.5 group shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <span class="font-extrabold text-xl tracking-wider">L</span>
          </div>
          <div>
            <span class="text-xl font-bold bg-gradient-to-r from-brand-700 to-slate-900 bg-clip-text text-transparent">LuxeAccessories</span>
            <p class="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">Thời Trang & Phụ Kiện</p>
          </div>
        </router-link>

        <!-- Search bar ở giữa -->
        <div class="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div class="relative w-full">
            <input 
              v-model.trim="searchQuery" 
              type="text" 
              placeholder="Tìm kính mát, túi xách, đồng hồ, phụ kiện..." 
              class="w-full bg-slate-100 text-slate-800 text-sm rounded-full pl-10 pr-4 py-2 border border-transparent focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
            />
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex items-center gap-1 sm:gap-2">
          <router-link 
            to="/" 
            class="nav-link flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-lg transition-colors"
          >
            <Home class="w-4 h-4" />
            <span class="hidden sm:inline">Trang Chủ</span>
          </router-link>

          <router-link 
            to="/about" 
            class="nav-link flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-lg transition-colors"
          >
            <Info class="w-4 h-4" />
            <span class="hidden sm:inline">Giới Thiệu</span>
          </router-link>

          <!-- Nút kích hoạt Chatbot AI -->
          <button 
            @click="aiStore.toggleChat" 
            class="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200/60 rounded-full transition-all shadow-sm"
            title="Mở trợ lý tư vấn AI"
          >
            <Sparkles class="w-4 h-4 animate-pulse text-brand-600" />
            <span class="hidden md:inline">LuxeStylist AI</span>
          </button>

          <!-- Giỏ hàng với Reactive Badge -->
          <router-link 
            to="/cart" 
            class="nav-link relative flex items-center gap-2 p-2.5 sm:px-3.5 text-sm font-medium text-slate-700 hover:text-brand-600 rounded-xl hover:bg-slate-100 transition-all ml-1"
            title="Xem giỏ hàng"
          >
            <ShoppingBag class="w-5 h-5 text-slate-700" />
            <span class="hidden sm:inline font-semibold">Giỏ Hàng</span>
            
            <!-- Reactive Counter Badge -->
            <transition 
              enter-active-class="transform transition duration-300 ease-out" 
              enter-from-class="scale-50 opacity-0" 
              enter-to-class="scale-100 opacity-100"
            >
              <span 
                v-if="totalItems > 0" 
                class="absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce"
              >
                {{ totalItems }}
              </span>
            </transition>
          </router-link>
        </nav>

      </div>
    </div>
  </header>
</template>
