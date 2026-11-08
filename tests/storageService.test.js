import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StorageService } from '../src/models/StorageService.js'

describe('StorageService cart persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips saved cart items through localStorage', () => {
    const items = [{ productId: 'shoe-1', quantity: 2 }]

    StorageService.saveCart(items)

    expect(StorageService.loadCart()).toEqual(items)
    expect(localStorage.getItem(StorageService.CART_STORAGE_KEY)).toBe(JSON.stringify(items))
  })

  it('returns an empty cart for missing or malformed stored data', () => {
    expect(StorageService.loadCart()).toEqual([])
    localStorage.setItem(StorageService.CART_STORAGE_KEY, '{not json')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(StorageService.loadCart()).toEqual([])
    expect(consoleError).toHaveBeenCalled()
  })

  it('handles localStorage write failures without throwing', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const storageWrite = vi.fn(() => {
      throw new Error('quota exceeded')
    })
    vi.stubGlobal('localStorage', {
      setItem: storageWrite,
      getItem: vi.fn(),
      removeItem: vi.fn()
    })

    expect(() => StorageService.saveCart([])).not.toThrow()
    expect(consoleError).toHaveBeenCalledWith(
      'StorageService.saveCart Error:',
      expect.objectContaining({ message: 'quota exceeded' })
    )
    expect(storageWrite).toHaveBeenCalled()
  })
})
