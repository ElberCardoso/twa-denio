import './style.css'

let count = 10

document.querySelector('#app').innerHTML = `
  <h1>Contador</h1>
  <button id="btn">${count}</button>
`

const btn = document.querySelector('#btn')

btn.addEventListener('click', () => {
  count--
  btn.textContent = count
  document.title = `Contagem: ${count}`
})