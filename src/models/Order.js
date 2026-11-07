import { ShoppingCart } from './ShoppingCart.js';

/**
 * Class đại diện cho Thực thể Đơn hàng (Order)
 * Đóng gói dữ liệu thanh toán, thông tin giao nhận và trạng thái xử lý
 */
export class Order {
  /**
   * @param {Object} data
   * @param {string} data.orderId - Mã đơn hàng duy nhất (VD: 'ORD-1698765432')
   * @param {Array} data.items - Snapshot danh sách các mặt hàng đã mua
   * @param {Object} data.customerInfo - Thông tin khách hàng (họ tên, sđt, địa chỉ, ghi chú)
   * @param {string} [data.paymentMethod='COD'] - Phương thức thanh toán (COD / Chuyển khoản)
   * @param {number} data.rawTotal - Tổng tiền gốc
   * @param {number} data.discount - Số tiền giảm giá
   * @param {number} data.finalTotal - Tổng thanh toán cuối cùng
   * @param {string} [data.status='Đã đặt hàng'] - Trạng thái đơn hàng
   * @param {string} [data.createdAt] - Thời điểm tạo đơn
   */
  constructor({
    orderId,
    items = [],
    customerInfo = {},
    paymentMethod = 'COD',
    rawTotal = 0,
    discount = 0,
    finalTotal = 0,
    status = 'Đã đặt hàng',
    createdAt = new Date().toISOString()
  }) {
    this.orderId = orderId || `ORD-${Date.now().toString().slice(-6)}`;
    this.items = items;
    this.customerInfo = customerInfo;
    this.paymentMethod = paymentMethod;
    this.rawTotal = Number(rawTotal);
    this.discount = Number(discount);
    this.finalTotal = Number(finalTotal);
    this.status = status;
    this.createdAt = createdAt;
  }

  /**
   * Factory Method khởi tạo Order từ một ShoppingCart và thông tin người mua
   * @param {ShoppingCart} cart
   * @param {Object} customerInfo
   * @param {string} paymentMethod
   * @returns {Order}
   */
  static createFromCart(cart, customerInfo, paymentMethod = 'COD') {
    if (!(cart instanceof ShoppingCart)) {
      throw new Error('Tham số cart phải là một thể hiện của ShoppingCart');
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return new Order({
      orderId,
      items: cart.toJSON(),
      customerInfo: { ...customerInfo },
      paymentMethod,
      rawTotal: cart.getRawTotalPrice(),
      discount: cart.getDiscountAmount(),
      finalTotal: cart.getFinalTotalPrice(),
      status: 'Đã đặt hàng',
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Kiểm tra xem đơn hàng có hợp lệ không
   * @returns {boolean}
   */
  isValid() {
    return (
      this.items.length > 0 &&
      Boolean(this.customerInfo.fullName) &&
      Boolean(this.customerInfo.phone) &&
      Boolean(this.customerInfo.address) &&
      this.finalTotal >= 0
    );
  }

  /**
   * Serialize dữ liệu đơn hàng
   */
  toJSON() {
    return {
      orderId: this.orderId,
      items: this.items,
      customerInfo: this.customerInfo,
      paymentMethod: this.paymentMethod,
      rawTotal: this.rawTotal,
      discount: this.discount,
      finalTotal: this.finalTotal,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}
