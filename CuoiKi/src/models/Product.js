import { ProductVariant } from './ProductVariant.js';

/**
 * Class đại diện cho Thực thể Sản phẩm Thời trang / Phụ kiện
 * Chứa danh sách các biến thể (Aggregation / Composition) và logic tính giá, kiểm tra tồn kho
 */
export class Product {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} [data.category='Phụ kiện']
   * @param {number} data.basePrice
   * @param {string} [data.description='']
   * @param {number} [data.rating=5]
   * @param {string[]} [data.images=[]]
   * @param {Object[]} [data.variants=[]]
   */
  constructor({ id, name, category = 'Phụ kiện', basePrice, description = '', rating = 5, images = [], variants = [] }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.basePrice = Number(basePrice);
    this.description = description;
    this.rating = Number(rating);
    this.images = Array.isArray(images) ? images : [];
    
    // Khởi tạo các instance ProductVariant theo chuẩn OOP
    this.variants = variants.map(v => v instanceof ProductVariant ? v : new ProductVariant(v));
  }

  /**
   * Lấy ảnh đại diện chính của sản phẩm
   * @returns {string}
   */
  getPrimaryImage() {
    return this.images[0] || (this.variants[0]?.imageUrl) || 'https://via.placeholder.com/400?text=No+Image';
  }

  /**
   * Tìm kiếm biến thể theo mã SKU
   * @param {string} sku
   * @returns {ProductVariant | null}
   */
  getVariant(sku) {
    return this.variants.find(v => v.sku === sku) || null;
  }

  /**
   * Biến thể mặc định (ưu tiên biến thể còn hàng đầu tiên)
   * @returns {ProductVariant | null}
   */
  getDefaultVariant() {
    const available = this.variants.find(v => v.isAvailable(1));
    return available || this.variants[0] || null;
  }

  /**
   * Tính toán giá bán thực tế theo biến thể đã chọn
   * Giá bán = Giá gốc (basePrice) + Mức chênh lệch (priceAdjustment)
   * @param {string} sku
   * @returns {number}
   */
  getPriceForVariant(sku) {
    const variant = this.getVariant(sku);
    if (!variant) return this.basePrice;
    return Math.max(0, this.basePrice + variant.priceAdjustment);
  }

  /**
   * Kiểm tra tồn kho của sản phẩm theo biến thể và số lượng yêu cầu
   * @param {string} sku
   * @param {number} requestedQty
   * @returns {boolean}
   */
  isInStock(sku, requestedQty = 1) {
    const variant = this.getVariant(sku);
    return variant ? variant.isAvailable(requestedQty) : false;
  }

  /**
   * Tổng tồn kho của toàn bộ các biến thể
   * @returns {number}
   */
  getTotalStock() {
    return this.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  }

  /**
   * Xuất dữ liệu thuần để lưu trữ hoặc truyền qua mạng
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      basePrice: this.basePrice,
      description: this.description,
      rating: this.rating,
      images: this.images,
      variants: this.variants.map(v => v.toJSON())
    };
  }
}
