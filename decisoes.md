# 🧭 Uva & Via — Decisões de Arquitetura

Registro das decisões técnicas e de produto, com o **porquê** de cada escolha
para que futuras manutenções não recolham os mesmos debates.

---

## D-01. Vanilla JS em vez de framework (React/Vue/Astro)

**Decisão:** O front-end permanece em HTML/CSS/JS vanilla, sem build step.

**Por quê:**
- O projeto roda em XAMPP local; introduzir Webpack/Vite/Node exigiria toolchain extra
  no fluxo do time, e o repo passaria a precisar de `node_modules` ou pipeline CI.
- O escopo do MVP é uma SPA ancorada (~8 seções) — vanilla resolve sem ginástica.
- O algoritmo de roteiro e a UI são intencionalmente leves; framework agregaria peso
  sem ROI claro nesta fase.
- Mobile-first se resolve com CSS bem escrito, não com framework.

**Quando reabrir:** Se virem que o time precisa de testes de UI sistemáticos,
roteamento real (deep links) ou componentes reutilizáveis em projetos paralelos,
considerar **Astro** (mantém HTML estático + ilhas reativas) ou **Next.js**.
Migração na branch `next-migration`, não no main.

---

## D-02. Mobile-first com breakpoints `min-width`

**Decisão:** Toda a estilização parte do mobile (sem media query) e escala via
`@media (min-width: …)` em pontos definidos: 600, 720, 860, 900, 960.

**Por quê:**
- O público-alvo (45–55+ anos) acessa cada vez mais por celular durante a viagem.
- Mobile-first força priorizar conteúdo, sem media-queries inversas (`max-width`)
  empilhadas que ficam ilegíveis com o tempo.
- Os breakpoints foram escolhidos a partir do conteúdo, não de dispositivos:
  - 600 = quando 2 colunas começam a caber
  - 720 = quando tabelas/grids 4-col fazem sentido
  - 860 = quando o nav drawer vira nav horizontal
  - 900 = grids de 4-5 colunas (roteiro-meta, mapa-resumo)
  - 960 = grids de 3 cards lado a lado

**Touch-targets:** 44 px mínimo (token `--touch`) — Apple HIG.

---

## D-03. Cores e tipografia "concierge premium"

**Decisão:**
- Paleta: bordô profundo + bege + oliva + tons terrosos.
- Tipografia: **Cormorant Garamond** itálico para títulos; **Inter** para UI.

**Por quê:**
- Bordô = universo do vinho, instantaneamente legível como categoria.
- Bege + tons terrosos sugerem vinhedos e produção artesanal — alinhado a vinícolas boutique.
- Serif itálica nos números/títulos remete a apps premium de viagem (Airbnb Luxe, Mr & Mrs Smith).
- Inter para UI mantém legibilidade em telas pequenas (45+ anos, presbiopia).

**Não usar:** azul (frio para o setor), pretos puros (#000 desbalanceia o bordô).

---

## D-04. Algoritmo de roteiro client-side

**Decisão:** O scoring e a montagem do roteiro rodam no browser, mesmo havendo
endpoint server (`api/roteiros.php`).

**Por quê:**
- Latência zero — o usuário vê o roteiro instantaneamente.
- Funciona offline com os dados embutidos no `script.js`.
- O backend está pronto para assumir quando precisarmos de personalização baseada em
  histórico do usuário (ainda não implementado).

**Quando migrar para server:** Quando o scoring incorporar histórico do visitante,
cobranças, ou modelos ML.

---

## D-05. Persistência em localStorage

**Decisão:** Reservas, horários custom e plano atual ficam em `localStorage`.

**Por quê:**
- Sem login real no MVP, não há como vincular reservas a um usuário do banco.
- Permite testar o fluxo completo sem backend rodando.
- Sincronização entre abas via evento `storage` (atualização ao vivo).

**Trade-off conhecido:** Reservas se perdem se o usuário limpar o navegador.
A pós-MVP precisa de autenticação + persistência server-side.

---

## D-06. Fallback resiliente para dados (API → embutido)

**Decisão:** O `script.js` carrega arrays embutidos de vinícolas/experiências/horários.
O `api-client.js` tenta substituir esses arrays via `splice()` após buscar do PHP.

**Por quê:**
- O site nunca quebra se o XAMPP/MySQL estiver fora.
- Demo do MVP roda em qualquer GitHub Pages sem backend.
- Os mapeadores (`mapVinicola`, `mapExperiencia`) preservam campos que a API não fornece
  (ex.: `tipo: boutique`, `tone`, slugs de tags) usando lookup por id no fallback.

---

## D-07. Mapa "timeline vertical" em vez de mapa real

**Decisão:** O #mapa renderiza uma timeline vertical numerada com info de deslocamento,
não um mapa geográfico (Leaflet/Google Maps).

**Por quê:**
- A informação **acionável** para o usuário é a sequência das paradas, horários e
  tempos de deslocamento — não a geografia exata.
- Evita custo de API (Mapbox/Google Maps) e dependência externa no MVP.
- Mobile-friendly: timeline vertical aproveita melhor a tela do que um mapa.
- Mais rápido para implementar e testar.

**Quando adicionar mapa real:** Quando o usuário precisar visualizar geograficamente
para decidir onde se hospedar, ou quando rotas reais (Waze/Google Routes) entrarem no
escopo.

---

## D-08. Tags como slugs (não FK)

**Decisão:** Interesses no front são slugs (`degustacao-premium`, `por-do-sol`), não
ids numéricos do banco.

**Por quê:**
- O algoritmo de scoring precisa casar tags **e** keywords no nome — slugs são legíveis
  no código.
- A API retorna tags como `{id, nome}`, mas o mapeador prioriza o fallback de slugs do
  `script.js` para manter o scoring funcional após carga da API.

**Trade-off:** Adicionar nova tag requer sincronizar o seed (db) + array (script.js) +
HTML (chips). Aceito porque o catálogo de tags é estável.

---

## D-09. Sem login no MVP

**Decisão:** Nenhuma tela de autenticação. Reservas pedem só nome do responsável.

**Por quê:**
- 61,3% dos pesquisados preferem soluções gratuitas; fricção de cadastro afasta.
- O valor central (roteiro otimizado + reservas) entrega antes de pedir credenciais.
- Login chega na v2 quando houver:
  - histórico de reservas multi-dispositivo,
  - pagamento (precisa CPF/dados),
  - notificações por email/push.

---

## D-10. Disponibilidade visual: 3 estados de cor

**Decisão:**
- Verde `#2d7a4f` = vagas disponíveis (>30% da capacidade)
- Amarelo `#c98e3e` = quase cheio (≤30% da capacidade)
- Vermelho `#a83247` = lotado (0 vagas)

**Por quê:**
- Padrão universal (semáforo), aprendizado zero.
- A pesquisa mostrou que 93,6% valorizam disponibilidade em tempo real — destacar
  visualmente é a forma mais direta de entregar isso.
- Os tons foram ajustados ao restante da paleta (não verde-neón nem vermelho-puro)
  para manter coesão premium.

---

## D-11. Sem README/docs gerados por IA dentro do código

**Decisão:** Documentação fica em arquivos `.md` separados (este). O código não tem
comentários de IA descrevendo o óbvio.

**Por quê:**
- Comentários do tipo "// percorre cada vinícola" são ruído — o código já diz isso.
- Onde há **why** não óbvio (haversine, scoring com pesos arbitrários), há comentário
  curto.
- Documentação de produto/decisão fica nos `.md` para sobreviver a refactors.

---

## D-12. Ícones em emoji (não SVG/lib)

**Decisão:** Ícones de UI (🍇 🍷 ⏱ 💰 🗺️) usam emoji nativo.

**Por quê:**
- Zero peso adicional (sem ícone-font ou SVG sprite).
- Funciona offline.
- Combina com o tom "concierge artesanal" do produto.

**Trade-off:** Emojis variam por SO (Windows ≠ iOS). Aceitamos a variação porque
o significado se mantém. Quando precisarmos de uniformidade visual rígida
(brand-guide formal), migrar para SVG inline.
