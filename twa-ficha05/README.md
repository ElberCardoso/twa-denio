# Ficha 05 - Componentes e Formulários (TWA)

## Descrição do Projeto
Projeto desenvolvido em Vue 3 com Vite para a disciplina de Tecnologias Web. Foram implementadas estruturas de componentes com fluxo unidirecional de dados (props/emits), gestão de estado reativo, refatoração de chamadas à API em composables reutilizáveis (`useLoad`) e sincronização de estado com `watch`[cite: 1, 3, 4].

## Como Correr o Projeto
1. Instalar as dependências: `npm install`
2. Iniciar o servidor de desenvolvimento: `npm run dev`
3. Abrir o endereço indicado no terminal (ex: `http://localhost:5173/`)

## Declaração de Uso de Inteligência Artificial
Utilizado assistente de IA (Gemini) como ferramenta de apoio para esclarecimento de dúvidas conceptuais, estrutura de composables e depuração de código durante o desenvolvimento dos exercícios.

---

## Pergunta 1
**Porque é que o ItemList não escreve em selectedId diretamente, se até tem acesso ao valor pela prop? O que ganhas com o emit?**
O Vue segue um fluxo de dados unidirecional (props descem, eventos sobem)[cite: 1, 2]. Se um componente filho alterasse uma prop diretamente, criaria mutações imprevisíveis de estado difíceis de depurar. O `emit` permite avisar o pai sobre uma intenção, mantendo o componente pai como único responsável por alterar o seu próprio estado[cite: 1, 2].

## Pergunta 2
**visible é um computed e o "limpar a seleção" é um watch. Explica a regra que te diz qual usar.**
Usa-se `computed` para calcular e retornar um novo valor derivado de forma reativa