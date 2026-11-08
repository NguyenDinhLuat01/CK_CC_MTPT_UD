import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { Product } from '../src/models/Product.js'
import ProductCard from '../src/components/ProductCard.vue'

describe('ProductCard', () => {
  it('displays the product information and links to its detail page', () => {
    const product = new Product({
      id: 'prod-1',
      name: 'Túi Xách Da Minimalist Cao Cấp',
      category: 'Túi Xách',
      basePrice: 850000,
      images: ['handbag.jpg'],
      variants: [{ sku: 'TX-DEN-M', color: 'Đen Classic', size: 'Size M', stockQuantity: 2 }]
    })
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })

    expect(wrapper.text()).toContain('Túi Xách Da Minimalist Cao Cấp')
    expect(wrapper.text()).toContain('Túi Xách')
    expect(wrapper.text()).toContain('850.000')
    expect(wrapper.find('img').attributes('src')).toBe('handbag.jpg')
    expect(wrapper.findAllComponents(RouterLinkStub).every(link => link.props('to') === '/product/prod-1')).toBe(true)
  })

  it('handles an empty product with the existing placeholder and sold-out state', () => {
    const product = new Product({
      id: 'empty-product',
      name: 'Unavailable Accessory',
      basePrice: 0
    })
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })

    expect(wrapper.text()).toContain('Hết hàng')
    expect(wrapper.find('img').attributes('src')).toContain('No+Image')
  })
})
