import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { Product } from '../src/models/Product.js'
import ProductDetailView from '../src/views/ProductDetailView.vue'
import { useCartStore } from '../src/stores/cartStore.js'
import { useProductStore } from '../src/stores/productStore.js'

const createProduct = () => new Product({
  id: 'prod-1',
  name: 'Túi Xách Da Minimalist Cao Cấp',
  category: 'Túi Xách',
  basePrice: 850000,
  images: ['handbag.jpg'],
  variants: [
    { sku: 'TX-DEN-M', color: 'Đen Classic', size: 'Size M', stockQuantity: 2 },
    { sku: 'TX-KEM-M', color: 'Kem Sữa', size: 'Size M', stockQuantity: 0 }
  ]
})

describe('ProductDetailView', () => {
  let wrapper
  let router
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    useProductStore().products = [createProduct()]
    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/product/:id', component: ProductDetailView }]
    })
    await router.push('/product/prod-1')
    await router.isReady()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  const mountView = () => {
    wrapper = mount(ProductDetailView, {
      global: {
        plugins: [pinia, router],
        stubs: { RouterLink: RouterLinkStub, transition: true }
      }
    })
    return wrapper
  }

  it('shows product details and adds the selected in-stock variant to the cart', async () => {
    const view = mountView()

    expect(view.text()).toContain('Túi Xách Da Minimalist Cao Cấp')
    expect(view.text()).toContain('Sẵn sàng giao ngay (Kho: 2)')
    const addButton = view.findAll('button').find(button => button.text().includes('Thêm Vào Giỏ Hàng'))
    await addButton.trigger('click')

    expect(useCartStore().totalItems).toBe(1)
    expect(view.text()).toContain('Đã thêm 1x')
  })

  it('shows a not-found state for a product ID absent from the catalog', async () => {
    await router.replace('/product/missing')
    const view = mountView()

    expect(view.text()).toContain('Không tìm thấy sản phẩm')
    expect(view.text()).not.toContain('Thêm Vào Giỏ Hàng')
  })

  it('disables adding a variant with no stock', async () => {
    const view = mountView()
    const soldOutVariant = view.findAll('button').find(button => button.text().includes('Kem Sữa'))
    await soldOutVariant.trigger('click')

    const addButton = view.findAll('button').find(button => button.text().includes('Thêm Vào Giỏ Hàng'))
    expect(addButton.attributes('disabled')).toBeDefined()
    expect(useCartStore().totalItems).toBe(0)
  })
})
