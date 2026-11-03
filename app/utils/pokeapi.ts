import type { Pokemon } from './wishlist'

interface PokeApiResponse {
  id: number
  name: string
  sprites: { front_default: string | null }
}

export class PokemonNotFoundError extends Error {
  constructor(name: string) {
    super(`Pokémon « ${name} » introuvable`)
    this.name = 'PokemonNotFoundError'
  }
}

export async function fetchPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
  )
  if (response.status === 404) throw new PokemonNotFoundError(name)
  if (!response.ok) throw new Error(`Erreur PokéAPI (${response.status})`)

  const data = (await response.json()) as PokeApiResponse
  return { id: data.id, name: data.name, sprite: data.sprites.front_default }
}
