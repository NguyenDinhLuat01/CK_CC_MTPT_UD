import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Product } from '../src/models/Product.js'
import { useProductStore } from '../src/stores/productStore.js'

const catalog = [
  {
    id: 'prod-1',
    name: 'Túi Xách Da Minimalist Cao Cấp',
    category: 'Túi Xách',
    description: 'Túi xách da PU cao cấp phong cách tối giản.',
    basePrice: 850000,
    variants: []
  },
  {
    id: 'prod-2',
    name: 'Kính Mát Chống Tia UV Polarized Retro',
    category: 'Kính Mát',
    description: 'Tròng phân cực Polarized UV400 bảo vệ mắt.',
    basePrice: 450000,
    variants: []
  }
]

describe('product store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads the catalog as Product instances and avoids duplicate fetches', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(catalog)
    })
    vi.stubGlobal('fetch', fetchMock)
    const store = useProductStore()

    await store.fetchProducts()
    await store.fetchProducts()

    expect(store.products).toHaveLength(2)
    expect(store.products[0]).toBeInstanceOf(Product)
    expect(store.getProductById('prod-2').name).toBe('Kính Mát Chống Tia UV Polarized Retro')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('searches by name, description, or category and combines category filtering', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(catalog)
    }))
    const store = useProductStore()
    await store.fetchProducts()

    store.searchQuery = '  DA PU '
    expect(store.filteredProducts.map(product => product.id)).toEqual(['prod-1'])

    store.searchQuery = 'polarized'
    store.selectedCategory = 'Kính Mát'
    expect(store.filteredProducts.map(product => product.id)).toEqual(['prod-2'])

    store.searchQuery = 'no matching product'
    expect(store.filteredProducts).toEqual([])
  })

  it('represents an empty catalog without fabricating categories or results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([])
    }))
    const store = useProductStore()
    await store.fetchProducts()

    expect(store.products).toEqual([])
    expect(store.categories).toEqual(['Tất cả'])
    expect(store.filteredProducts).toEqual([])
    expect(store.getProductById('missing')).toBeUndefined()
  })

  it('reports HTTP, network, and malformed payload errors and clears loading state', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useProductStore()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

    await store.fetchProducts()
    expect(store.error).toContain('503')
    expect(store.loading).toBe(false)

    store.error = null
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await store.fetchProducts()
    expect(store.error).toBe('offline')
    expect(store.loading).toBe(false)

    store.error = null
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ invalid: true })
    }))
    await store.fetchProducts()
    expect(store.error).toContain('map')
    expect(store.loading).toBe(false)
    expect(consoleError).toHaveBeenCalled()
  })
})
