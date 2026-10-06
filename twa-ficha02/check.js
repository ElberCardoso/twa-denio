import assert from 'node:assert/strict'
import { items } from './data.js'
import { byCategory, search, total, top, categories, withDiscount } from './catalog.js'

assert.equal(byCategory(items, 'filosofia').length, 3)
assert.ok(search(items, 'estoicismo').length > 0)
assert.ok(total(items) > 0)
assert.equal(top(items, 3).length, 3)
assert.ok(categories(items).includes('filosofia'))
assert.ok(withDiscount(items, 10).every(i => i.price <= items.find(o => o.id === i.id).price))

console.log('Todos os testes passaram!')