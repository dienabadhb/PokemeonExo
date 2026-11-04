import { test, expect, type Page } from '@playwright/test'

const API = 'http://localhost:3001'

test.beforeEach(async ({ page, request }) => {
  const res = await request.get(`${API}/wishlist`)
  const items = (await res.json()) as { id: number }[]
  for (const item of items) {
    await request.delete(`${API}/wishlist/${item.id}`)
  }

  await page.goto('/')
  await expect(page.getByText("Aucun Pokémon pour l'instant.")).toBeVisible()
})

async function addPokemon(page: Page, name: string) {
  await page.getByPlaceholder('Rechercher (ex : pikachu)').fill(name)
  await page.getByRole('button', { name: 'Rechercher' }).click()
  await page.getByRole('button', { name: 'Ajouter à la wishlist' }).click()
}

async function addAndWait(page: Page, name: string) {
  await addPokemon(page, name)
  await expect(page.locator('li', { hasText: name })).toBeVisible()
}

test('ajoute un Pokémon, visible via l’API', async ({ page, request }) => {
  await addAndWait(page, 'pikachu')
  await expect(
    page.getByRole('heading', { name: 'Ma wishlist (1/6)' }),
  ).toBeVisible()

  const res = await request.get(`${API}/wishlist`)
  const items = (await res.json()) as { name: string }[]
  expect(items.map((p) => p.name)).toEqual(['pikachu'])
})

test('refuse un doublon', async ({ page }) => {
  await addAndWait(page, 'pikachu')
  await addPokemon(page, 'pikachu')

  await expect(page.getByText('Pokémon déjà dans la wishlist')).toBeVisible()
  await expect(page.locator('li')).toHaveCount(1)
})

test('refuse un 7e Pokémon (limite de 6)', async ({ page }) => {
  const names = [
    'pikachu',
    'bulbasaur',
    'charmander',
    'squirtle',
    'pidgey',
    'rattata',
  ]
  for (const name of names) await addAndWait(page, name)

  await expect(
    page.getByRole('heading', { name: 'Ma wishlist (6/6)' }),
  ).toBeVisible()

  await addPokemon(page, 'mew')
  await expect(page.getByText('Wishlist pleine')).toBeVisible()
  await expect(page.locator('li')).toHaveCount(6)
})

test('supprime un Pokémon', async ({ page, request }) => {
  await addAndWait(page, 'pikachu')

  await page
    .locator('li', { hasText: 'pikachu' })
    .getByRole('button', { name: 'Supprimer' })
    .click()

  await expect(page.locator('li')).toHaveCount(0)
  await expect(page.getByText("Aucun Pokémon pour l'instant.")).toBeVisible()

  const res = await request.get(`${API}/wishlist`)
  expect(await res.json()).toEqual([])
})
