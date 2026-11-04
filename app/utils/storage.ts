import type { WishlistItem } from './wishlist'

export const STORAGE_KEY = 'pokewishlist'

export function saveWishlist(list: WishlistItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? (data as WishlistItem[]) : []
  } catch {
    return []
  }
}
