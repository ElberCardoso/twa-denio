<script setup>
defineProps({
  items: { type: Array, required: true },
  selectedId: { type: Number, default: null }
})

const emit = defineEmits(['select'])
</script>

<template>
  <section>
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          :class="{ selected: item.id === selectedId }"
          @click="emit('select', item.id)"
        >
          {{ item.name }} – {{ item.price }} €
          <span>({{ item.category }})</span>
        </button>
      </li>
    </ul>
    <p v-else>Nenhum item encontrado.</p>
  </section>
</template>

<style scoped>
section {
  margin: 20px 0;
}
.selected {
  font-weight: bold;
}
</style>
