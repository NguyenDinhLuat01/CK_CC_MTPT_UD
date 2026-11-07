import { Product } from './Product.js';
import { ProductVariant } from './ProductVariant.js';

/**
 * Class đại diện cho một Dòng sản phẩm trong Giỏ hàng (Cart Item)
 * Liên kết giữa Product, ProductVariant đã chọn và số lượng mua
 */
export class CartItem {
  /**
   * @param {Object} params
   * @param {Product} params.product - Đối tượng sản phẩm
   * @param {ProductVariant} params.variant - Đối tượng biến thể đã chọn
   * @param {number} [params.quantity=1] - Số lượng đặt mua
   */
  constructor({ product, variant, quantity = 1 }) {
    if (!(product instanceof Product)) {
      this.product = new Product(product);
    } else {
      this.product = product;
    }

    if (!(variant instanceof ProductVariant)) {
      this.variant = new ProductVariant(variant);
    } else {
      this.variant = variant;
    }

    this.quantity = Math.max(1, Number(quantity) || 1);
  }

  /**
   * Tạo khóa duy nhất cho item trong giỏ (kết hợp Product ID và SKU biến thể)
   * @returns {string}
   */
  getItemKey() {
    return `${this.product.id}__${this.variant.sku}`;
  }

  /**
   * Đơn giá thực tế của biến thể này
   * @returns {number}
   */
  getUnitPrice() {
    return this.product.getPriceForVariant(this.variant.sku);
  }

  /**
   * Thành tiền của dòng này = Đơn giá x Số lượng
   * @returns {number}
   */
  getSubtotal() {
    return this.getUnitPrice() * this.quantity;
  }

  /**
   * Tăng số lượng mua, kiểm tra tồn kho tối đa
   * @param {number} amount
   * @returns {boolean}
   */
  increaseQuantity(amount = 1) {
    const targetQty = this.quantity + amount;
    if (this.variant.isAvailable(targetQty)) {
      this.quantity = targetQty;
      return true;
    }
    // Nếu vượt quá tồn kho, đặt về mức tồn kho tối đa
    this.quantity = this.variant.stockQuantity;
    return false;
  }

  /**
   * Giảm số lượng mua (tối thiểu là 1)
   * @param {number} amount
   */
  decreaseQuantity(amount = 1) {
    this.quantity = Math.max(1, this.quantity - amount);
  }

  /**
   * Cập nhật số lượng trực tiếp
   * @param {number} qty
   */
  setQuantity(qty) {
    const parsed = Math.max(1, Number(qty) || 1);
    if (this.variant.isAvailable(parsed)) {
      this.quantity = parsed;
    } else {
      this.quantity = Math.max(1, this.variant.stockQuantity);
    }
  }

  /**
   * Chuyển đổi thành Object thô để serialize vào LocalStorage
   */
  toJSON() {
    return {
      productId: this.product.id,
      variantSku: this.variant.sku,
      quantity: this.quantity,
      productSnapshot: this.product.toJSON(),
      variantSnapshot: this.variant.toJSON()
    };
  }
}
