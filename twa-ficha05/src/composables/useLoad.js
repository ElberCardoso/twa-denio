import { onMounted, ref } from 'vue'

export function useLoad(fetcher) {
  const status = ref('loading')
  const error = ref(null)
  const data = ref(null)

  async function load() {
    status.value = 'loading'
    error.value = null
    try {
      data.value = await fetcher()
      status.value = 'success'
    } catch (err) {
      error.value = err.message
      status.value = 'error'
    }
  }

  onMounted(load)

  return { status, error, data, load }
}