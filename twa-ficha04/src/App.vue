<script setup>
import { ref, computed } from 'vue'
import { search, byCategory, categories, sortByPrice } from './catalog.js'

const status = ref('loading')
const error = ref(null)
const items = ref([])
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

async function load() {
  status.value = 'loading'
  error.value = null
  try {
    const res = await fetch('/items.json')
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    items.value = await res.json()
    status.value = 'ready'
  } catch (err) {
    status.value = 'error'
    error.value = err instanceof SyntaxError
      ? 'Resposta inválida (não é JSON)'
      : err.message
  }
}

const visible = computed(() => {
  let list = search(items.value, query.value)
  if (category.value) list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})

const cats = computed(() => categories(items.value))

const selected = computed(() =>
  items.value.find(i => i.id === selectedId.value)
)

load()
</script>

<template>
  <h1>Catálogo</h1>

  <input v-model="query" type="search" placeholder="Pesquisar…" />

  <select v-model="category">
    <option value="">Todas as categorias</option>
    <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
  </select>

  <button @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'">
    Ordenar por preço ({{ sortDir === 'desc' ? '↓' : '↑' }})
  </button>

  <p v-if="status === 'loading'">A carregar…</p>

  <p v-else-if="status === 'error'">
    Não foi possível carregar os dados ({{ error }}).
    <button @click="load">Retry</button>
  </p>

  <template v-else>
    <p v-if="visible.length === 0">Nenhum resultado.</p>

    <ul id="list">
      <li
        v-for="item in visible"
        :key="item.id"
        :class="{ selected: item.id === selectedId }"
        @click="selectedId = item.id"
      >
        {{ item.name }} · {{ item.price.toFixed(2) }} €
      </li>
    </ul>

    <section v-if="selected">
      <h2>{{ selected.name }}</h2>
      <p>Preço: {{ selected.price.toFixed(2) }} €</p>
      <p>Categoria: {{ selected.category }}</p>
      <ul>
        <li v-for="t in selected.tags" :key="t">{{ t }}</li>
      </ul>
      <p>Autor: {{ selected.author.name }} ({{ selected.author.country }})</p>
    </section>
  </template>
</template>

<style scoped>
li {
  cursor: pointer;
}
.selected {
  font-weight: bold;
  background: #fde8ee;
}
</style>