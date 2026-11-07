import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AIService } from '@/models/AIService.js';
import { StorageService } from '@/models/StorageService.js';

/**
 * Pinia Store quản lý Trạng thái Chatbot AI (Setup Store Pattern)
 * Đóng gói đối tượng OOP AIService
 */
export const useAIStore = defineStore('ai', () => {
  const isOpen = ref(false);
  const isLoading = ref(false);
  const apiKey = ref('');
  
  // Tin nhắn mặc định chào mừng
  const defaultWelcomeMessage = {
    id: 'welcome-msg',
    sender: 'ai',
    text: 'Xin chào! Mình là LuxeStylist ✨ Trợ lý tư vấn phối phụ kiện và thời trang. Hôm nay bạn muốn tìm phụ kiện gì nào?',
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };

  /** @type {import('vue').Ref<Array<{id: string, sender: 'user'|'ai', text: string, timestamp: string}>>} */
  const messages = ref([defaultWelcomeMessage]);

  // Instance OOP AIService
  const aiService = new AIService();

  /**
   * Bật/Tắt cửa sổ Chatbot nổi
   */
  const toggleChat = () => {
    isOpen.value = !isOpen.value;
  };

  /**
   * Lưu API Key tùy chỉnh từ người dùng
   * @param {string} key
   */
  const updateApiKey = (key) => {
    apiKey.value = key;
    aiService.setApiKey(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('luxe_gemini_api_key', key);
    }
  };

  /**
   * Khởi tạo lịch sử chat và API key từ LocalStorage
   */
  const initAI = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedKey = localStorage.getItem('luxe_gemini_api_key');
      if (savedKey) {
        apiKey.value = savedKey;
        aiService.setApiKey(savedKey);
      }

      const savedChat = StorageService.loadChatMessages();
      if (savedChat && savedChat.length > 0) {
        messages.value = savedChat;
      }
    }
  };

  /**
   * Gửi câu hỏi của người dùng và nhận câu trả lời từ AI
   * @param {string} userText
   * @param {Array} productCatalog
   */
  const sendMessage = async (userText, productCatalog = []) => {
    const text = userText.trim();
    if (!text || isLoading.value) return;

    // 1. Đẩy tin nhắn của User vào danh sách
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    messages.value.push(userMsg);
    StorageService.saveChatMessages(messages.value);

    // 2. Chuyển trạng thái đang suy nghĩ
    isLoading.value = true;

    try {
      // 3. Gọi phương thức OOP của AIService
      const replyText = await aiService.sendMessage(text, productCatalog, messages.value);

      // 4. Đẩy tin nhắn phản hồi của AI vào danh sách
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      messages.value.push(aiMsg);
      StorageService.saveChatMessages(messages.value);

    } catch (err) {
      console.error('Lỗi khi chat với AI:', err);
      messages.value.push({
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Rất tiếc, đã có sự cố kết nối với AI. Bạn vui lòng thử lại sau ít phút nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Xóa toàn bộ lịch sử tin nhắn
   */
  const clearMessages = () => {
    messages.value = [defaultWelcomeMessage];
    StorageService.saveChatMessages(messages.value);
  };

  return {
    isOpen,
    isLoading,
    apiKey,
    messages,
    toggleChat,
    updateApiKey,
    initAI,
    sendMessage,
    clearMessages
  };
});
