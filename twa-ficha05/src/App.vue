<script setup>
import { ref, computed, watch } from 'vue'
import { search, byCategory, categories, sortByPrice } from './catalog.js'
import ItemList from './components/ItemList.vue'
import ItemDetail from './components/ItemDetail.vue'
import ItemForm from './components/ItemForm.vue'

// Imports da Parte 4
import { getJSON } from './api/getJSON.js'
import { useLoad } from './composables/useLoad.js'

// Substitui status, error, items e load por isto:
const { status, error, data: items, load } = useLoad(() => getJSON('/items.json'))

// Mantém os teus outros refs normais:
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

// Parte 5: watch para limpar a seleção ao pesquisar
watch(query, () => {
  selectedId.value = null
})

const visible = computed(() => {
  const currentItems = items.value ?? [] // Protege caso items seja null
  let list = search(currentItems, query.value)
  if (category.value) list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})

const cats = computed(() => categories(items.value ?? []))


const selected = computed(() => {
  return (items.value ?? []).find(i => i.id === selectedId.value)
})

watch(query, () => {
  selectedId.value = null
})

function saveItem(item) {
  if (item.id != null) {
    const index = items.value.findIndex(
      existing => existing.id === item.id
    )

    if (index !== -1) {
      items.value[index] = item
    }
  } else {
    const nextId =
      Math.max(0, ...items.value.map(i => Number(i.id) || 0)) + 1

    item.id = nextId
    items.value.push(item)
  }

  selectedId.value = item.id
  editingItem.value = null
}

function editSelected() {
  if (selected.value) {
    editingItem.value = { ...selected.value }
  }
}

</script>

<template>
  <main>
    <h1>Catálogo de produtos</h1>

    <label for="search">Pesquisar produtos</label>
    <input
      id="search"
      v-model="query"
      type="search"
      placeholder="Pesquisar por nome ou etiqueta..."
    />

    <label for="category">Categoria</label>
    <select id="category" v-model="category">
      <option value="">Todas as categorias</option>
      <option v-for="c in cats" :key="c" :value="c">
        {{ c }}
      </option>
    </select>

    <button
      type="button"
      @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'"
    >
      Ordenar por preço
      ({{ sortDir === 'desc' ? '↓' : '↑' }})
    </button>

    <p v-if="status === 'loading'">A carregar produtos...</p>

    <p v-else-if="status === 'error'">
      Erro ao carregar os produtos: {{ error }}
      <button type="button" @click="load">Tentar novamente</button>
    </p>

    <template v-else>
      <ItemList
        :items="visible"
        :selected-id="selectedId"
        @select="selectedId = $event"
      />

      <ItemDetail :item="selected" />

      <button
        v-if="selected && !editingItem"
        type="button"
        @click="editSelected"
      >
        Editar produto selecionado
      </button>

      <ItemForm
        :initial-item="editingItem"
        @save="saveItem"
        @cancel="editingItem = null"
      />
    </template>
  </main>
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