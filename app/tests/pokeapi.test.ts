import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchPokemon, PokemonNotFoundError } from '../utils/pokeapi'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchPokemon', () => {
  it('retourne le Pokémon sur une réponse 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 25,
          name: 'pikachu',
          sprites: { front_default: 'https://exemple.test/pikachu.png' },
        }),
        { status: 200 },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const pokemon = await fetchPokemon('pikachu')

    expect(pokemon).toEqual({
      id: 25,
      name: 'pikachu',
      sprite: 'https://exemple.test/pikachu.png',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
    )
  })

  it('lève PokemonNotFoundError sur une réponse 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Not Found', { status: 404 })),
    )

    await expect(fetchPokemon('inexistant')).rejects.toBeInstanceOf(
      PokemonNotFoundError,
    )
  })

  it('lève une erreur sur une réponse 500', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Oups', { status: 500 })),
    )

    await expect(fetchPokemon('pikachu')).rejects.toThrow('500')
  })
})
