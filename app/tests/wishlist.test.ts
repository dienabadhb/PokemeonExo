import { describe, it, expect } from "vitest";
import {
  addPokemon,
  removePokemon,
  MAX_WISHLIST_SIZE,
  type Pokemon,
  type WishlistItem,
} from "../utils/wishlist";

const makePokemon = (id: number): Pokemon => ({
  id,
  name: `pokemon-${id}`,
  sprite: null,
});

const makeItem = (id: number): WishlistItem => ({
  ...makePokemon(id),
  addedAt: 0,
});

const fullList = (): WishlistItem[] =>
  Array.from({ length: MAX_WISHLIST_SIZE }, (_, i) => makeItem(i + 1));

describe("addPokemon", () => {
  it("ajoute un Pokémon", () => {
    const result = addPokemon([], makePokemon(25), 0);
    expect(result.status).toBe("added");
    expect(result.list).toEqual([makeItem(25)]);
  });

  it("refuse un doublon", () => {
    const list = [makeItem(25)];
    const result = addPokemon(list, makePokemon(25), 0);
    expect(result.status).toBe("duplicate");
    expect(result.list).toHaveLength(1);
  });

  it("accepte le 6e Pokémon", () => {
    const list = fullList().slice(0, MAX_WISHLIST_SIZE - 1);
    const result = addPokemon(list, makePokemon(99), 0);
    expect(result.status).toBe("added");
    expect(result.list).toHaveLength(MAX_WISHLIST_SIZE);
  });

  it("refuse un 7e Pokémon (liste pleine)", () => {
    const result = addPokemon(fullList(), makePokemon(99), 0);
    expect(result.status).toBe("full");
    expect(result.list).toHaveLength(MAX_WISHLIST_SIZE);
  });
});

describe("removePokemon", () => {
  it("supprime un Pokémon", () => {
    const list = [makeItem(25), makeItem(151)];
    expect(removePokemon(list, 151)).toEqual([makeItem(25)]);
  });
});
