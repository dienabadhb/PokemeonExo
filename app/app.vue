<script setup lang="ts">
import type { Pokemon, WishlistItem } from './utils/wishlist'

const STORAGE_KEY = 'pokewishlist'

const query = ref('')
const found = ref<Pokemon | null>(null)
const error = ref('')
const message = ref('')
const loading = ref(false)
const list = ref<WishlistItem[]>([])
const loaded = ref(false)

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) list.value = JSON.parse(saved)
  } catch {
    list.value = []
  }
  loaded.value = true
})

watch(
  list,
  (value) => {
    if (loaded.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

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

function add() {
  if (!found.value) return
  const result = addPokemon(list.value, found.value)
  list.value = result.list
  if (result.status === 'duplicate') message.value = 'Déjà dans ta wishlist.'
  else if (result.status === 'full')
    message.value = `Wishlist pleine (${MAX_WISHLIST_SIZE} Pokémon maximum).`
  else message.value = ''
  found.value = null
  query.value = ''
}

function remove(id: number) {
  list.value = removePokemon(list.value, id)
  message.value = ''
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
