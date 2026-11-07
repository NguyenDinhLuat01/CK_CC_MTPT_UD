import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Product } from '@/models/Product.js';

/**
 * Pinia Store quản lý Danh mục Sản phẩm Thời trang & Phụ kiện
 * Lưu trữ danh sách các instance Product theo chuẩn OOP
 */
export const useProductStore = defineStore('product', () => {
  /** @type {import('vue').Ref<Product[]>} */
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedCategory = ref('Tất cả');
  const searchQuery = ref('');

  /**
   * Tải danh sách sản phẩm từ mock-products.json và chuyển hóa thành các OOP Product instances
   */
  const fetchProducts = async () => {
    if (products.value.length > 0) return; // Tránh fetch lại nhiều lần
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/mock-products.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      
      // Chuyển đổi dữ liệu JSON thành các đối tượng OOP Product
      products.value = rawData.map(item => new Product(item));
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm:', err);
      error.value = err.message || 'Không thể tải danh sách sản phẩm';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Tìm sản phẩm theo ID
   * @param {string} id
   * @returns {Product | undefined}
   */
  const getProductById = (id) => {
    return products.value.find(p => p.id === id);
  };

  /**
   * Danh sách các danh mục phân loại duy nhất
   */
  const categories = computed(() => {
    const set = new Set(products.value.map(p => p.category));
    return ['Tất cả', ...Array.from(set)];
  });

  /**
   * Danh sách sản phẩm sau khi lọc theo danh mục và tìm kiếm từ khóa
   */
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const matchesCategory =
        selectedCategory.value === 'Tất cả' || product.category === selectedCategory.value;
      
      const q = searchQuery.value.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  });

  return {
    products,
    loading,
    error,
    selectedCategory,
    searchQuery,
    categories,
    filteredProducts,
    fetchProducts,
    getProductById
  };
});
