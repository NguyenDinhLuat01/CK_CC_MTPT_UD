<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from '@/stores/productStore.js';
import { useAIStore } from '@/stores/aiStore.js';
import ProductCard from '@/components/ProductCard.vue';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Award, ArrowRight } from 'lucide-vue-next';

const productStore = useProductStore();
const aiStore = useAIStore();

const { filteredProducts, categories, selectedCategory, searchQuery, loading } = storeToRefs(productStore);

onMounted(() => {
  productStore.fetchProducts();
});
</script>

<template>
  <div>
    <!-- Hero Banner Thời trang -->
    <section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white overflow-hidden py-16 sm:py-24">
      <!-- Glow trang trí nền -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/10">
              <Sparkles class="w-3.5 h-3.5 text-amber-300" /> Bộ Sưu Tập Phụ Kiện Mới 2026
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Tôn Vinh Phong Cách <br />
              <span class="bg-gradient-to-r from-brand-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                Đẳng Cấp Của Bạn
              </span>
            </h1>

            <p class="mt-4 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Khám phá túi xách da cao cấp, kính mát titan chống tia UV, đồng hồ kính sapphire và trang sức bạc Ý. Trải nghiệm tư vấn phối đồ thông minh cùng Trợ lý AI Stylist.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-4">
              <a 
                href="#products-section" 
                class="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2 group"
              >
                Khám Phá Sản Phẩm
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button 
                @click="aiStore.toggleChat" 
                class="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Sparkles class="w-4 h-4 text-amber-300" />
                Nhờ AI Tư Vấn Phối Đồ
              </button>
            </div>
          </div>

          <!-- Ảnh banner nổi bật -->
          <div class="relative hidden lg:block">
            <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
              <img 
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80" 
                alt="Bộ sưu tập phụ kiện"
                class="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <span class="text-xs uppercase tracking-widest text-amber-300 font-bold">Best Seller Tuần</span>
                <p class="font-bold text-base mt-0.5">Túi Xách Da Minimalist & Kính Mát Polarized</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dải cam kết thương hiệu -->
    <section class="bg-white border-y border-slate-200/80 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div class="flex items-center gap-3 justify-center sm:justify-start">
            <div class="p-2.5 rounded-xl bg-brand-50 text-brand-600 shrink-0">
              <Truck class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-800">Giao Hàng Toàn Quốc</h4>
              <p class="text-[11px] text-slate-500">Nhanh chóng trong 2 - 3 ngày</p>
            </div>
          </div>

          <div class="flex items-center gap-3 justify-center sm:justify-start">
            <div class="p-2.5 rounded-xl bg-brand-50 text-brand-600 shrink-0">
              <RefreshCw class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-800">Đổi Trả Miễn Phí</h4>
              <p class="text-[11px] text-slate-500">Trong vòng 7 ngày nếu lỗi</p>
            </div>
          </div>

          <div class="flex items-center gap-3 justify-center sm:justify-start">
            <div class="p-2.5 rounded-xl bg-brand-50 text-brand-600 shrink-0">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-800">Bảo Hành 12 Tháng</h4>
              <p class="text-[11px] text-slate-500">Cam kết chính hãng 100%</p>
            </div>
          </div>

          <div class="flex items-center gap-3 justify-center sm:justify-start">
            <div class="p-2.5 rounded-xl bg-brand-50 text-brand-600 shrink-0">
              <Sparkles class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-xs sm:text-sm text-slate-800">Trợ Lý AI Stylist</h4>
              <p class="text-[11px] text-slate-500">Tư vấn chọn mẫu chuẩn gu</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Khu vực Danh mục & Danh sách Sản phẩm -->
    <section id="products-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      <!-- Tiêu đề và Bộ lọc danh mục -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span class="text-xs font-bold text-brand-600 uppercase tracking-widest">Danh mục phụ kiện</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Sản Phẩm Nổi Bật</h2>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="selectedCategory === cat 
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Trạng thái lọc hoặc tìm kiếm -->
      <div v-if="searchQuery" class="mb-6 p-3 bg-brand-50 rounded-xl text-xs text-brand-800 flex items-center justify-between">
        <span>Kết quả tìm kiếm cho: <strong>"{{ searchQuery }}"</strong> ({{ filteredProducts.length }} sản phẩm)</span>
        <button @click="searchQuery = ''" class="underline font-bold">Xóa tìm kiếm</button>
      </div>

      <!-- Trạng thái đang tải -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>

      <!-- Grid Sản phẩm -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>

      <!-- Trạng thái không tìm thấy sản phẩm -->
      <div v-else class="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
        <p class="text-slate-500 font-medium">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
        <button 
          @click="selectedCategory = 'Tất cả'; searchQuery = ''" 
          class="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
        >
          Đặt lại bộ lọc
        </button>
      </div>

    </section>
  </div>
</template>
