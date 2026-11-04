import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  ApiError,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../utils/wishlistApi'

const BASE = 'http://api.test'
const pikachu = { id: 25, name: 'pikachu', sprite: null }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getWishlist', () => {
  it('renvoie la liste sur un 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json([]))
    vi.stubGlobal('fetch', fetchMock)
    expect(await getWishlist(BASE)).toEqual([])
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/wishlist`, undefined)
  })
})

describe('addToWishlist', () => {
  it('envoie un POST et renvoie le Pokémon créé (201)', async () => {
    const created = { ...pikachu, addedAt: 1 }
    const fetchMock = vi.fn().mockResolvedValue(json(created, 201))
    vi.stubGlobal('fetch', fetchMock)

    expect(await addToWishlist(BASE, pikachu)).toEqual(created)
    expect(fetchMock.mock.calls[0]![1].method).toBe('POST')
  })

  it("lève ApiError avec le message de l'API sur un 409", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json({ error: 'Wishlist pleine' }, 409)),
    )
    await expect(addToWishlist(BASE, pikachu)).rejects.toMatchObject({
      name: 'ApiError',
      status: 409,
      message: 'Wishlist pleine',
    })
  })
})

describe('removeFromWishlist', () => {
  it('envoie un DELETE', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ deleted: 25 }))
    vi.stubGlobal('fetch', fetchMock)
    await removeFromWishlist(BASE, 25)
    expect(fetchMock.mock.calls[0]![0]).toBe(`${BASE}/wishlist/25`)
    expect(fetchMock.mock.calls[0]![1].method).toBe('DELETE')
  })

  it('lève ApiError sur un 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json({ error: 'Pokémon introuvable' }, 404)),
    )
    await expect(removeFromWishlist(BASE, 999)).rejects.toBeInstanceOf(ApiError)
  })
})
