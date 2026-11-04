<script setup lang="ts">
import type { Pokemon, WishlistItem } from './utils/wishlist'

const apiBase = useRuntimeConfig().public.apiBase

const query = ref('')
const found = ref<Pokemon | null>(null)
const error = ref('')
const message = ref('')
const loading = ref(false)
const list = ref<WishlistItem[]>([])
const loaded = ref(false)

const API_DOWN = "L'API est injoignable. Est-elle démarrée ?"

onMounted(async () => {
  try {
    list.value = await getWishlist(apiBase)
  } catch {
    message.value = API_DOWN
  }
  loaded.value = true
})

async function search() {
  error.value = ''
  message.value = ''
  found.value = null
  const q = query.value.trim().toLowerCase()
  if (!q) return

  loading.value = true
  try {
    found.value = await fetchPokemon(q)
  } catch (e) {
    error.value =
      e instanceof PokemonNotFoundError
        ? `Pokémon « ${query.value} » introuvable (utilise le nom anglais : pikachu, charmander...)`
        : 'Erreur de connexion à PokéAPI, réessaie plus tard.'
  } finally {
    loading.value = false
  }
}

async function add() {
  if (!found.value) return
  message.value = ''
  try {
    const item = await addToWishlist(apiBase, found.value)
    list.value = [...list.value, item]
    found.value = null
    query.value = ''
  } catch (e) {
    message.value = e instanceof ApiError ? e.message : API_DOWN
  }
}

async function remove(id: number) {
  message.value = ''
  try {
    await removeFromWishlist(apiBase, id)
    list.value = list.value.filter((p) => p.id !== id)
  } catch (e) {
    message.value = e instanceof ApiError ? e.message : API_DOWN
  }
}
</script>

<template>
  <main>
    <h1>PokéWishlist</h1>

    <form @submit.prevent="search">
      <input v-model="query" placeholder="Rechercher (ex : pikachu)" />
      <button type="submit" :disabled="loading">Rechercher</button>
    </form>

    <p v-if="loading">Recherche...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="found">
      <img v-if="found.sprite" :src="found.sprite" :alt="found.name" />
      <strong>{{ found.name }}</strong>
      <button @click="add">Ajouter à la wishlist</button>
    </div>

    <p v-if="message">{{ message }}</p>

    <h2>Ma wishlist ({{ list.length }}/{{ MAX_WISHLIST_SIZE }})</h2>
    <p v-if="loaded && !list.length">Aucun Pokémon pour l'instant.</p>
    <ul>
      <li v-for="p in list" :key="p.id">
        <img v-if="p.sprite" :src="p.sprite" :alt="p.name" />
        {{ p.name }}
        <button @click="remove(p.id)">Supprimer</button>
      </li>
    </ul>
  </main>
</template>
