import type { Pokemon, WishlistItem } from './wishlist'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    let message = `Erreur API (${response.status})`
    try {
      const data = (await response.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      message = `Erreur API (${response.status})`
    }
    throw new ApiError(response.status, message)
  }
  return (await response.json()) as T
}

export function getWishlist(baseUrl: string): Promise<WishlistItem[]> {
  return request<WishlistItem[]>(`${baseUrl}/wishlist`)
}

export function addToWishlist(
  baseUrl: string,
  pokemon: Pokemon,
): Promise<WishlistItem> {
  return request<WishlistItem>(`${baseUrl}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pokemon),
  })
}

export async function removeFromWishlist(
  baseUrl: string,
  id: number,
): Promise<void> {
  await request<{ deleted: number }>(`${baseUrl}/wishlist/${id}`, {
    method: 'DELETE',
  })
}
