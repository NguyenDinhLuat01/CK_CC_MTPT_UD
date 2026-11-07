import { CartItem } from './CartItem.js';
import { DiscountPolicy } from './DiscountPolicy.js';
import { Product } from './Product.js';
import { ProductVariant } from './ProductVariant.js';

/**
 * Class đại diện cho Giỏ hàng toàn cục (Shopping Cart)
 * Quản lý tập hợp CartItem, áp dụng chiến lược giảm giá (DiscountPolicy)
 * Cung cấp các phương thức tính toán tổng số lượng, tổng tiền và tiền chiết khấu
 */
export class ShoppingCart {
  constructor() {
    /** @type {CartItem[]} */
    this.items = [];
    /** @type {DiscountPolicy | null} */
    this.discountPolicy = null;
  }

  /**
   * Thêm sản phẩm cùng biến thể vào giỏ hàng
   * Nếu đã tồn tại món này thì cộng dồn số lượng
   * @param {Product} product
   * @param {ProductVariant} variant
   * @param {number} [quantity=1]
   * @returns {boolean}
   */
  addItem(product, variant, quantity = 1) {
    if (!product || !variant) return false;

    const itemKey = `${product.id}__${variant.sku}`;
    const existingIndex = this.items.findIndex(item => item.getItemKey() === itemKey);

    if (existingIndex > -1) {
      // Đã có trong giỏ => Tăng số lượng
      return this.items[existingIndex].increaseQuantity(quantity);
    } else {
      // Thêm mới vào giỏ
      const newItem = new CartItem({ product, variant, quantity });
      this.items.push(newItem);
      return true;
    }
  }

  /**
   * Cập nhật số lượng của một món hàng theo itemKey
   * @param {string} itemKey
   * @param {number} quantity
   */
  updateQuantity(itemKey, quantity) {
    const item = this.items.find(i => i.getItemKey() === itemKey);
    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(itemKey);
    } else {
      item.setQuantity(quantity);
    }
  }

  /**
   * Xóa một món hàng khỏi giỏ
   * @param {string} itemKey
   */
  removeItem(itemKey) {
    this.items = this.items.filter(item => item.getItemKey() !== itemKey);
  }

  /**
   * Xóa sạch giỏ hàng (khi hoàn tất thanh toán hoặc người dùng chọn làm trống)
   */
  clear() {
    this.items = [];
    this.discountPolicy = null;
  }

  /**
   * Lấy tổng số lượng tất cả các mặt hàng trong giỏ
   * @returns {number}
   */
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Tổng tiền hàng gốc (chưa tính chiết khấu / giảm giá)
   * @returns {number}
   */
  getRawTotalPrice() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  /**
   * Tính số tiền được chiết khấu theo DiscountPolicy hiện hành
   * @returns {number}
   */
  getDiscountAmount() {
    if (!this.discountPolicy) return 0;
    return this.discountPolicy.calculateDiscount(this.getRawTotalPrice(), this.getTotalItems());
  }

  /**
   * Tổng số tiền thanh toán cuối cùng sau khi trừ chiết khấu
   * @returns {number}
   */
  getFinalTotalPrice() {
    return Math.max(0, this.getRawTotalPrice() - this.getDiscountAmount());
  }

  /**
   * Thiết lập hoặc đổi chính sách mã giảm giá
   * @param {DiscountPolicy | null} policy
   */
  setDiscountPolicy(policy) {
    this.discountPolicy = policy;
  }

  /**
   * Áp dụng mã giảm giá theo chuỗi ký tự
   * @param {string} couponCode
   * @returns {{ success: boolean, message: string }}
   */
  applyCouponCode(couponCode) {
    if (!couponCode) {
      this.discountPolicy = null;
      return { success: false, message: 'Đã hủy mã giảm giá.' };
    }

    const availableCoupons = DiscountPolicy.getPredefinedCoupons();
    const matched = availableCoupons.find(c => c.code.toLowerCase() === couponCode.trim().toLowerCase());

    if (!matched) {
      return { success: false, message: `Mã giảm giá "${couponCode}" không hợp lệ!` };
    }

    if (this.getRawTotalPrice() < matched.minOrderValue) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu ${matched.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã "${matched.code}".`
      };
    }

    this.discountPolicy = matched;
    return {
      success: true,
      message: `Áp dụng thành công mã "${matched.code}": ${matched.description}`
    };
  }

  /**
   * Khôi phục dữ liệu từ mảng snapshot trong LocalStorage
   * @param {Array} rawList
   */
  restoreFromSnapshot(rawList = []) {
    if (!Array.isArray(rawList)) return;
    this.items = [];
    for (const raw of rawList) {
      try {
        const product = new Product(raw.productSnapshot || {
          id: raw.productId,
          name: raw.name || 'Sản phẩm',
          basePrice: raw.basePrice || 0
        });
        const variant = new ProductVariant(raw.variantSnapshot || {
          sku: raw.variantSku,
          color: raw.color || '',
          size: raw.size || '',
          stockQuantity: 99
        });
        this.items.push(new CartItem({
          product,
          variant,
          quantity: raw.quantity || 1
        }));
      } catch (err) {
        console.warn('Lỗi khi khôi phục item giỏ hàng:', err);
      }
    }
  }

  /**
   * Serialize dữ liệu giỏ hàng để lưu vào LocalStorage
   * @returns {Array}
   */
  toJSON() {
    return this.items.map(item => item.toJSON());
  }
}
