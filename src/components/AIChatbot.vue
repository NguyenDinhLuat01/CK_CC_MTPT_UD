<script setup>
import { ref, nextTick, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAIStore } from '@/stores/aiStore.js';
import { useProductStore } from '@/stores/productStore.js';
import { 
  Sparkles, X, Send, Bot, User, Trash2, Key, HelpCircle, 
  ShoppingBag, ShieldCheck, Truck, ChevronDown, Check
} from 'lucide-vue-next';

const aiStore = useAIStore();
const productStore = useProductStore();

const { isOpen, isLoading, messages, apiKey } = storeToRefs(aiStore);
const { products } = storeToRefs(productStore);

// State cục bộ cho input câu hỏi (dùng v-model.trim)
const inputQuery = ref('');
const showKeyModal = ref(false);
const tempApiKey = ref(apiKey.value);
const messagesContainerRef = ref(null);

// Gợi ý câu hỏi nhanh
const quickPrompts = [
  'Gợi ý set phụ kiện đi làm công sở',
  'Túi xách đen có những size nào?',
  'Kính mát chống nắng đi biển loại nào tốt?',
  'Chính sách đổi trả và freeship?'
];

// Tự động cuộn xuống đáy khi có tin nhắn mới
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
  }
};

watch(() => messages.value.length, () => {
  scrollToBottom();
});

watch(isOpen, (newVal) => {
  if (newVal) {
    scrollToBottom();
  }
});

// Xử lý gửi tin nhắn
const handleSendMessage = () => {
  if (!inputQuery.value || isLoading.value) return;
  const text = inputQuery.value;
  inputQuery.value = '';
  aiStore.sendMessage(text, products.value);
};

// Chọn câu hỏi nhanh
const selectQuickPrompt = (promptText) => {
  inputQuery.value = promptText;
  handleSendMessage();
};

// Lưu API Key
const saveApiKey = () => {
  aiStore.updateApiKey(tempApiKey.value);
  showKeyModal.value = false;
};

onMounted(() => {
  aiStore.initAI();
  tempApiKey.value = apiKey.value;
});
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Nút tròn nổi mở Chatbot (Floating Button) -->
    <transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="scale-0 opacity-0"
      enter-to-class="scale-100 opacity-100"
    >
      <button
        v-if="!isOpen"
        @click="aiStore.toggleChat"
        class="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-brand-700 via-brand-600 to-rose-500 text-white rounded-full shadow-2xl shadow-brand-600/40 hover:shadow-brand-600/60 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
        </span>
        <Sparkles class="w-5 h-5 text-amber-200 animate-spin-slow" />
        <span class="font-bold text-sm tracking-wide">Tư vấn AI</span>
      </button>
    </transition>

    <!-- Khung Cửa sổ Chatbot (Chat Window) -->
    <transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="scale-90 opacity-0 translate-y-6"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-90 opacity-0 translate-y-6"
    >
      <div 
        v-if="isOpen" 
        class="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden backdrop-blur-xl"
      >
        <!-- Header Cửa sổ Chat -->
        <div class="p-4 bg-gradient-to-r from-brand-800 to-brand-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Bot class="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-bold text-sm sm:text-base leading-none">LuxeStylist AI</h3>
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p class="text-[11px] text-brand-100 mt-1 font-medium">Trợ lý thời trang & Phụ kiện cao cấp</p>
            </div>
          </div>

          <!-- Các nút tùy chọn góc trên -->
          <div class="flex items-center gap-1">
            <button 
              @click="showKeyModal = !showKeyModal" 
              class="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Cài đặt Gemini API Key"
            >
              <Key class="w-4 h-4" />
            </button>
            <button 
              @click="aiStore.clearMessages" 
              class="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Làm mới cuộc trò chuyện"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <button 
              @click="aiStore.toggleChat" 
              class="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Đóng cửa sổ"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Hộp Modal cấu hình Gemini API Key -->
        <div v-if="showKeyModal" class="p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div class="flex items-center justify-between font-bold text-slate-700 mb-1">
            <span>Cấu hình Google Gemini API Key</span>
            <button @click="showKeyModal = false" class="text-slate-400 hover:text-slate-600">Đóng</button>
          </div>
          <p class="text-slate-500 mb-2">Nhập API Key để chat với Gemini AI trực tiếp. Nếu để trống, hệ thống tự động kích hoạt **Smart AI Advisor**.</p>
          <div class="flex gap-2">
            <input 
              v-model.trim="tempApiKey" 
              type="password" 
              placeholder="Dán AIzaSy..." 
              class="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
            />
            <button 
              @click="saveApiKey" 
              class="px-3 py-1.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>

        <!-- Danh sách tin nhắn hội thoại (v-for với :key) -->
        <div ref="messagesContainerRef" class="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="flex items-start gap-2.5"
            :class="msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'"
          >
            <!-- Avatar -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
              :class="msg.sender === 'user' ? 'bg-slate-700 text-white' : 'bg-brand-600 text-white'"
            >
              <User v-if="msg.sender === 'user'" class="w-4 h-4" />
              <Bot v-else class="w-4 h-4 text-amber-200" />
            </div>

            <!-- Bubble nội dung -->
            <div 
              class="max-w-[78%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm leading-relaxed"
              :class="msg.sender === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-line'"
            >
              {{ msg.text }}
              <div 
                class="text-[10px] mt-1 text-right"
                :class="msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'"
              >
                {{ msg.timestamp }}
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="flex items-center gap-2 text-slate-400 text-xs italic py-1 pl-2">
            <span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
            LuxeStylist đang soạn câu trả lời...
          </div>
        </div>

        <!-- Gợi ý câu hỏi nhanh (Quick Chips) -->
        <div class="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button 
            v-for="(chip, idx) in quickPrompts" 
            :key="idx" 
            @click="selectQuickPrompt(chip)"
            class="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 border border-slate-200/60 transition-colors shrink-0"
          >
            {{ chip }}
          </button>
        </div>

        <!-- Khung nhập tin nhắn (v-model.trim) -->
        <div class="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0">
          <input 
            v-model.trim="inputQuery" 
            @keyup.enter="handleSendMessage"
            type="text" 
            placeholder="Hỏi về cách phối đồ, kính mát, túi xách..."
            :disabled="isLoading"
            class="flex-1 bg-slate-100 text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-transparent focus:border-brand-500 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
          />
          <button 
            @click="handleSendMessage" 
            :disabled="!inputQuery || isLoading"
            class="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all shadow-md shadow-brand-600/20 disabled:shadow-none"
            title="Gửi"
          >
            <Send class="w-4 h-4" />
          </button>
        </div>

      </div>
    </transition>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
