export const MAX_WISHLIST_SIZE = 6;

export interface Pokemon {
  id: number;
  name: string;
  sprite: string | null;
}

export interface WishlistItem extends Pokemon {
  addedAt: number;
}

export type AddStatus = "added" | "duplicate" | "full";

export interface AddResult {
  list: WishlistItem[];
  status: AddStatus;
}

export function addPokemon(
  list: WishlistItem[],
  pokemon: Pokemon,
  now: number = Date.now(),
): AddResult {
  if (list.some((p) => p.id === pokemon.id)) {
    return { list, status: "duplicate" };
  }
  if (list.length >= MAX_WISHLIST_SIZE) {
    return { list, status: "full" };
  }
  return { list: [...list, { ...pokemon, addedAt: now }], status: "added" };
}

export function removePokemon(
  list: WishlistItem[],
  id: number,
): WishlistItem[] {
  return list.filter((p) => p.id !== id);
}
