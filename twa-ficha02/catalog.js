export const byCategory = (list, cat) =>
  list.filter(i => i.category === cat)

export const search = (list, text) =>
  list.filter(i =>
    i.name.toLowerCase().includes(text.toLowerCase()) ||
    i.tags.some(t => t.toLowerCase().includes(text.toLowerCase()))
  )

export const total = (list) =>
  list.reduce((sum, i) => sum + i.price, 0)

export const top = (list, n) =>
  [...list].toSorted((a, b) => b.price - a.price).slice(0, n)

export const categories = (list) =>
  [...new Set(list.map(i => i.category))].toSorted()

export const withDiscount = (list, pct) =>
  list.map(i => ({ ...i, price: +(i.price * (1 - pct / 100)).toFixed(2) }))