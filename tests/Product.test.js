import { describe, expect, it } from 'vitest'
import { Product } from '../src/models/Product.js'
import { ProductVariant } from '../src/models/ProductVariant.js'

const productData = {
  id: 'prod-1',
  name: 'Túi Xách Da Minimalist Cao Cấp',
  category: 'Túi Xách',
  basePrice: 850000,
  images: ['handbag.jpg'],
  variants: [
    { sku: 'TX-DEN-M', color: 'Đen Classic', size: 'Size M', stockQuantity: 3 },
    { sku: 'TX-KEM-M', color: 'Kem Sữa', size: 'Size M', stockQuantity: 0 }
  ]
}

describe('Product and ProductVariant', () => {
  it('creates variants and calculates product pricing and total stock', () => {
    const product = new Product(productData)

    expect(product.getVariant('TX-DEN-M')).toBeInstanceOf(ProductVariant)
    expect(product.getPriceForVariant('TX-DEN-M')).toBe(850000)
    expect(product.getTotalStock()).toBe(3)
    expect(product.getDefaultVariant().sku).toBe('TX-DEN-M')
    expect(product.getPrimaryImage()).toBe('handbag.jpg')
  })

  it('provides safe fallbacks for products without images or variants', () => {
    const product = new Product({
      id: 'empty-shoe',
      name: 'No variants',
      basePrice: 0,
      images: []
    })

    expect(product.getPrimaryImage()).toContain('No+Image')
    expect(product.getDefaultVariant()).toBeNull()
    expect(product.getTotalStock()).toBe(0)
    expect(product.isInStock('missing-sku')).toBe(false)
  })

  it('checks requested inventory at the exact stock boundary', () => {
    const product = new Product(productData)

    expect(product.isInStock('TX-DEN-M', 3)).toBe(true)
    expect(product.isInStock('TX-DEN-M', 4)).toBe(false)
    expect(product.isInStock('TX-KEM-M')).toBe(false)
    expect(product.getVariant('unknown')).toBeNull()
  })

  it('rejects zero or negative requested quantities', () => {
    const variant = new ProductVariant({
      sku: 'TX-DEN-M',
      color: 'Đen Classic',
      size: 'Size M',
      stockQuantity: 3
    })

    expect(variant.isAvailable(0)).toBe(false)
    expect(variant.isAvailable(-1)).toBe(false)
  })
})
