import { search, byCategory, categories, sortByPrice } from './catalog.js'

const state = {
  status: 'loading',
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null,
}

const $search = document.querySelector('#search')
const $category = document.querySelector('#category')
const $sort = document.querySelector('#sort')
const $list = document.querySelector('#list')
const $detail = document.querySelector('#detail')

async function load() {
  state.status = 'loading'
  state.error = null
  render()
  try {
    const res = await fetch('/items.json')
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    state.items = await res.json()
    state.status = 'ready'
  } catch (err) {
    state.status = 'error'
    state.error = err instanceof SyntaxError
      ? 'Resposta inválida (não é JSON)'
      : err.message
  } finally {
    render()
  }
}

function visibleItems() {
  let list = search(state.items, state.query)
  if (state.category) list = byCategory(list, state.category)
  return sortByPrice(list, state.sortDir)
}

function render() {
  $list.replaceChildren()
  $detail.replaceChildren()

  if (state.status === 'loading') {
    const li = document.createElement('li')
    li.textContent = 'A carregar…'
    $list.append(li)
    return
  }

  if (state.status === 'error') {
    const li = document.createElement('li')
    li.textContent = `Não foi possível carregar os dados (${state.error}).`
    const btn = document.createElement('button')
    btn.textContent = 'Tentar de novo'
    btn.addEventListener('click', load)
    li.append(' ', btn)
    $list.append(li)
    return
  }

   renderCategories()

  const visible = visibleItems()

  if (visible.length === 0) {
    const li = document.createElement('li')
    li.textContent = 'Nenhum resultado.'
    $list.append(li)
  }

  for (const item of visible) {
    const li = document.createElement('li')
    li.textContent = `${item.name} — ${item.price} €`
    li.dataset.id = item.id
    $list.append(li)
  }

  renderDetail()

function renderCategories() {
  $category.replaceChildren()
  const all = document.createElement('option')
  all.value = ''
  all.textContent = 'Todas as categorias'
  $category.append(all)
  for (const c of categories(state.items)) {
    const opt = document.createElement('option')
    opt.value = c
    opt.textContent = c
    $category.append(opt)
  }
  $category.value = state.category
}

function renderDetail() {
  const item = state.items.find(i => String(i.id) === String(state.selectedId))
  if (!item) return

  const h2 = document.createElement('h2')
  h2.textContent = item.name

  const price = document.createElement('p')
  price.textContent = `Preço: ${item.price} €`

  const category = document.createElement('p')
  category.textContent = `Categoria: ${item.category}`

  const tags = document.createElement('ul')
  for (const t of item.tags ?? []) {
    const li = document.createElement('li')
    li.textContent = t
    tags.append(li)
  }

  const author = document.createElement('p')
  author.textContent = `Autor: ${item.author.name} (${item.author.country})`

  $detail.append(h2, price, category, tags, author)
}

  $detail.append(h2, price, tags)

  // AJUSTAR: troca "specs" pelo nome do objeto aninhado no teu items.json
  if (item.specs) {
    const dl = document.createElement('dl')
    for (const [k, v] of Object.entries(item.specs)) {
      const dt = document.createElement('dt')
      dt.textContent = k
      const dd = document.createElement('dd')
      dd.textContent = v
      dl.append(dt, dd)
    }
    $detail.append(dl)
  }
}

// Eventos: só mudam o state, depois render()
$search.addEventListener('input', e => {
  state.query = e.target.value
  render()
})

$category.addEventListener('change', e => {
  state.category = e.target.value
  render()
})

$sort.addEventListener('click', () => {
  state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc'
  render()
})

// Delegação: um só listener no <ul>
$list.addEventListener('click', e => {
  const li = e.target.closest('li[data-id]')
  if (!li) return
  state.selectedId = li.dataset.id
  render()
})

load()