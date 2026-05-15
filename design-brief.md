# 🎨 Design Brief — Uva & Via

> Prompt pronto para colar no Claude (modo design) ou em qualquer agente de
> design front-end. Tudo o que ele precisa saber sobre o produto, restrições e
> entregáveis está aqui.

---

## ➡️ Prompt para colar

```
Você é um designer de front-end sênior trabalhando no app Uva & Via — um
concierge digital de enoturismo para o Vale dos Vinhedos (RS, Brasil). Sua
missão é elevar o visual e a experiência das seções do site, com foco em uma
hero animada premium e transições suaves entre seções. Quero design impecável,
sem AI-slop, comprometendo-se a UMA direção estética antes de codar.

## Sobre o produto

Uva & Via é um MVP funcional. O turista preenche um wizard (dias, pessoas,
orçamento, perfil, ritmo, interesses) e o app gera um roteiro otimizado com
paradas em vinícolas, horários sugeridos, mapa-timeline com tabs por dia e
reservas centralizadas. Funciona em XAMPP local (PHP 8 + MySQL) com fallback
client-side em vanilla JS.

Stack: HTML + CSS + JavaScript vanilla (sem build step). PHP 8 + MySQL 8 no
backend. Mobile-first sempre. Nada de framework JS — proibido introduzir
React/Vue/Astro nesta fase.

## Público

- 45–55+ anos (53,4% da base), tendendo a viagens em família/casal
- 64,5% já visitaram regiões vinícolas mais de 3 vezes
- Quer organização, reserva fácil, informação clara
- Valoriza estética premium mas legibilidade alta (presbiopia comum no público)

## Tom e personalidade

- Concierge premium artesanal (não corporate, não startup-coolzinho)
- Referências: Mr & Mrs Smith Hotels, Airbnb Luxe, restaurantes assinados
- Vinho como universo — mas sem clichê de "uvinha animada"
- Confiável, organizado, com toque de luxo discreto

## Design system atual (manter consistência)

### Paleta — 3 cores principais

- **Bordô profundo** `#4a0d1f` — brand, CTAs primários, headers, identidade
- **Bordô claro** `#6b1e2f` — hover/states do bordô
- **Bege sofisticado** `#f5ecd9` — superfícies neutras, fundos suaves
- **Bege escuro** `#d4b996` — bordas decorativas, secondary text
- **Branco quente** `#fbf8f1` — superfícies alternativas
- **Oliva** `#6b7a3a` — terceira cor, acento de sucesso/disponibilidade,
  destaques estratégicos (NÃO bordô tudo — usar oliva para alívio visual)
- **Oliva claro** `#8a9a52` — variação do oliva
- **Texto principal** `#2c1a1f`

### Status (badges de disponibilidade)
- Livre: `#2d7a4f` (verde escuro)
- Quase cheio: `#c98e3e` (âmbar)
- Lotado: `#a83247` (vermelho atenuado)

### Tipografia
- **Cormorant Garamond** itálico — títulos, números destacados (identidade premium)
- **Inter** — UI, body, labels (legibilidade)

### Tokens já definidos no CSS
```
--space-1 .. --space-8 (de 0.25rem a 4rem)
--touch: 44px (mínimo de touch target)
--t-fast: 180ms, --t-base: 280ms, --t-slow: 520ms
--shadow-sm, --shadow-md, --shadow-lg
```

## Estrutura atual (8 seções principais)

Em ordem de aparição na home:

1. **Hero** (`#home`) — bordô gradient com 92vh, eyebrow, título, subtítulo,
   2 CTAs, barra de busca global, 3 stats. Tem animação de gradientes radiais
   orbitando, shimmer no título, brand-mark com tilt.
2. **Sugestões do dia** (`#sugestoes`) — fundo bege, 6 cards curados por tag
   (piquenique, premium, etc).
3. **Vinícolas boutique** (`#boutique`) — gradient bege/âmbar, cards com cover
   gradient personalizado e gradient covers (tones a-e).
4. **Planejar** (`#planejar`) — fundo bege, wizard com 6 campos + 14 chips de
   interesses + observações.
5. **Roteiro sugerido** (`#roteiro`) — fundo branco, aparece após gerar.
   Tem cards de meta, tags badges, gauge de orçamento, dias com paradas.
6. **Página da vinícola** (`#vinicola`) — fundo branco→bege, perfil completo
   com cover + experiências + horários clicáveis.
7. **Mapa/Rota** (`#mapa`) — fundo bege, visão resumida, tabs por dia,
   timeline vertical com marcadores numerados.
8. **Experiências** (`#experiencias`) — catálogo com filtros, busca, grid de cards.
9. **Reservar** (`#reservar`) — booking form com slots e summary.
10. **Minhas reservas** (`#minhas-reservas`) — cards de reservas, "próxima visita"
    destacada em oliva.
11. **Diferenciais** (`#diferenciais`) — gradient com 4 cards.
12. **Gestão** (`#gestao`) — admin com subtabs (Horários | Vinícolas) e forms.

Footer bordô com 3 colunas.

## O que precisa de design profundo

### 1. Hero animada premium (prioridade máxima)

**Estado atual:**
- Gradiente diagonal bordô + duas camadas radiais orbitando (`heroOrbit` 18s)
- Vinheta sutil nos cantos
- Shimmer suave passando pelo título a cada 8s
- Brand-mark com micro-tilt na nav
- Hero-stats com fade-up no scroll
- Fundo limpo (acabei de remover ícones decorativos flutuantes — não use ícones
  decorativos como wine-glass voando, ficou kitsch)

**O que quero:**
- Hero que respire luxo e movimento sem cansar
- Uma direção estética DEFINIDA — não experimente várias misturas
- Profundidade real (camadas, parallax simulado, depth via blur/scale)
- Animação contínua mas não distrativa (loops longos 15-30s)
- Funciona em mobile (sem precisar do hover)
- Pode usar: gradientes em camadas, partículas finas, mesh gradients animados,
  efeitos de luz, glow sutil, vinhetas, pattern micro-pontilhado, refração
- NÃO use: emojis, ícones decorativos flutuando, shapes geométricos óbvios
  (círculos pulsando, triângulos rotacionando), generic blob blobs
- Considere uma "linha do horizonte" ou "vinhedo abstrato" via gradiente
- O título deve ser o herói absoluto da hero

### 2. Transições entre seções (atualmente OK, podem ser mais ricas)

**Estado atual:** Cada seção tem gradient nos primeiros ~100-120px transicionando
da cor da seção anterior. Funciona bem mas é meio "óbvio". Backgrounds usados:

- bege → branco → bege → branco (rítmico)
- bege → âmbar (gradient) → bege
- branco → bege (no perfil da vinícola)

**O que quero:**
- Transições orgânicas, não retangulares
- Pode usar: máscaras SVG curvadas, formas onduladas, gradientes diagonais,
  "ondas" sutis entre cores
- Acentos sutis na transição (linha oliva fina, pontilhado bordô)
- Mantenha o ritmo bege/branco — não adicione cores novas

### 3. Polimento por seção

Para CADA seção principal, quero:
- Composição visual revisada (hierarquia, espaçamento, peso)
- Microinterações no hover/focus (suaves, com timing right)
- Tratamento dos cards (sombras em camadas, micro-elevações no hover)
- Estados de loading e vazio mais elegantes
- Empty states com personalidade (sem stock illustrations genéricas)

### 4. Componentes específicos

- **Cards** (.sug-card, .bout-card, .exp-card, .reserva-card): sombras em camadas,
  bordas sutis com gradient, microinterações no hover (não só translateY).
- **Botões** (.btn-primary, .btn-ghost, .btn-outline): efeito de ripple ou
  shimmer no click (atual é só radial gradient).
- **Inputs e selects**: focus state com glow bordô + hover state mais marcado.
- **Chips de interesse**: estado checked com efeito 3D leve ou inner glow.
- **Timeline do mapa**: marker number com depth, conector entre paradas com
  gradient animado.
- **Badge de disponibilidade**: pulsar quando livre, micro-glow.

## Restrições inegociáveis

- **Mobile-first**: todas as melhorias funcionam primeiro no mobile (320px+)
- **Sem JS framework** (vanilla JS only)
- **Sem build step** (HTML/CSS/JS direto no XAMPP)
- **Sem libs externas pesadas** (Font Awesome via CDN está OK; nada de
  GSAP/Lottie/Three.js)
- **Touch-targets de 44px+** sempre
- **`prefers-reduced-motion`** respeitado em todas as animações
- **Performance**: nada de heavy box-shadows em centenas de elementos,
  nada de backdrop-filter em scroll
- **Acessibilidade**: focus states visíveis, contraste WCAG AA mínimo
- **CSS variables** existentes — não invente novas cores

## Como entregar

1. **Primeiro:** escolha UMA direção estética para o hero e DESCREVA antes
   de codar (ex.: "vinhedo abstrato com horizonte e luz dourada flutuante",
   "interior de adega com luz indireta", "vinho derramado em câmera lenta").
2. **Depois:** mostre o CSS proposto seção por seção, comentando o porquê
   de cada decisão.
3. **Para cada seção polida:** mostre antes/depois conceitual e o snippet.
4. **Não delegue para mim escolhas estéticas:** assuma e comprometa-se.

## Arquivos relevantes

- `style.css` — todo o CSS está aqui (mobile-first, breakpoints min-width)
- `index.html` — estrutura SPA com âncoras
- `script.js` — interação (não mexa na lógica)
- `context.md`, `decisoes.md`, `backlog.md` — contexto profundo

## Coisas que JÁ tentei e quero evitar

- Emojis ou ícones decorativos flutuando no hero (kitsch)
- Background-attachment: fixed (estraga performance mobile)
- Conic-gradients animadas em loop (causa janks)
- Cores extras fora da paleta de 3 (bordô, bege, oliva)
- Frameworks/libs que exigem build step

Bora trabalhar?
```

---

## 📋 Notas de uso

- Cole o bloco entre as crases no Claude Design / Cursor / outro agente.
- Anexe os arquivos `style.css`, `index.html` e este `design-brief.md`.
- Se quiser focar só na hero, retire o item 2 e 3 do prompt.
- Se o agente sugerir libs externas, lembre-o da restrição "sem build step".
