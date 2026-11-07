/**
 * Class Service kết nối với Trí tuệ Nhân tạo (Google Gemini API / OpenAI API)
 * Phụ trách tư vấn thời trang, gợi ý phối phụ kiện và hỗ trợ giải đáp thắc mắc của khách hàng
 */
export class AIService {
  /**
   * @param {string} [apiKey='']
   * @param {string} [modelName='gemini-1.5-flash']
   */
  constructor(apiKey = '', modelName = 'gemini-1.5-flash') {
    this.apiKey = apiKey || (import.meta.env?.VITE_GEMINI_API_KEY || '');
    this.modelName = modelName;
    this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;
  }

  /**
   * Cập nhật API Key khi người dùng cấu hình trực tiếp từ giao diện
   * @param {string} key
   */
  setApiKey(key) {
    this.apiKey = key.trim();
  }

  /**
   * Tạo system prompt cung cấp context danh mục phụ kiện thời trang cho AI
   * @param {Array} productCatalog
   * @returns {string}
   */
  buildSystemInstruction(productCatalog = []) {
    const catalogSummary = productCatalog.map(p => {
      const variantsText = (p.variants || []).map(v => `${v.color} (${v.size}, kho: ${v.stockQuantity})`).join(', ');
      return `- [${p.id}] ${p.name}: Giá từ ${p.basePrice?.toLocaleString('vi-VN')}đ. Biến thể: ${variantsText}. Mô tả: ${p.description}`;
    }).join('\n');

    return `Bạn là "LuxeStylist" - Chuyên gia tư vấn thời trang & phụ kiện cao cấp của cửa hàng LuxeAccessories.
Nhiệm vụ của bạn:
1. Tư vấn phối đồ (outfit), chọn kính mát, túi xách, đồng hồ, dây chuyền phù hợp với phong cách của khách (công sở, dự tiệc, dạo phố, vintage...).
2. Hướng dẫn khách hàng chọn mẫu phụ kiện hiện có trong danh mục cửa hàng.
3. Giải đáp thắc mắc về đơn hàng, thời gian giao hàng (2-3 ngày), chính sách đổi trả miễn phí trong 7 ngày, bảo hành 12 tháng.
4. Giọng điệu: Thân thiện, lịch sự, am hiểu thời trang và tràn đầy năng lượng.
5. Luôn ưu tiên giới thiệu các sản phẩm có thật trong danh mục dưới đây:

DANH MỤC SẢN PHẨM HIỆN TẠI:
${catalogSummary}
`;
  }

  /**
   * Gửi tin nhắn đến Gemini API kèm ngữ cảnh sản phẩm
   * @param {string} userMessage
   * @param {Array} productCatalog
   * @param {Array} history
   * @returns {Promise<string>}
   */
  async sendMessage(userMessage, productCatalog = [], history = []) {
    if (!userMessage || !userMessage.trim()) {
      return 'Dạ bạn có thể cho LuxeStylist biết bạn cần tư vấn phối phụ kiện gì hôm nay không ạ?';
    }

    // Nếu không có API Key, sử dụng Mock AI thông minh để vẫn trải nghiệm được tính năng
    if (!this.apiKey) {
      return this.generateSmartMockResponse(userMessage, productCatalog);
    }

    try {
      const systemInstruction = this.buildSystemInstruction(productCatalog);
      
      const contents = [];
      // Đưa lịch sử trò chuyện gần nhất vào context
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }

      // Thêm câu hỏi hiện tại
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Gemini API Error:', errorData);
        // Fallback sang smart mock khi gặp lỗi API
        return `[Lưu ý: API Key gặp vấn đề (${response.status})]\n\n` + this.generateSmartMockResponse(userMessage, productCatalog);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return reply || this.generateSmartMockResponse(userMessage, productCatalog);

    } catch (error) {
      console.error('AIService.sendMessage Exception:', error);
      return this.generateSmartMockResponse(userMessage, productCatalog);
    }
  }

  /**
   * Tạo phản hồi mô phỏng thông minh (Smart Mock) khi chưa có API Key
   * Giúp giáo viên/người dùng kiểm thử toàn diện chức năng mà không bắt buộc có key thật
   * @param {string} query
   * @param {Array} catalog
   * @returns {string}
   */
  generateSmartMockResponse(query, catalog = []) {
    const q = query.toLowerCase();

    if (q.includes('chào') || q.includes('hello') || q.includes('hi')) {
      return 'Dạ LuxeStylist xin chào bạn! Cửa hàng hôm nay có nhiều mẫu túi xách da, kính mát titan và đồng hồ mặt sapphire rất đẹp. Bạn đang tìm phụ kiện đi làm, đi chơi hay dự tiệc ạ? ✨';
    }

    if (q.includes('túi') || q.includes('túi xách')) {
      return '👜 Cửa hàng có mẫu "Túi Xách Da Minimalist Cao Cấp" giá từ 850.000đ với 2 màu Đen Classic và Nâu Vintage. Phù hợp cả đi làm văn phòng lẫn cà phê cuối tuần!';
    }

    if (q.includes('kính') || q.includes('kính mát') || q.includes('râm')) {
      return '🕶️ Gợi ý tuyệt vời cho bạn là "Kính Mát Chống Tia UV Polarized Retro" giá 450.000đ. Gọng titan siêu nhẹ kết hợp tròng phân cực chống chói cực tốt dưới nắng gắt!';
    }

    if (q.includes('đồng hồ') || q.includes('watch')) {
      return '⌚ Bạn tham khảo mẫu "Đồng Hồ Nữ Dây Da Mặt Số Sapphire" chống nước 3ATM, kính Sapphire chống trầy giá 1.250.000đ. Đang có phiên bản Vàng Hồng rất tôn da!';
    }

    if (q.includes('dây chuyền') || q.includes('vòng cổ') || q.includes('trang sức')) {
      return '💎 Mẫu "Dây Chuyền Bạc Ý S925 Đính Đá Zirconia" (590.000đ) là best-seller tuần này. Phối cùng đầm cổ chữ V hoặc áo sơ mi mở cúc nhẹ sẽ cực kỳ sang trọng.';
    }

    if (q.includes('phối') || q.includes('outfit') || q.includes('set') || q.includes('mặc')) {
      return '✨ Gợi ý Set Phụ Kiện Thanh Lịch:\n- Đi làm: Túi xách da đen size M + Đồng hồ mặt Sapphire + Dây chuyền bạc S925.\n- Đi dạo phố / Du lịch: Kính mát Retro UV400 + Mũ beret phong cách Pháp + Thắt lưng da bò.\nBạn có muốn mình thêm ngay vào giỏ hàng món nào không ạ?';
    }

    if (q.includes('ship') || q.includes('giao hàng') || q.includes('vận chuyển')) {
      return '🚚 Shop miễn phí giao hàng toàn quốc cho đơn từ 500.000đ (dùng mã FREESHIP). Thời gian giao hàng từ 2 - 3 ngày làm việc bạn nhé!';
    }

    if (q.includes('đổi') || q.includes('trả') || q.includes('bảo hành')) {
      return '🛡️ Cửa hàng hỗ trợ đổi trả miễn phí trong 7 ngày nếu có lỗi từ nhà sản xuất, và bảo hành chính hãng 12 tháng cho toàn bộ sản phẩm đồng hồ & phụ kiện da!';
    }

    return `Dạ LuxeStylist đã ghi nhận câu hỏi của bạn: "${query}". Cửa hàng luôn sẵn sàng hỗ trợ tư vấn các dòng phụ kiện cao cấp. Bạn có thể xem nhanh danh mục ở Trang chủ hoặc hỏi cụ thể về Túi xách, Kính mát, Đồng hồ nhé! 💖`;
  }
}
