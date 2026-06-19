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

## D-12. ~~Ícones em emoji~~ Font Awesome via CDN (revisado 2026-05-15)

**Decisão original:** Ícones de UI em emoji nativo.
**Decisão atual:** Font Awesome 6.5 via CDN (`cdnjs.cloudflare.com`).

**Por quê mudou:**
- Emojis variavam muito por SO (Windows ≠ iOS ≠ Android) — quebrava a consistência visual
  numa UI que se vende como "premium".
- Font Awesome dá controle de cor via CSS (`color: var(--vinho)`) — emojis não.
- Tamanho perceptivo do FA Free CDN é aceitável (~80KB gzip, cacheado).
- CDN com SRI hash garante integridade e velocidade global.

**Quando reabrir:** Se medirmos impacto no CLS/LCP no mobile, migrar para um subset SVG
inline com só os ~15 ícones que usamos. Não vale o esforço hoje.

---

## D-13. Custom Vinícolas em localStorage

**Decisão:** Vinícolas adicionadas via admin ficam em `localStorage` (`uvaevia.vinicolas.custom`),
não no backend.

**Por quê:**
- Mesma razão do D-05 (reservas em localStorage): MVP sem auth, sem multi-tenant.
- Permite testar o flow de cadastro sem PHP/MySQL ativos.
- IDs custom usam range `1000+` (Date.now() % 100000) para não colidir com seed do banco.

**Limitação consciente:** Custom vinícolas não podem ter experiências (a edição de experiências
ainda não existe). Ver `backlog.md` v1.1.

---

## D-14. Validação client-side antes de tudo

**Decisão:** Toda validação é client-side com mensagens inline (`<small class="form-error">`).

**Por quê:**
- Latência zero de feedback.
- O backend valida de novo (cinto + suspensório), mas o usuário não chega lá com erro óbvio.
- Acessibilidade: `aria-invalid` + mensagem associada via id permite leitor de tela ler.

**Regras universais:**
- Datas: `min={today}` aplicado dinamicamente, refrescado a cada 30 min.
- Números: `min` declarado no HTML + verificação JS.
- Nomes: comprimento mínimo + verificação contra duplicatas.

---

## D-15. Scrollbar global oculta

**Decisão:** Esconder a scrollbar nativa em `html`/`body` mantendo o scroll funcional.

**Por quê:**
- Visual mais limpo, alinhado a apps premium de viagem (Airbnb, Mr & Mrs Smith não mostram scrollbar).
- O usuário pediu explicitamente.

**Trade-offs e mitigações:**
- Affordance perdida (usuário pode não perceber que rola): mitigado pelo `hero-scroll` no fim do hero
  e pelo `scroll-behavior: smooth` que dá feedback ao âncora.
- Containers internos que precisam de barra (longas listas no admin) podem usar
  `.scrollable-inner` (definido no CSS).

---

## D-16. Modo "faixa de horários" para escalar admin

**Decisão:** O form de cadastro de horários tem dois modos: único e faixa.
O modo faixa gera vários slots numa submissão (data início/fim × hora início/fim com intervalo).

**Por quê:**
- Cadastrar slot a slot é um trabalho braçal — uma vinícola que abre 6 horários/dia × 7 dias
  precisaria de 42 submissões.
- O modo faixa resolve com 1 form (preview ao vivo conta quantos slots vão ser criados).
- Validações comuns (data passada, hora final menor que inicial, capacidade < 1) cobrem
  os dois modos.

**Trade-off:** Aumenta complexidade do form (mais campos visíveis). Mitigado pelo toggle
visual no topo do form — quando "Único" está ativo, os campos do modo faixa ficam `hidden`
e `disabled` (não bloqueiam o submit por `required`).

---

## D-17. Repaginação 2026: evoluir a base, não reescrever

**Decisão:** Toda a repaginação foi feita como **módulos novos em `js/`** e edições
cirúrgicas nos existentes, mantendo arquitetura, design (hero/taça 3D) e stack.

**Por quê:** o código-base é limpo e o design está coerente; o ROI está em fechar
lacunas de produto (confiança, logística, descoberta) e de negócio, não em trocar
fundação. Cada feature virou commit independente para revisão e rollback fáceis.

---

## D-18. "Motorista da rodada" como diferencial de logística

**Decisão:** Adicionar um bloco de transporte no roteiro (`js/transporte.js`) com
modos carro/app/transfer e orientação de motorista sóbrio, em vez de só calcular km.

**Por quê:** a pesquisa de campo mostrou que **dirigir após degustar** e a distância
entre vinícolas (3–8 km) são a maior dor do passeio — e nenhum concorrente trata.
É barato de implementar (client-side) e alto em diferenciação/marca.

---

## D-19. Política de cancelamento derivada e sempre visível

**Decisão:** Política por experiência (`flex` 24h / `moderada` 48h) derivada das
tags/preço em `js/dados-extra.js`, exibida antes de reservar, no perfil e no
comprovante; o cancelamento informa o reembolso conforme o prazo.

**Por quê:** a reclamação nº1 contra plataformas de passeio (Reclame Aqui) é
cancelamento opaco/assimétrico. Transparência é feature de confiança — e confiança
é o nosso valor central.

---

## D-20. Reserva como "solicitação", não confirmação instantânea

**Decisão:** Reenquadrar a reserva como **solicitação** pendente de confirmação da
vinícola, capturando e-mail/WhatsApp, em vez de afirmar "confirmado na hora".

**Por quê:** sem integração real de agenda, prometer confirmação instantânea cria o
risco do "passeio vendido e não entregue" (maior risco de negócio em 6 meses, ver
`analise-negocio.md`). Honestidade preserva a confiança; o status já evolui
Pendente → Confirmada.

---

## D-21. PWA com service worker (offline na estrada)

**Decisão:** Tornar o app instalável (`manifest.webmanifest` + `icon.svg`) e
offline (`sw.js`): navegação network-first, estáticos cache-first, nunca cacheia
`/api/*` nem CDNs.

**Por quê:** a persona usa o celular durante a viagem e algumas vinícolas têm sinal
fraco (achado da pesquisa). Cache-first nos estáticos pode servir versão levemente
defasada — mitigado pela versão do cache (`uvaevia-vN`) a cada release.

---

## D-22. Mappers da API preservam o enriquecimento do seed

**Decisão:** `api-client.js` mescla `window.SEED_*` por id ao mapear, preservando
`tipo`, `tone`, `comodidades`, `endereco`, `telefone`, `inclui` e `cancelamento`.

**Por quê:** o backend ainda não expõe esses campos; sem o merge, ao carregar a API
o site **perdia** o filtro de boutique e as comodidades. Dados reais da API sempre
têm prioridade sobre o seed.

---

## D-23. Seção B2B e newsletter no próprio produto

**Decisão:** Expor o modelo de receita com a seção "Para vinícolas" e capturar
e-mail via newsletter (`js/parcerias.js`), persistindo leads em localStorage (demo).

**Por quê:** mitiga os riscos nº2 (receita nunca ativada) e nº4/5 (retenção/
distribuição) de `analise-negocio.md`. Mantém a porta aberta para o backend assumir
os leads quando houver operação comercial.

---

## D-24. Guest-first: o fluxo central não exige login

**Decisão:** O app não nasce travado atrás do login. O visitante usa o fluxo
central (gerar roteiro, explorar, reservar) como convidado; login é opcional
(botão "Entrar"). Só travamos em casos específicos (troca de senha obrigatória de
admin). Gestão fica visível apenas para admin.

**Por quê:** o gate duro (`body.auth-locked` + `onAuthChange(null)` reabrindo o
login) deixava o fluxo crítico — 100% client-side — **inacessível** quando o
backend estava no ar sem sessão, ou se ele oscilasse. Numa avaliação que testa "a
ação principal como usuário real", um muro de login dependente de PHP/MySQL/
cookies/CSRF é um risco grande e desnecessário. Guest-first também realinha com o
D-09 ("sem fricção de cadastro") e com a persona (61,3% preferem grátis/sem
cadastro). Há um safety unlock de 4s para a página nunca ficar em branco.

**Mantido:** todo o sistema de auth (login, cadastro, papéis, reset/troca de
senha) continua funcional para quem quiser entrar; a separação de níveis de
acesso (admin × convidado) é aplicada por `applyRoleVisibility`.
