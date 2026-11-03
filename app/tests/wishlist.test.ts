import { describe, it, expect } from 'vitest'
import { addPokemon, removePokemon } from '../utils/wishlist'

const pikachu = { id: 25, name: 'pikachu', sprite: null }
const mew = { id: 151, name: 'mew', sprite: null }

describe('wishlist', () => {
  it('ajoute un Pokémon', () => {
    expect(addPokemon([], pikachu)).toEqual([pikachu])
  })

  it('refuse les doublons', () => {
    expect(addPokemon([pikachu], pikachu)).toEqual([pikachu])
  })

  it('supprime un Pokémon', () => {
    expect(removePokemon([pikachu, mew], 151)).toEqual([pikachu])
  })
})
