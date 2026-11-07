<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore.js';
import { useCartStore } from '@/stores/cartStore.js';
import { useAIStore } from '@/stores/aiStore.js';
import { 
  ArrowLeft, Star, ShoppingBag, Check, ShieldCheck, 
  Truck, Sparkles, AlertCircle, Plus, Minus 
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const aiStore = useAIStore();

// Trạng thái cục bộ của view
const selectedSku = ref('');
const quantity = ref(1);
const activeImageIndex = ref(0);
const showAddSuccess = ref(false);

// Lấy sản phẩm từ store theo id trên route params
const product = computed(() => {
  return productStore.getProductById(route.params.id);
});

// Biến thể đang được chọn (đối tượng ProductVariant)
const selectedVariant = computed(() => {
  if (!product.value) return null;
  return product.value.getVariant(selectedSku.value) || product.value.getDefaultVariant();
});

// Computed tự động tính giá bán theo biến thể chọn (sử dụng phương thức OOP getPriceForVariant)
const currentPrice = computed(() => {
  if (!product.value || !selectedVariant.value) return 0;
  return product.value.getPriceForVariant(selectedVariant.value.sku);
});

// Định dạng tiền tệ
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice.value);
});

// Kiểm tra tình trạng kho của biến thể hiện tại (sử dụng method OOP isInStock)
const isAvailableInStock = computed(() => {
  if (!product.value || !selectedVariant.value) return false;
  return product.value.isInStock(selectedVariant.value.sku, quantity.value);
});

// Số lượng tồn kho của biến thể đang chọn
const currentStockQty = computed(() => {
  return selectedVariant.value?.stockQuantity || 0;
});

// Tự động khởi tạo SKU mặc định khi product được tải
watch(product, (newVal) => {
  if (newVal) {
    const defaultV = newVal.getDefaultVariant();
    if (defaultV) {
      selectedSku.value = defaultV.sku;
    }
  }
}, { immediate: true });

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }
});

// Xử lý chọn biến thể
const handleSelectVariant = (sku) => {
  selectedSku.value = sku;
  quantity.value = 1; // Reset số lượng về 1 khi đổi biến thể
};

// Xử lý thêm vào giỏ hàng
const handleAddToCart = () => {
  if (!product.value || !selectedVariant.value || !isAvailableInStock.value) return;

  const success = cartStore.addToCart(product.value, selectedVariant.value, quantity.value);
  if (success) {
    showAddSuccess.value = true;
    setTimeout(() => {
      showAddSuccess.value = false;
    }, 2500);
  }
};

// Mua ngay (Thêm vào giỏ và chuyển thẳng sang /cart)
const handleBuyNow = () => {
  if (!product.value || !selectedVariant.value || !isAvailableInStock.value) return;

  cartStore.addToCart(product.value, selectedVariant.value, quantity.value);
  router.push('/cart');
};

// Nhờ AI tư vấn cho sản phẩm này
const askAIAboutProduct = () => {
  aiStore.isOpen = true;
  aiStore.sendMessage(
    `Tư vấn giúp mình cách phối đồ với món: ${product.value.name} (Màu: ${selectedVariant.value.color})`,
    productStore.products
  );
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Nút quay lại trang danh sách -->
    <router-link 
      to="/" 
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors mb-6 group"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Quay lại Danh sách sản phẩm
    </router-link>

    <!-- Trạng thái không tìm thấy sản phẩm -->
    <div v-if="!product" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <AlertCircle class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h2 class="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
      <p class="text-sm text-slate-500 mt-1">Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
      <router-link to="/" class="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
        Về Trang Chủ
      </router-link>
    </div>

    <!-- Chi tiết sản phẩm -->
    <div v-else class="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm p-6 sm:p-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        <!-- Cột trái: Bộ sưu tập hình ảnh -->
        <div>
          <!-- Ảnh lớn chính -->
          <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative group">
            <img 
              :src="selectedVariant?.imageUrl || product.images[activeImageIndex] || product.getPrimaryImage()" 
              :alt="product.name" 
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {{ product.category }}
            </span>
          </div>

          <!-- Thumbnails ảnh -->
          <div v-if="product.images.length > 1" class="flex gap-3 mt-4 overflow-x-auto pb-1">
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="activeImageIndex = idx"
              class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50"
              :class="activeImageIndex === idx ? 'border-brand-600 shadow-md scale-95' : 'border-transparent hover:border-slate-300'"
            >
              <img :src="img" :alt="product.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Cột phải: Thông tin, Biến thể và Mua hàng -->
        <div class="flex flex-col justify-between">
          <div>
            <!-- Đánh giá và SKU -->
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <div class="flex items-center gap-1.5 text-amber-500 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star class="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>{{ product.rating }} / 5.0 (Đánh giá chất lượng)</span>
              </div>
              <span class="font-mono text-slate-400">SKU: {{ selectedVariant?.sku }}</span>
            </div>

            <!-- Tên sản phẩm -->
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {{ product.name }}
            </h1>

            <!-- Giá bán được tính tự động (Computed) -->
            <div class="mt-4 flex items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-black text-brand-600">
                {{ formattedPrice }}
              </span>
              <span v-if="selectedVariant?.priceAdjustment > 0" class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +{{ selectedVariant.priceAdjustment.toLocaleString('vi-VN') }}đ (Biến thể cao cấp)
              </span>
            </div>

            <!-- Mô tả sản phẩm -->
            <p class="mt-4 text-sm text-slate-600 leading-relaxed">
              {{ product.description }}
            </p>

            <hr class="my-6 border-slate-100" />

            <!-- LỰA CHỌN BIẾN THỂ (Variant Selection) -->
            <div class="space-y-5">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Chọn Phiên Bản & Màu Sắc: 
                  <span class="text-brand-600 font-semibold lowercase">({{ selectedVariant?.color }} - {{ selectedVariant?.size }})</span>
                </label>

                <!-- Dynamic Class Binding cho từng biến thể -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button 
                    v-for="v in product.variants" 
                    :key="v.sku"
                    @click="handleSelectVariant(v.sku)"
                    type="button"
                    class="p-3 rounded-2xl border text-left transition-all relative flex items-center justify-between"
                    :class="[
                      selectedSku === v.sku 
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-white',
                      !v.isAvailable(1) ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''
                    ]"
                  >
                    <div>
                      <div class="font-bold text-xs sm:text-sm text-slate-800">{{ v.color }}</div>
                      <div class="text-[11px] text-slate-500">{{ v.size }}</div>
                    </div>

                    <div class="text-right">
                      <span v-if="v.isAvailable(1)" class="text-[11px] font-semibold text-emerald-600 block">
                        Còn {{ v.stockQuantity }} cái
                      </span>
                      <span v-else class="text-[11px] font-bold text-rose-500 block">
                        Hết hàng
                      </span>
                      <span v-if="v.priceAdjustment > 0" class="text-[10px] text-slate-400">
                        +{{ (v.priceAdjustment / 1000).toFixed(0) }}k
                      </span>
                    </div>

                    <!-- Icon tick khi được chọn -->
                    <div 
                      v-if="selectedSku === v.sku" 
                      class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow"
                    >
                      <Check class="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                </div>
              </div>

              <!-- CHỌN SỐ LƯỢNG (v-model.number) -->
              <div class="flex items-center gap-4">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-700">Số Lượng:</label>
                
                <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50 shadow-inner overflow-hidden">
                  <button 
                    @click="quantity = Math.max(1, quantity - 1)" 
                    :disabled="quantity <= 1"
                    class="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                  <input 
                    v-model.number="quantity" 
                    type="number" 
                    min="1" 
                    :max="currentStockQty" 
                    class="w-14 text-center font-bold text-slate-800 text-sm bg-transparent focus:outline-none"
                  />
                  <button 
                    @click="quantity = Math.min(currentStockQty, quantity + 1)" 
                    :disabled="quantity >= currentStockQty"
                    class="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>

                <!-- Tình trạng kho với v-if / v-else -->
                <span v-if="isAvailableInStock" class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check class="w-3.5 h-3.5" /> Sẵn sàng giao ngay (Kho: {{ currentStockQty }})
                </span>
                <span v-else class="text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5" /> Biến thể này tạm hết hàng hoặc không đủ số lượng
                </span>
              </div>
            </div>
          </div>

          <!-- CÁC NÚT MUA HÀNG & TƯ VẤN AI -->
          <div class="mt-8 space-y-3">
            <!-- Toast thông báo thêm thành công -->
            <transition
              enter-active-class="transform transition duration-300 ease-out"
              enter-from-class="scale-95 opacity-0 -translate-y-2"
              enter-to-class="scale-100 opacity-100 translate-y-0"
              leave-active-class="transform transition duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div v-if="showAddSuccess" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm">
                <span class="flex items-center gap-1.5">
                  <Check class="w-4 h-4 text-emerald-600" />
                  Đã thêm {{ quantity }}x "{{ product.name }} ({{ selectedVariant?.color }})" vào giỏ hàng!
                </span>
                <router-link to="/cart" class="underline text-emerald-900 hover:text-black">Xem giỏ hàng</router-link>
              </div>
            </transition>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                @click="handleAddToCart"
                :disabled="!isAvailableInStock"
                class="w-full py-3.5 px-6 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-sm border border-brand-200/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag class="w-4 h-4" />
                Thêm Vào Giỏ Hàng
              </button>

              <button 
                @click="handleBuyNow"
                :disabled="!isAvailableInStock"
                class="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mua Ngay
              </button>
            </div>

            <!-- Nút gọi AI tư vấn phối đồ cho sản phẩm này -->
            <button 
              @click="askAIAboutProduct" 
              class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <Sparkles class="w-3.5 h-3.5 text-brand-600" />
              Nhờ AI Stylist tư vấn cách phối đồ với món này
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
