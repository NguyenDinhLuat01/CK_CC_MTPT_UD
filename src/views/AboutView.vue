<script setup>
import { 
  Sparkles, Layers, Box, Cpu, GitBranch, ShieldCheck, 
  Code2, CheckCircle2, Workflow, BookOpen 
} from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Hero Header -->
    <div class="text-center max-w-3xl mx-auto mb-12">
      <span class="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
        Giới Thiệu Đề Tài & Thương Hiệu
      </span>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
        LuxeAccessories & Kiến Trúc Dự Án Vue 3 SPA
      </h1>
      <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
        Ứng dụng Single Page Application (SPA) thương mại điện tử chuyên ngành Phụ kiện & Thời trang. 
        Được xây dựng trên nền tảng Vue 3 Composition API, Pinia Setup Store, Trợ lý AI Stylist (Gemini API) 
        kết hợp mô hình <strong>Lập trình Hướng đối tượng (OOP)</strong> và tự động hóa với <strong>GitHub Actions CI/CD</strong>.
      </p>
    </div>

    <!-- 1. VỀ THƯƠNG HIỆU THỜI TRANG -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-10">
      <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
        <Sparkles class="w-5 h-5 text-brand-600" /> Về LuxeAccessories
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <h3 class="font-bold text-slate-800 text-base mb-2">Đẳng Cấp Tinh Tế</h3>
          <p>Tập trung vào các dòng phụ kiện vượt thời gian: túi xách da PU cao cấp, kính mát titan chống tia UV400, đồng hồ mặt sapphire và trang sức bạc Ý 925.</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <h3 class="font-bold text-slate-800 text-base mb-2">Công Nghệ AI Stylist</h3>
          <p>Tích hợp trợ lý ảo LuxeStylist sử dụng mô hình ngôn ngữ lớn (LLM Gemini API) để tư vấn set đồ, giải đáp thắc mắc đơn hàng 24/7 tức thì.</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <h3 class="font-bold text-slate-800 text-base mb-2">Cam Kết Trải Nghiệm</h3>
          <p>Luồng dữ liệu một chiều mượt mà, tải trang nhanh không gián đoạn (SPA), hỗ trợ lưu trữ giỏ hàng ngoại tuyến qua LocalStorage.</p>
        </div>
      </div>
    </div>

    <!-- 2. KIẾN TRÚC PHẦN MỀM & THIẾT KẾ OOP (YÊU CẦU ĐẶC BIỆT BÀI CUỐI KỲ) -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-10">
      <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Kiến Trúc Hướng Đối Tượng (OOP)</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layers class="w-6 h-6 text-brand-600" /> Thiết Kế Class & Phân Tách Trách Nhiệm
          </h2>
        </div>
        <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          Tuân thủ Clean OOP & Single Responsibility
        </span>
      </div>

      <p class="text-sm text-slate-600 mb-6 leading-relaxed">
        Theo đúng lưu ý của đề bài cuối kỳ: <em>"Code phải chia ra class theo OOP và các chức năng chính không được gộp thành 1 class. Đảm bảo kiến trúc rõ ràng rành mạch. Thêm UML của từng class và gọi theo cách nào."</em> Toàn bộ nghiệp vụ được chia nhỏ thành 8 Class độc lập:
      </p>

      <!-- Danh sách 8 Class OOP -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class ProductVariant</div>
          <p class="text-xs text-slate-500 mt-1">Quản lý SKU, màu sắc, size, giá chênh lệch, tồn kho và hàm kiểm tra tồn kho <code>isAvailable()</code>.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class Product</div>
          <p class="text-xs text-slate-500 mt-1">Thực thể sản phẩm chứa danh sách biến thể, hàm tính giá theo biến thể <code>getPriceForVariant()</code> và <code>isInStock()</code>.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class CartItem</div>
          <p class="text-xs text-slate-500 mt-1">Đại diện cho 1 dòng giỏ hàng (Product + Variant + Quantity), tính đơn giá và thành tiền <code>getSubtotal()</code>.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class DiscountPolicy</div>
          <p class="text-xs text-slate-500 mt-1">Áp dụng Strategy Pattern để tính chiết khấu theo % hoặc số tiền cố định <code>calculateDiscount()</code>.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class ShoppingCart</div>
          <p class="text-xs text-slate-500 mt-1">Quản lý mảng CartItem, tính tổng số lượng, tổng tiền hàng gốc, tiền giảm giá và tổng thanh toán.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class StorageService</div>
          <p class="text-xs text-slate-500 mt-1">Class chuyên biệt tĩnh phụ trách lưu trữ / khôi phục dữ liệu Giỏ hàng, Đơn hàng và Lịch sử chat LocalStorage.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class Order</div>
          <p class="text-xs text-slate-500 mt-1">Thực thể Đơn hàng, Factory Method <code>createFromCart()</code> chuyển hóa từ giỏ hàng sang hóa đơn hoàn chỉnh.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div class="font-mono text-xs font-bold text-brand-600">class AIService</div>
          <p class="text-xs text-slate-500 mt-1">Kết nối Gemini API, quản lý prompt tư vấn phối đồ và hỗ trợ Smart Mock phản hồi tức thì.</p>
        </div>
      </div>

      <!-- BẢNG HƯỚNG DẪN CÁCH GỌI CÁC CLASS (CALL PATTERN) -->
      <h3 class="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
        <Code2 class="w-4 h-4 text-brand-600" /> Bảng Chỉ Dẫn Phương Thức Triệu Gọi (Call Pattern)
      </h3>
      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-100 text-slate-900 font-bold uppercase text-[11px]">
            <tr>
              <th class="p-3">Class</th>
              <th class="p-3">Vị trí khởi tạo & Được gọi từ đâu</th>
              <th class="p-3">Phương thức tiêu biểu</th>
              <th class="p-3">Mục đích sử dụng</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">ProductVariant</td>
              <td class="p-3">Được khởi tạo bên trong constructor của <code>Product</code></td>
              <td class="p-3 font-mono">variant.isAvailable(qty)</td>
              <td class="p-3">Kiểm tra số lượng kho của từng màu/size</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">Product</td>
              <td class="p-3"><code>productStore.js</code> chuyển đổi từ mock JSON</td>
              <td class="p-3 font-mono">product.getPriceForVariant(sku)</td>
              <td class="p-3">Tính giá bán thực tế theo biến thể chọn</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">CartItem</td>
              <td class="p-3"><code>ShoppingCart.addItem()</code> tạo mới khi thêm hàng</td>
              <td class="p-3 font-mono">item.getSubtotal()</td>
              <td class="p-3">Thành tiền = đơn giá biến thể x số lượng</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">DiscountPolicy</td>
              <td class="p-3"><code>DiscountPolicy.getPredefinedCoupons()</code></td>
              <td class="p-3 font-mono">policy.calculateDiscount(total)</td>
              <td class="p-3">Tính toán tiền giảm giá dựa theo giá trị đơn</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">ShoppingCart</td>
              <td class="p-3">Bọc bên trong <code>cartStore.js</code></td>
              <td class="p-3 font-mono">cart.getFinalTotalPrice()</td>
              <td class="p-3">Tổng thanh toán sau khi trừ khuyến mãi</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">Order</td>
              <td class="p-3">Gọi tại <code>CheckoutView.vue</code> khi bấm Đặt hàng</td>
              <td class="p-3 font-mono">Order.createFromCart(cart, info)</td>
              <td class="p-3">Đóng gói thông tin đơn hàng và hóa đơn</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-700">AIService</td>
              <td class="p-3">Khởi tạo bên trong <code>aiStore.js</code></td>
              <td class="p-3 font-mono">aiService.sendMessage(prompt, catalog)</td>
              <td class="p-3">Gửi prompt tư vấn thời trang tới Gemini API</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. QUY TRÌNH CI/CD GITHUB ACTIONS -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
      <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
        <GitBranch class="w-5 h-5 text-brand-600" /> Luồng DevOps CI/CD với GitHub Actions
      </h2>
      <p class="text-sm text-slate-600 mb-6 leading-relaxed">
        Dự án thiết lập tự động hóa quy trình Build và Deploy trong file <code>.github/workflows/deploy.yml</code>. 
        Mỗi khi lập trình viên thực hiện lệnh <code>git push</code> lên nhánh <code>main</code>, GitHub Actions Runner sẽ tự động kích hoạt:
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center mx-auto mb-2 text-xs">1</div>
          <h4 class="font-bold text-slate-800 text-xs">Checkout Code</h4>
          <p class="text-[11px] text-slate-500 mt-1">Lấy mã nguồn mới nhất từ kho GitHub</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center mx-auto mb-2 text-xs">2</div>
          <h4 class="font-bold text-slate-800 text-xs">Setup Node.js 18</h4>
          <p class="text-[11px] text-slate-500 mt-1">Cài đặt môi trường runtime Node tiêu chuẩn</p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center mx-auto mb-2 text-xs">3</div>
          <h4 class="font-bold text-slate-800 text-xs">Build Vite App</h4>
          <p class="text-[11px] text-slate-500 mt-1">Chạy <code>npm run build</code> đóng gói ra thư mục <code>dist/</code></p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center mx-auto mb-2 text-xs">4</div>
          <h4 class="font-bold text-slate-800 text-xs">Deploy Production</h4>
          <p class="text-[11px] text-slate-500 mt-1">Triển khai tức thì lên hosting Vercel / Netlify</p>
        </div>
      </div>
    </div>

  </div>
</template>
