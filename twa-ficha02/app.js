import { writeFile } from 'node:fs/promises'
import { items } from './data.js'
import { byCategory, search, top, total, categories, withDiscount } from './catalog.js'

const [cmd, arg] = process.argv.slice(2)

if (cmd === 'report') {
  const report = {
    count: items.length,
    total: total(items),
    categories: categories(items),
    top3: top(items, 3).map(i => i.name),
  }
  await writeFile('report.json', JSON.stringify(report, null, 2))
  console.log('report.json gravado!')
} else if (cmd === 'book' || cmd === 'autoajuda' || cmd === 'filosofia' || cmd === 'romance') {
  console.log(byCategory(items, cmd))
} else if (cmd === 'search') {
  console.log(search(items, arg))
} else if (cmd === 'top') {
  console.log(top(items, Number(arg)))
} else {
  console.log('Todos os itens:')
  items.forEach(i => console.log(`${i.id}. ${i.name} - €${i.price}`))
}