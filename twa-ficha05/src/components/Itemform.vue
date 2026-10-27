
<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  initialItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  name: '',
  category: '',
  price: '',
  tags: '',
  authorName: '',
  authorCountry: ''
})

watch(
  () => props.initialItem,
  (item) => {
    form.name = item?.name ?? ''
    form.category = item?.category ?? ''
    form.price = item?.price ?? ''
    form.tags = item?.tags?.join(', ') ?? ''
    form.authorName = item?.author?.name ?? ''
    form.authorCountry = item?.author?.country ?? ''
  },
  { immediate: true }
)

const errors = computed(() => {
  const result = {}

  if (!form.name.trim()) {
    result.name = 'O nome é obrigatório.'
  }

  if (
    form.price === '' ||
    !Number.isFinite(Number(form.price)) ||
    Number(form.price) <= 0
  ) {
    result.price = 'O preço deve ser superior a zero.'
  }

  return result
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function reset() {
  form.name = ''
  form.category = ''
  form.price = ''
  form.tags = ''
  form.authorName = ''
  form.authorCountry = ''
}

function submit() {
  if (!isValid.value) return

  const item = {
    ...(props.initialItem ? props.initialItem : {}),
    name: form.name.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    tags: form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean),
    author: {
      ...(props.initialItem?.author ?? {}),
      name: form.authorName.trim(),
      country: form.authorCountry.trim()
    }
  }

  emit('save', item)
  reset()
}
</script>

<template>
  <section>
    <h2>{{ initialItem ? 'Editar produto' : 'Adicionar produto' }}</h2>

    <form @submit.prevent="submit">
      <label for="name">Nome</label>
      <input id="name" v-model.trim="form.name" />
      <small v-if="errors.name">{{ errors.name }}</small>

      <label for="category">Categoria</label>
      <input id="category" v-model.trim="form.category" />

      <label for="price">Preço (€)</label>
      <input
        id="price"
        v-model="form.price"
        type="number"
        min="0.01"
        step="0.01"
      />
      <small v-if="errors.price">{{ errors.price }}</small>

      <label for="tags">Etiquetas (separadas por vírgulas)</label>
      <input
        id="tags"
        v-model="form.tags"
        placeholder="Ex.: escola, promoção"
      />

      <label for="authorName">Nome do autor</label>
      <input id="authorName" v-model.trim="form.authorName" />

      <label for="authorCountry">País do autor</label>
      <input id="authorCountry" v-model.trim="form.authorCountry" />

      <button type="submit" :disabled="!isValid">
        {{ initialItem ? 'Guardar alterações' : 'Adicionar produto' }}
      </button>

      <button type="button" @click="reset">
        Limpar
      </button>

      <button type="button" @click="emit('cancel')">
        Cancelar
      </button>
    </form>
  </section>
</template>

<style scoped>
section {
  margin: 20px 0;
}

label {
  display: block;
  margin-top: 10px;
}

input {
  display: block;
  width: 100%;
  max-width: 400px;
  padding: 7px;
}

small {
  display: block;
  color: #b00020;
}

button {
  margin: 12px 8px 0 0;
  padding: 8px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
