<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cartStore.js';
import CartItemRow from '@/components/CartItemRow.vue';
import { 
  ShoppingBag, ArrowLeft, ArrowRight, Tag, Trash2, 
  CheckCircle, AlertCircle, Sparkles 
} from 'lucide-vue-next';

// Khởi tạo Pinia cartStore
const cartStore = useCartStore();

// Bóc tách State & Getters bằng storeToRefs để bảo toàn Reactivity theo yêu cầu kỹ thuật
const { 
  items, 
  totalItems, 
  rawTotalPrice, 
  discountAmount, 
  finalTotalPrice, 
  activeDiscountPolicy 
} = storeToRefs(cartStore);

// Actions được bóc tách trực tiếp (không qua storeToRefs)
const { applyCoupon, clearCart } = cartStore;

// State cục bộ cho input mã giảm giá
const couponCodeInput = ref('');
const couponFeedback = ref({ message: '', type: '' });

// Xử lý áp dụng mã giảm giá
const handleApplyCoupon = () => {
  if (!couponCodeInput.value.trim()) return;
  const res = applyCoupon(couponCodeInput.value);
  couponFeedback.value = {
    message: res.message,
    type: res.success ? 'success' : 'error'
  };
};

// Format tiền tệ VNĐ
const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Tiêu đề trang -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Giỏ Hàng Của Bạn</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Đang có <strong class="text-brand-600">{{ totalItems }}</strong> sản phẩm trong giỏ hàng toàn cục
        </p>
      </div>

      <button 
        v-if="totalItems > 0"
        @click="clearCart"
        class="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
      >
        <Trash2 class="w-3.5 h-3.5" /> Xóa tất cả
      </button>
    </div>

    <!-- TRƯỜNG HỢP 1: GIỎ HÀNG TRỐNG (v-if) -->
    <div v-if="totalItems === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8">
      <div class="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag class="w-10 h-10" />
      </div>
      <h2 class="text-xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
      <p class="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        Hãy dạo quanh bộ sưu tập phụ kiện thời trang và chọn cho mình những món đồ ưng ý nhất nhé!
      </p>
      <router-link 
        to="/" 
        class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-600/30 transition-all"
      >
        <ArrowLeft class="w-4 h-4" /> Tiếp Tục Mua Sắm
      </router-link>
    </div>

    <!-- TRƯỜNG HỢP 2: CÓ SẢN PHẨM TRONG GIỎ (v-else) -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Cột trái (8 cols): Danh sách sản phẩm -->
      <div class="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div class="divide-y divide-slate-100">
          <CartItemRow 
            v-for="item in items" 
            :key="item.getItemKey()" 
            :item="item" 
          />
        </div>

        <div class="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
          <router-link 
            to="/" 
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft class="w-4 h-4" /> Tiếp tục chọn sản phẩm khác
          </router-link>
        </div>
      </div>

      <!-- Cột phải (4 cols): Mã giảm giá & Tóm tắt hóa đơn -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Box Áp dụng mã giảm giá (Discount Policy) -->
        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
          <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2 mb-3">
            <Tag class="w-4 h-4 text-brand-600" /> Mã Giảm Giá & Voucher
          </h3>

          <div class="flex gap-2">
            <input 
              v-model.trim="couponCodeInput" 
              type="text" 
              placeholder="Nhập mã (VD: LUXE10, VIP50K)"
              @keyup.enter="handleApplyCoupon"
              class="flex-1 bg-slate-100 text-slate-800 uppercase text-xs font-semibold rounded-xl px-3 py-2.5 border border-transparent focus:border-brand-500 focus:bg-white focus:outline-none"
            />
            <button 
              @click="handleApplyCoupon"
              class="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all"
            >
              Áp dụng
            </button>
          </div>

          <!-- Thông báo kết quả coupon -->
          <div 
            v-if="couponFeedback.message" 
            class="mt-3 p-2.5 rounded-xl text-xs flex items-center gap-1.5 font-medium"
            :class="couponFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
          >
            <CheckCircle v-if="couponFeedback.type === 'success'" class="w-3.5 h-3.5 shrink-0" />
            <AlertCircle v-else class="w-3.5 h-3.5 shrink-0" />
            <span>{{ couponFeedback.message }}</span>
          </div>

          <!-- Gợi ý các mã có sẵn -->
          <div class="mt-4 pt-3 border-t border-slate-100">
            <span class="text-[11px] text-slate-400 font-semibold block mb-1.5">Mã ưu đãi hôm nay:</span>
            <div class="flex flex-wrap gap-1.5">
              <button 
                @click="couponCodeInput = 'LUXE10'; handleApplyCoupon()" 
                class="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200 hover:bg-brand-100"
              >
                LUXE10 (-10%)
              </button>
              <button 
                @click="couponCodeInput = 'VIP50K'; handleApplyCoupon()" 
                class="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200 hover:bg-brand-100"
              >
                VIP50K (-50k)
              </button>
            </div>
          </div>
        </div>

        <!-- Box Tổng tiền & Nút Đặt hàng -->
        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <h3 class="font-extrabold text-base text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Tóm Tắt Đơn Hàng
          </h3>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-slate-600">
              <span>Tổng tiền hàng ({{ totalItems }} món):</span>
              <span class="font-semibold text-slate-800">{{ formatCurrency(rawTotalPrice) }}</span>
            </div>

            <div class="flex justify-between text-slate-600">
              <span>Giảm giá khuyến mãi:</span>
              <span class="font-semibold text-emerald-600">
                -{{ formatCurrency(discountAmount) }}
              </span>
            </div>

            <div class="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span class="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                Miễn phí (Freeship)
              </span>
            </div>

            <hr class="border-slate-100 my-2" />

            <div class="flex justify-between items-baseline pt-2">
              <span class="font-bold text-base text-slate-900">Tổng thanh toán:</span>
              <span class="text-2xl font-black text-brand-600">{{ formatCurrency(finalTotalPrice) }}</span>
            </div>
          </div>

          <router-link 
            to="/checkout" 
            class="mt-6 w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            Tiến Hành Thanh Toán
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

      </div>

    </div>
  </div>
</template>
