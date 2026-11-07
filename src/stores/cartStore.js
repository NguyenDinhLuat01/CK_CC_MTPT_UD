import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ShoppingCart } from '@/models/ShoppingCart.js';
import { StorageService } from '@/models/StorageService.js';
import { Product } from '@/models/Product.js';
import { ProductVariant } from '@/models/ProductVariant.js';

/**
 * Pinia Store quản lý Giỏ hàng toàn cục (Setup Store Pattern)
 * Đóng gói đối tượng OOP ShoppingCart bên trong và tạo cầu nối phản ứng (Reactivity) cho Vue 3
 */
export const useCartStore = defineStore('cart', () => {
  // Instance OOP thuần túy chịu trách nhiệm toàn bộ logic nghiệp vụ giỏ hàng
  const cartInstance = ref(new ShoppingCart());

  // Biến cờ trigger reactivity khi mảng items bên trong ShoppingCart thay đổi
  const version = ref(0);

  /**
   * Helper cập nhật version và đồng bộ lưu trữ LocalStorage
   */
  const triggerUpdate = () => {
    version.value++;
    StorageService.saveCart(cartInstance.value.toJSON());
  };

  // ================= GETTERS (COMPUTED) =================
  /**
   * Tổng số lượng mặt hàng trong giỏ
   */
  const totalItems = computed(() => {
    // Phụ thuộc vào version để tự động re-compute khi giỏ hàng đổi
    // eslint-disable-next-line no-unused-expressions
    version.value;
    return cartInstance.value.getTotalItems();
  });

  /**
   * Danh sách các item trong giỏ (đối tượng CartItem)
   */
  const items = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    version.value;
    return cartInstance.value.items;
  });

  /**
   * Tổng tiền hàng gốc
   */
  const rawTotalPrice = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    version.value;
    return cartInstance.value.getRawTotalPrice();
  });

  /**
   * Tiền chiết khấu / giảm giá
   */
  const discountAmount = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    version.value;
    return cartInstance.value.getDiscountAmount();
  });

  /**
   * Tổng tiền thanh toán sau giảm giá
   */
  const finalTotalPrice = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    version.value;
    return cartInstance.value.getFinalTotalPrice();
  });

  /**
   * Chính sách giảm giá hiện tại (nếu có)
   */
  const activeDiscountPolicy = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    version.value;
    return cartInstance.value.discountPolicy;
  });

  // ================= ACTIONS =================
  /**
   * Thêm sản phẩm & biến thể vào giỏ
   * @param {Product} product
   * @param {ProductVariant} variant
   * @param {number} [quantity=1]
   */
  const addToCart = (product, variant, quantity = 1) => {
    const success = cartInstance.value.addItem(product, variant, quantity);
    if (success) {
      triggerUpdate();
    }
    return success;
  };

  /**
   * Cập nhật số lượng của một dòng sản phẩm
   * @param {string} itemKey
   * @param {number} quantity
   */
  const updateQuantity = (itemKey, quantity) => {
    cartInstance.value.updateQuantity(itemKey, quantity);
    triggerUpdate();
  };

  /**
   * Xóa sản phẩm khỏi giỏ
   * @param {string} itemKey
   */
  const removeFromCart = (itemKey) => {
    cartInstance.value.removeItem(itemKey);
    triggerUpdate();
  };

  /**
   * Áp dụng mã giảm giá
   * @param {string} couponCode
   */
  const applyCoupon = (couponCode) => {
    const result = cartInstance.value.applyCouponCode(couponCode);
    triggerUpdate();
    return result;
  };

  /**
   * Làm trống giỏ hàng (khi đặt hàng thành công)
   */
  const clearCart = () => {
    cartInstance.value.clear();
    triggerUpdate();
  };

  /**
   * Khôi phục giỏ hàng từ LocalStorage (gọi trong onMounted)
   */
  const initFromStorage = () => {
    const saved = StorageService.loadCart();
    if (saved && saved.length > 0) {
      cartInstance.value.restoreFromSnapshot(saved);
      version.value++;
    }
  };

  return {
    // State / Getters
    items,
    totalItems,
    rawTotalPrice,
    discountAmount,
    finalTotalPrice,
    activeDiscountPolicy,
    cartInstance,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    clearCart,
    initFromStorage
  };
});
