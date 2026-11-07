/**
 * Class Service chuyên biệt phụ trách tương tác với Web Storage (LocalStorage)
 * Đảm bảo tính đóng gói (Encapsulation), bảo vệ ứng dụng khỏi lỗi SSR hoặc QuotaExceededError
 */
export class StorageService {
  static CART_STORAGE_KEY = 'luxe_ecommerce_cart_v1';
  static ORDERS_STORAGE_KEY = 'luxe_ecommerce_orders_v1';
  static CHAT_STORAGE_KEY = 'luxe_ecommerce_chat_v1';

  /**
   * Lưu dữ liệu giỏ hàng vào LocalStorage
   * @param {Array} rawCartItems
   */
  static saveCart(rawCartItems) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(rawCartItems));
      }
    } catch (error) {
      console.error('StorageService.saveCart Error:', error);
    }
  }

  /**
   * Đọc dữ liệu giỏ hàng từ LocalStorage
   * @returns {Array}
   */
  static loadCart() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(this.CART_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error('StorageService.loadCart Error:', error);
    }
    return [];
  }

  /**
   * Xóa giỏ hàng khỏi LocalStorage
   */
  static clearCart() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('StorageService.clearCart Error:', error);
    }
  }

  /**
   * Lưu lịch sử đơn hàng đã đặt
   * @param {Object} order
   */
  static saveOrder(order) {
    try {
      const orders = this.loadOrders();
      orders.unshift(order);
      localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(orders.slice(0, 20)));
    } catch (error) {
      console.error('StorageService.saveOrder Error:', error);
    }
  }

  /**
   * Đọc danh sách đơn hàng đã đặt
   * @returns {Array}
   */
  static loadOrders() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(this.ORDERS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error('StorageService.loadOrders Error:', error);
    }
    return [];
  }

  /**
   * Lưu lịch sử tin nhắn Chatbot AI
   * @param {Array} messages
   */
  static saveChatMessages(messages) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
      }
    } catch (error) {
      console.error('StorageService.saveChatMessages Error:', error);
    }
  }

  /**
   * Đọc lịch sử tin nhắn Chatbot AI
   * @returns {Array}
   */
  static loadChatMessages() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(this.CHAT_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error('StorageService.loadChatMessages Error:', error);
    }
    return [];
  }
}
