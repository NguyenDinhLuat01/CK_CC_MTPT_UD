import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Product } from '../src/models/Product.js'
import { ProductVariant } from '../src/models/ProductVariant.js'
import { ShoppingCart } from '../src/models/ShoppingCart.js'
import { StorageService } from '../src/models/StorageService.js'
import { useCartStore } from '../src/stores/cartStore.js'

const createInventory = (stockQuantity = 3) => {
  const product = new Product({
    id: 'prod-1',
    name: 'Túi Xách Da Minimalist Cao Cấp',
    basePrice: 850000,
    variants: []
  })
  const variant = new ProductVariant({
    sku: 'TX-DEN-M',
    color: 'Đen Classic',
    size: 'Size M',
    stockQuantity
  })
  return { product, variant }
}

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(StorageService, 'saveCart').mockImplementation(() => {})
  })

  it('adds products, updates quantities, calculates totals, and removes items', () => {
    const store = useCartStore()
    const { product, variant } = createInventory()

    expect(store.addToCart(product, variant, 1)).toBe(true)
    const itemKey = store.items[0].getItemKey()
    store.updateQuantity(itemKey, 2)

    expect(store.totalItems).toBe(2)
    expect(store.rawTotalPrice).toBe(1700000)
    expect(store.finalTotalPrice).toBe(1700000)

    store.updateQuantity(itemKey, 1)
    expect(store.totalItems).toBe(1)
    store.removeFromCart(itemKey)
    expect(store.items).toEqual([])
    expect(store.totalItems).toBe(0)
    expect(StorageService.saveCart).toHaveBeenCalled()
  })

  it('keeps empty carts at zero and ignores invalid product arguments', () => {
    const store = useCartStore()
    const { variant } = createInventory()

    expect(store.items).toEqual([])
    expect(store.totalItems).toBe(0)
    expect(store.rawTotalPrice).toBe(0)
    expect(store.addToCart(null, variant)).toBe(false)
    expect(store.items).toEqual([])
    expect(StorageService.saveCart).not.toHaveBeenCalled()
  })

  it('does not allow a new cart line to exceed available stock', () => {
    const store = useCartStore()
    const { product, variant } = createInventory(2)

    expect(store.addToCart(product, variant, 3)).toBe(false)
    expect(store.items).toEqual([])
  })

  it('checks cumulative stock when adding another quantity to an existing cart line', () => {
    const store = useCartStore()
    const { product, variant } = createInventory(3)

    expect(store.addToCart(product, variant, 2)).toBe(true)
    expect(store.addToCart(product, variant, 2)).toBe(false)
    expect(store.totalItems).toBe(2)
    expect(store.items[0].quantity).toBe(2)
    expect(store.addToCart(product, variant, 1)).toBe(true)
    expect(store.items[0].quantity).toBe(3)
  })

  it('restores persisted cart snapshots and respects the inventory boundary', () => {
    const original = new ShoppingCart()
    const { product, variant } = createInventory(4)
    original.addItem(product, variant, 2)
    vi.spyOn(StorageService, 'loadCart').mockReturnValue(original.toJSON())
    const store = useCartStore()

    store.initFromStorage()

    expect(store.totalItems).toBe(2)
    expect(store.items[0].product.name).toBe('Túi Xách Da Minimalist Cao Cấp')
    expect(store.items[0].variant.stockQuantity).toBe(4)
  })
})
