
<script setup>
defineProps({
  item: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <section>
    <h2>Detalhes do produto</h2>

    <p v-if="!item">
      Seleciona um produto na lista.
    </p>

    <div v-else>
      <h3>{{ item.name }}</h3>

      <p>
        <strong>Categoria:</strong>
        {{ item.category }}
      </p>

      <p>
        <strong>Preço:</strong>
        {{ item.price }} €
      </p>

      <p>
        <strong>Etiquetas:</strong>
        {{ item.tags?.join(', ') || 'Sem etiquetas' }}
      </p>
    </div>
  </section>
</template>
