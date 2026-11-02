export interface WishPokemon {
  id: number
  name: string
  sprite: string | null
}

export function addPokemon(list: WishPokemon[], pokemon: WishPokemon): WishPokemon[] {
  if (list.some(p => p.id === pokemon.id)) return list
  return [...list, pokemon]
}

export function removePokemon(list: WishPokemon[], id: number): WishPokemon[] {
  return list.filter(p => p.id !== id)
}