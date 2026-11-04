import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadWishlist, saveWishlist, STORAGE_KEY } from '../utils/storage'
import type { WishlistItem } from '../utils/wishlist'

const item: WishlistItem = {
  id: 25,
  name: 'pikachu',
  sprite: null,
  addedAt: 0,
}

let store: Record<string, string>

beforeEach(() => {
  store = {}
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('saveWishlist', () => {
  it('sauvegarde la liste en JSON', () => {
    saveWishlist([item])
    expect(store[STORAGE_KEY]).toBe(JSON.stringify([item]))
  })
})

describe('loadWishlist', () => {
  it('relit la liste sauvegardée', () => {
    saveWishlist([item])
    expect(loadWishlist()).toEqual([item])
  })

  it('renvoie une liste vide si le stockage est vide', () => {
    expect(loadWishlist()).toEqual([])
  })

  it('renvoie une liste vide si le JSON est invalide', () => {
    store[STORAGE_KEY] = "{ceci n'est pas du json"
    expect(loadWishlist()).toEqual([])
  })

  it("renvoie une liste vide si le JSON n'est pas un tableau", () => {
    store[STORAGE_KEY] = '{"a":1}'
    expect(loadWishlist()).toEqual([])
  })

  it('renvoie true quand la sauvegarde réussit', () => {
    expect(saveWishlist([item])).toBe(true)
  })

  it('renvoie false si le stockage échoue', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota dépassé')
      },
    })
    expect(saveWishlist([item])).toBe(false)
  })
})
