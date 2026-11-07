<script setup>
import { computed } from 'vue';
import { Star, Eye, ShoppingCart } from 'lucide-vue-next';
import { Product } from '@/models/Product.js';

// Định nghĩa props nhận vào một thể hiện của class Product (OOP)
const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (p) => p instanceof Product || (Boolean(p.id) && Boolean(p.name))
  }
});

// Format tiền tệ VNĐ
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(props.product.basePrice);
});

// Kiểm tra tình trạng còn hàng
const isStockAvailable = computed(() => {
  return props.product.getTotalStock ? props.product.getTotalStock() > 0 : true;
});
</script>

<template>
  <div class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
    <!-- Hình ảnh sản phẩm -->
    <router-link :to="`/product/${product.id}`" class="relative aspect-[4/3] overflow-hidden bg-slate-100 block">
      <img 
        :src="product.getPrimaryImage ? product.getPrimaryImage() : product.images?.[0]" 
        :alt="product.name" 
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Category Badge -->
      <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
        {{ product.category }}
      </span>

      <!-- Tình trạng kho -->
      <span 
        v-if="!isStockAvailable" 
        class="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm"
      >
        Hết hàng
      </span>

      <!-- Quick Hover Overlay -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span class="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all">
          <Eye class="w-3.5 h-3.5 text-brand-600" /> Xem chi tiết & biến thể
        </span>
      </div>
    </router-link>

    <!-- Nội dung thông tin -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Rating & Variants info -->
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div class="flex items-center gap-1 text-amber-500 font-semibold">
            <Star class="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span>{{ product.rating || 5.0 }}</span>
          </div>
          <span class="text-slate-400">
            {{ product.variants?.length || 1 }} biến thể (Màu/Size)
          </span>
        </div>

        <!-- Tên sản phẩm -->
        <router-link :to="`/product/${product.id}`">
          <h3 class="font-bold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2 text-base leading-snug">
            {{ product.name }}
          </h3>
        </router-link>

        <p class="text-xs text-slate-500 mt-1 line-clamp-2">
          {{ product.description }}
        </p>
      </div>

      <!-- Giá và nút hành động -->
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Giá từ</span>
          <span class="text-lg font-extrabold text-brand-600 tracking-tight">
            {{ formattedPrice }}
          </span>
        </div>

        <router-link 
          :to="`/product/${product.id}`" 
          class="p-2.5 rounded-xl bg-slate-100 group-hover:bg-brand-600 text-slate-700 group-hover:text-white transition-all shadow-sm"
          title="Tùy chọn kích thước & màu sắc"
        >
          <ShoppingCart class="w-4 h-4" />
        </router-link>
      </div>
    </div>
  </div>
</template>
