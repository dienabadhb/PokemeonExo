<script setup lang="ts">
import type { WishPokemon } from './utils/wishlist'

const STORAGE_KEY = 'pokewishlist'

const query = ref('')
const found = ref<WishPokemon | null>(null)
const error = ref('')
const loading = ref(false)
console.log('test')
debugger
const list = ref<WishPokemon[]>([])
const loaded = ref(false)

// Charger la liste sauvegardée (côté navigateur uniquement)
onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) list.value = JSON.parse(saved)
  } catch {
    list.value = []
  }
  loaded.value = true
})

// Sauvegarder à chaque modification
watch(list, (value) => {
  if (loaded.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}, { deep: true })

interface PokeApiResponse {
  id: number
  name: string
  sprites: { front_default: string | null }
}

async function search() {
  error.value = ''
  found.value = null
  const q = query.value.trim().toLowerCase()
  if (!q) return

  loading.value = true
  try {
    const data = await $fetch<PokeApiResponse>(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(q)}`)
    found.value = {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
    }
  } catch {
    error.value = `Pokémon « ${query.value} » introuvable (utilise le nom anglais : pikachu, charmander...)`
  } finally {
    loading.value = false
  }
}

function add() {
  if (!found.value) return
  list.value = addPokemon(list.value, found.value)
  found.value = null
  query.value = ''
}

function remove(id: number) {
  list.value = removePokemon(list.value, id)
}
</script>

<template>
  <main>
    <h1>PokéWishlist</h1>

    <form @submit.prevent="search">
      <input v-model="query" placeholder="Rechercher (ex : pikachu)" >
      <button type="submit" :disabled="loading">Rechercher</button>
    </form>

    <p v-if="loading">Recherche...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="found">
      <img v-if="found.sprite" :src="found.sprite" :alt="found.name" >
      <strong>{{ found.name }}</strong>
      <button @click="add">Ajouter à la wishlist</button>
    </div>

    <h2>Ma wishlist ({{ list.length }})</h2>
    <p v-if="loaded && !list.length">Aucun Pokémon pour l'instant.</p>
    <ul>
      <li v-for="p in list" :key="p.id">
        <img v-if="p.sprite" :src="p.sprite" :alt="p.name" >
        {{ p.name }}
        <button @click="remove(p.id)">Supprimer</button>
      </li>
    </ul>
  </main>
</template>