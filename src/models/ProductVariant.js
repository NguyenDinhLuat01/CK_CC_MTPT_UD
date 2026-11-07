/**
 * Class đại diện cho một Biến thể của sản phẩm (Kích thước, Màu sắc, Giá phụ thu, Kho)
 * Tuân thủ nguyên lý OOP: Đóng gói thuộc tính biến thể và các hành vi kiểm tra tồn kho
 */
export class ProductVariant {
  /**
   * @param {Object} data
   * @param {string} data.sku - Mã định danh duy nhất của biến thể
   * @param {string} data.color - Tên màu sắc (VD: 'Đen Classic')
   * @param {string} data.size - Kích thước (VD: 'Size M', 'Freesize')
   * @param {number} data.stockQuantity - Số lượng hàng tồn trong kho
   * @param {number} [data.priceAdjustment=0] - Mức chênh lệch giá so với basePrice
   * @param {string} [data.imageUrl=''] - Ảnh riêng của biến thể
   */
  constructor({ sku, color, size, stockQuantity = 0, priceAdjustment = 0, imageUrl = '' }) {
    this.sku = sku;
    this.color = color;
    this.size = size;
    this.stockQuantity = Number(stockQuantity);
    this.priceAdjustment = Number(priceAdjustment);
    this.imageUrl = imageUrl;
  }

  /**
   * Kiểm tra xem biến thể này còn đủ hàng cho số lượng yêu cầu không
   * @param {number} requestedQty
   * @returns {boolean}
   */
  isAvailable(requestedQty = 1) {
    return this.stockQuantity >= requestedQty && this.stockQuantity > 0;
  }

  /**
   * Trừ tồn kho khi đặt hàng
   * @param {number} qty
   */
  deductStock(qty) {
    if (this.isAvailable(qty)) {
      this.stockQuantity -= qty;
      return true;
    }
    return false;
  }

  /**
   * Trả về nhãn tóm tắt thông tin biến thể
   * @returns {string}
   */
  getDisplayName() {
    return `${this.color} - ${this.size}`;
  }

  /**
   * Chuyển đổi thành Object thô để lưu trữ hoặc serialize
   */
  toJSON() {
    return {
      sku: this.sku,
      color: this.color,
      size: this.size,
      stockQuantity: this.stockQuantity,
      priceAdjustment: this.priceAdjustment,
      imageUrl: this.imageUrl
    };
  }
}
