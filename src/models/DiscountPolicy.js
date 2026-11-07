/**
 * Class đại diện cho Chính sách giảm giá & Khuyến mãi (Strategy Pattern trong OOP)
 * Đóng gói quy tắc tính toán tiền chiết khấu dựa trên giá trị đơn hàng hoặc số lượng
 */
export class DiscountPolicy {
  /**
   * @param {Object} options
   * @param {string} [options.code=''] - Mã voucher (VD: 'LUXE10', 'FREESHIP')
   * @param {number} [options.percentage=0] - % giảm giá (VD: 10 nghĩa là 10%)
   * @param {number} [options.fixedAmount=0] - Số tiền giảm trực tiếp (VD: 50.000 VNĐ)
   * @param {number} [options.minOrderValue=0] - Giá trị đơn hàng tối thiểu để áp dụng
   * @param {number} [options.maxDiscountAmount=500000] - Số tiền giảm tối đa
   * @param {string} [options.description=''] - Mô tả chương trình khuyến mại
   */
  constructor({
    code = '',
    percentage = 0,
    fixedAmount = 0,
    minOrderValue = 0,
    maxDiscountAmount = 500000,
    description = ''
  } = {}) {
    this.code = code.toUpperCase().trim();
    this.percentage = Number(percentage);
    this.fixedAmount = Number(fixedAmount);
    this.minOrderValue = Number(minOrderValue);
    this.maxDiscountAmount = Number(maxDiscountAmount);
    this.description = description;
  }

  /**
   * Tính số tiền giảm giá hợp lệ
   * @param {number} rawTotalPrice - Tổng tiền gốc của đơn hàng
   * @param {number} totalItems - Tổng số lượng sản phẩm
   * @returns {number} Số tiền được chiết khấu
   */
  calculateDiscount(rawTotalPrice, totalItems = 0) {
    if (rawTotalPrice <= 0 || rawTotalPrice < this.minOrderValue) {
      return 0;
    }

    let discount = 0;

    // Giảm theo phần trăm
    if (this.percentage > 0) {
      discount += (rawTotalPrice * this.percentage) / 100;
    }

    // Giảm theo số tiền cố định
    if (this.fixedAmount > 0) {
      discount += this.fixedAmount;
    }

    // Giới hạn mức giảm tối đa
    if (this.maxDiscountAmount > 0) {
      discount = Math.min(discount, this.maxDiscountAmount);
    }

    // Không được giảm quá tổng tiền hàng
    return Math.min(discount, rawTotalPrice);
  }

  /**
   * Danh sách các mã voucher mẫu có thể sử dụng
   */
  static getPredefinedCoupons() {
    return [
      new DiscountPolicy({
        code: 'LUXE10',
        percentage: 10,
        minOrderValue: 300000,
        maxDiscountAmount: 200000,
        description: 'Giảm 10% cho đơn hàng từ 300.000đ (Tối đa 200.000đ)'
      }),
      new DiscountPolicy({
        code: 'VIP50K',
        fixedAmount: 50000,
        minOrderValue: 500000,
        description: 'Giảm ngay 50.000đ cho đơn hàng từ 500.000đ'
      }),
      new DiscountPolicy({
        code: 'WELCOME20',
        percentage: 20,
        minOrderValue: 700000,
        maxDiscountAmount: 300000,
        description: 'Giảm 20% tri ân khách hàng mới cho đơn từ 700.000đ'
      })
    ];
  }
}
