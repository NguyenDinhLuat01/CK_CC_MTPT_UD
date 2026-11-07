<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cartStore.js';
import { Order } from '@/models/Order.js';
import { StorageService } from '@/models/StorageService.js';
import { 
  CheckCircle2, ArrowLeft, ShieldCheck, CreditCard, 
  Truck, ArrowRight, ShoppingBag 
} from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();

const { items, totalItems, rawTotalPrice, discountAmount, finalTotalPrice } = storeToRefs(cartStore);

// Form thông tin khách hàng
const form = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  note: ''
});

const paymentMethod = ref('COD'); // 'COD' hoặc 'BANKING'
const isSubmitting = ref(false);
const orderCompleted = ref(null);

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

// Kiểm tra form hợp lệ
const isFormValid = computed(() => {
  return (
    form.value.fullName.trim().length >= 2 &&
    form.value.phone.trim().length >= 9 &&
    form.value.address.trim().length >= 5
  );
});

// Xử lý xác nhận đặt hàng
const handlePlaceOrder = () => {
  if (!isFormValid.value || items.value.length === 0 || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // 1. Khởi tạo đối tượng Order từ ShoppingCart OOP instance
    const newOrder = Order.createFromCart(
      cartStore.cartInstance,
      form.value,
      paymentMethod.value
    );

    // 2. Lưu vào StorageService
    StorageService.saveOrder(newOrder.toJSON());

    // 3. Xóa giỏ hàng sau khi đặt thành công
    cartStore.clearCart();

    // 4. Lưu trạng thái đơn hàng để hiển thị màn hình chúc mừng
    orderCompleted.value = newOrder;
  } catch (err) {
    console.error('Lỗi khi tạo đơn hàng:', err);
    alert('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại!');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- MÀN HÌNH ĐẶT HÀNG THÀNH CÔNG -->
    <div v-if="orderCompleted" class="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12 text-center">
      <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <CheckCircle2 class="w-12 h-12 stroke-[2.5]" />
      </div>

      <span class="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
        Đặt Hàng Thành Công
      </span>

      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
        Cảm Ơn Bạn Đã Mua Sắm Tại LuxeAccessories!
      </h1>

      <p class="text-sm text-slate-500 mt-2">
        Mã đơn hàng của bạn là: <strong class="text-brand-600 font-mono text-base">{{ orderCompleted.orderId }}</strong>
      </p>

      <!-- Tóm tắt đơn hàng đã đặt -->
      <div class="mt-8 p-6 bg-slate-50 rounded-2xl text-left border border-slate-200/80 space-y-3 text-xs sm:text-sm">
        <div class="flex justify-between text-slate-600">
          <span>Người nhận:</span>
          <strong class="text-slate-800">{{ orderCompleted.customerInfo.fullName }} ({{ orderCompleted.customerInfo.phone }})</strong>
        </div>
        <div class="flex justify-between text-slate-600">
          <span>Địa chỉ giao hàng:</span>
          <span class="text-slate-800 text-right">{{ orderCompleted.customerInfo.address }}</span>
        </div>
        <div class="flex justify-between text-slate-600">
          <span>Hình thức thanh toán:</span>
          <span class="font-bold text-slate-800">{{ orderCompleted.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản Ngân hàng (QR)' }}</span>
        </div>
        <div class="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
          <span>Tổng số tiền:</span>
          <strong class="text-base font-extrabold text-brand-600">{{ formatCurrency(orderCompleted.finalTotal) }}</strong>
        </div>
      </div>

      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <router-link 
          to="/" 
          class="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-600/20 transition-all"
        >
          Tiếp Tục Mua Sắm
        </router-link>
      </div>
    </div>

    <!-- MÀN HÌNH NHẬP THÔNG TIN VÀ XÁC NHẬN THANH TOÁN -->
    <div v-else>
      <div class="mb-8">
        <router-link to="/cart" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors mb-3">
          <ArrowLeft class="w-4 h-4" /> Quay lại giỏ hàng
        </router-link>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Thông Tin Thanh Toán & Giao Hàng</h1>
      </div>

      <!-- Nếu giỏ trống -->
      <div v-if="items.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200">
        <p class="text-slate-500">Giỏ hàng của bạn đang trống, không thể tiến hành thanh toán.</p>
        <router-link to="/" class="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl">
          Về Trang Chủ
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Form nhập thông tin nhận hàng (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck class="w-5 h-5 text-brand-600" /> Địa Chỉ Nhận Hàng
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Họ và Tên *</label>
              <input 
                v-model.trim="form.fullName" 
                type="text" 
                placeholder="Nguyễn Văn A" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Số Điện Thoại *</label>
              <input 
                v-model.trim="form.phone" 
                type="tel" 
                placeholder="0912 345 678" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Địa Chỉ Email (Nhận hóa đơn điện tử)</label>
            <input 
              v-model.trim="form.email" 
              type="email" 
              placeholder="example@gmail.com" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Địa Chỉ Chi Tiết (Số nhà, đường, phường/xã, quận/huyện) *</label>
            <textarea 
              v-model.trim="form.address" 
              rows="2"
              placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Ghi Chú Đơn Hàng (Tùy chọn)</label>
            <input 
              v-model.trim="form.note" 
              type="text" 
              placeholder="Giao giờ hành chính, gọi trước khi giao..." 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <hr class="border-slate-100" />

          <!-- Phương thức thanh toán -->
          <div>
            <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <CreditCard class="w-5 h-5 text-brand-600" /> Phương Thức Thanh Toán
            </h2>

            <div class="space-y-2.5">
              <label 
                class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
                :class="paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500' : 'border-slate-200 bg-white'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" value="COD" v-model="paymentMethod" class="text-brand-600 focus:ring-brand-500" />
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Thanh toán khi nhận hàng (COD)</div>
                    <div class="text-[11px] text-slate-500">Kiểm tra phụ kiện trước khi thanh toán tiền mặt cho shipper</div>
                  </div>
                </div>
                <Truck class="w-5 h-5 text-slate-400" />
              </label>

              <label 
                class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all"
                :class="paymentMethod === 'BANKING' ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500' : 'border-slate-200 bg-white'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" value="BANKING" v-model="paymentMethod" class="text-brand-600 focus:ring-brand-500" />
                  <div>
                    <div class="font-bold text-xs sm:text-sm text-slate-800">Chuyển khoản Ngân hàng (VietQR)</div>
                    <div class="text-[11px] text-slate-500">Quét mã QR qua app ngân hàng tiện lợi & nhanh chóng</div>
                  </div>
                </div>
                <CreditCard class="w-5 h-5 text-slate-400" />
              </label>
            </div>
          </div>
        </div>

        <!-- Tóm tắt đơn hàng & Nút Xác nhận (5 cols) -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Sản Phẩm Đặt Mua</span>
            <span class="text-xs font-semibold text-brand-600">{{ totalItems }} món</span>
          </h2>

          <!-- Mini danh sách món hàng -->
          <div class="max-h-60 overflow-y-auto divide-y divide-slate-100 space-y-2 pr-1">
            <div 
              v-for="item in items" 
              :key="item.getItemKey()" 
              class="flex items-center justify-between gap-3 py-2 text-xs"
            >
              <div class="flex items-center gap-2.5">
                <img 
                  :src="item.variant?.imageUrl || item.product?.getPrimaryImage()" 
                  :alt="item.product?.name" 
                  class="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div>
                  <div class="font-bold text-slate-800 line-clamp-1">{{ item.product?.name }}</div>
                  <div class="text-slate-500 text-[11px]">{{ item.variant?.color }} (x{{ item.quantity }})</div>
                </div>
              </div>
              <span class="font-bold text-slate-800 shrink-0">{{ formatCurrency(item.getSubtotal()) }}</span>
            </div>
          </div>

          <!-- Chi tiết giá cả -->
          <div class="pt-4 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm">
            <div class="flex justify-between text-slate-600">
              <span>Tạm tính:</span>
              <span class="font-semibold text-slate-800">{{ formatCurrency(rawTotalPrice) }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Khuyến mãi / Giảm giá:</span>
              <span class="font-semibold text-emerald-600">-{{ formatCurrency(discountAmount) }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span class="font-semibold text-emerald-600">Miễn phí</span>
            </div>
            <div class="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span class="font-bold text-sm text-slate-800">Tổng thanh toán:</span>
              <span class="text-2xl font-black text-brand-600">{{ formatCurrency(finalTotalPrice) }}</span>
            </div>
          </div>

          <!-- Nút Đặt hàng -->
          <button 
            @click="handlePlaceOrder"
            :disabled="!isFormValid || isSubmitting"
            class="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-extrabold text-sm shadow-xl shadow-brand-600/30 disabled:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting">Đang xử lý đơn hàng...</span>
            <span v-else class="flex items-center gap-2">
              Xác Nhận Đặt Hàng <ArrowRight class="w-4 h-4" />
            </span>
          </button>

          <p class="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" /> Thông tin của bạn được mã hóa & bảo mật tuyệt đối
          </p>
        </div>

      </div>
    </div>
  </div>
</template>
