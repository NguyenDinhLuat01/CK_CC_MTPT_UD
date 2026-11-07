<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cartStore.js';
import { Trash2, Plus, Minus } from 'lucide-vue-next';
import { CartItem } from '@/models/CartItem.js';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (val) => val instanceof CartItem || Boolean(val.getItemKey)
  }
});

const cartStore = useCartStore();

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

// Đơn giá thực tế
const unitPriceFormatted = computed(() => {
  return formatCurrency(props.item.getUnitPrice ? props.item.getUnitPrice() : 0);
});

// Thành tiền dòng
const subtotalFormatted = computed(() => {
  return formatCurrency(props.item.getSubtotal ? props.item.getSubtotal() : 0);
});

// Xử lý tăng số lượng
const handleIncrease = () => {
  cartStore.updateQuantity(props.item.getItemKey(), props.item.quantity + 1);
};

// Xử lý giảm số lượng
const handleDecrease = () => {
  if (props.item.quantity > 1) {
    cartStore.updateQuantity(props.item.getItemKey(), props.item.quantity - 1);
  } else {
    handleRemove();
  }
};

// Nhập trực tiếp số lượng
const handleDirectInput = (e) => {
  const val = parseInt(e.target.value, 10);
  cartStore.updateQuantity(props.item.getItemKey(), isNaN(val) ? 1 : val);
};

// Xóa item
const handleRemove = () => {
  cartStore.removeFromCart(props.item.getItemKey());
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 p-3 rounded-2xl transition-colors">
    <!-- Cột trái: Ảnh và thông tin -->
    <div class="flex items-center gap-4 flex-1">
      <img 
        :src="item.variant?.imageUrl || item.product?.getPrimaryImage?.() || 'https://via.placeholder.com/100'" 
        :alt="item.product?.name" 
        class="w-20 h-20 object-cover rounded-xl border border-slate-200/80 bg-white shrink-0 shadow-sm"
      />
      <div>
        <router-link :to="`/product/${item.product?.id}`" class="font-bold text-slate-800 hover:text-brand-600 transition-colors line-clamp-1 text-sm sm:text-base">
          {{ item.product?.name }}
        </router-link>
        
        <!-- Chi tiết biến thể đã chọn -->
        <div class="flex flex-wrap items-center gap-2 mt-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            Màu: {{ item.variant?.color }}
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            Size: {{ item.variant?.size }}
          </span>
          <span class="text-[11px] text-slate-400 font-mono">
            SKU: {{ item.variant?.sku }}
          </span>
        </div>

        <div class="text-xs text-brand-600 font-bold mt-1 sm:hidden">
          {{ unitPriceFormatted }}
        </div>
      </div>
    </div>

    <!-- Cột phải: Đơn giá, Số lượng, Thành tiền & Xóa -->
    <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
      <!-- Đơn giá (desktop) -->
      <div class="hidden sm:block text-right">
        <span class="text-xs text-slate-400 block font-medium">Đơn giá</span>
        <span class="text-sm font-semibold text-slate-700">{{ unitPriceFormatted }}</span>
      </div>

      <!-- Bộ nút tăng giảm số lượng -->
      <div class="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <button 
          @click="handleDecrease" 
          class="p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors"
          title="Giảm 1"
        >
          <Minus class="w-3.5 h-3.5" />
        </button>
        <input 
          type="number" 
          min="1" 
          :max="item.variant?.stockQuantity || 99"
          :value="item.quantity"
          @change="handleDirectInput"
          class="w-12 text-center text-sm font-bold text-slate-800 focus:outline-none bg-transparent"
        />
        <button 
          @click="handleIncrease" 
          class="p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors"
          title="Tăng 1"
        >
          <Plus class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Thành tiền -->
      <div class="text-right min-w-[100px]">
        <span class="text-xs text-slate-400 block font-medium">Thành tiền</span>
        <span class="text-base font-extrabold text-brand-600">{{ subtotalFormatted }}</span>
      </div>

      <!-- Nút xóa -->
      <button 
        @click="handleRemove" 
        class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        title="Xóa khỏi giỏ hàng"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
