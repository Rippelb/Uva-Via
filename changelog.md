# 🍇 Uva & Via - Changelog

Todas as mudanças notáveis seguem o formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e versionamento semântico [SemVer](https://semver.org/lang/pt-BR/).

---

## [0.5.1] - 2026-06-19 - Sprint final: guest-first e robustez do fluxo crítico

Foco total no **fluxo crítico** (gerar roteiro → reservar) funcionando ponta a
ponta, verificado ao vivo via Chrome headless (DevTools Protocol). Achados de uma
revisão adversarial multi-agente (21 confirmados) foram corrigidos.

### Corrigido
- **Guest-first (crítico):** o app não nasce mais travado atrás do login. Antes,
  com backend no ar e sem sessão, `onAuthChange(null)` travava a página e abria o
  login - deixando o fluxo central (100% client-side) inacessível numa demo.
  Agora o visitante usa tudo como convidado; login segue no botão "Entrar";
  Gestão some para convidado; troca de senha obrigatória de admin ainda trava.
  Safety unlock (4s) impede página em branco se o bootstrap travar.
- **Service worker network-first** (+ cache v2): nunca serve asset velho após deploy.
- **Geração de roteiro robusta:** descarta experiências órfãs (evita crash em
  `stop.vin`), guarda divisão por zero (days/pessoas), estado vazio amigável
  quando o catálogo está vazio, `timeToMin` defensivo e restauração de plano do
  localStorage em try/catch.
- **Reserva robusta:** limpa seleção se o horário some pelo tick; valida
  vagas ≥ pessoas (anti-overbooking); ICS com escaping RFC 5545.
- **Backend path:** fallbacks em mapHorario/mapExperiencia e reset de select
  inválido após carga da API.
- **Acessibilidade/mobile:** focus trap + retorno de foco no modal do comprovante;
  touch target de 44px no voto "útil"; estado desabilitado mais legível.

### Adicionado
- Seção **"Como funciona"** (onboarding em 3 passos) e meta tags **Open Graph/Twitter**.

---

## [0.5.0] - 2026-06-17 - Repaginação: confiança, logística, favoritos e PWA

Repaginação guiada por pesquisa de mercado (concorrentes BR/intl., Reclame Aqui)
e por uma análise de risco de negócio. Evolução da base - sem reescrita. Docs de
apoio: `pesquisa-mercado.md`, `pesquisa-mercado-extensiva.md`, `analise-negocio.md`.

### Adicionado
- **Logística & transporte com "motorista da rodada"** (`js/transporte.js`): bloco
  no roteiro com 3 modos (carro próprio, motorista por app, transfer/agência),
  orientação de motorista sóbrio, rodízio entre dias, estimativa de custo de app e
  faixa de transfer. Diferencial nascido da pesquisa (dirigir após degustar é a
  maior dor do passeio) - nenhum concorrente trata bem.
- **Favoritos / lista de desejos** (`js/favoritos.js`): coração nos cards
  (boutique, sugestões, catálogo, perfil), seção dedicada, contador no menu e sync
  entre abas.
- **Comprovante/voucher de reserva** (`js/comprovante.js`): modal com código,
  endereço, contato, o que está incluído, o que levar e política de cancelamento;
  abre na confirmação. Modal genérico reutilizável.
- **Política de cancelamento transparente** (flex 24h / moderada 48h): visível
  antes de reservar, no perfil da vinícola e no comprovante; cancelamento informa
  o reembolso conforme o prazo. Ataca a reclamação nº1 do setor.
- **Rota real no Google Maps** + "Como chegar" por parada no mapa.
- **Lembrete da próxima visita** (`js/lembrete.js`): banner para reservas de
  hoje/amanhã com link ao comprovante.
- **Roteiros prontos** (`js/roteiros-prontos.js`): 6 temas que pré-preenchem o
  wizard e geram o roteiro em 1 clique.
- **Reviews turbinadas**: selo "visita verificada", voto "útil" com contador e
  filtro "Mais úteis".
- **Filtros de catálogo por comodidade** (pet, crianças, acessível, vegetariano,
  restaurante, grupos) + chip "Favoritos".
- **PWA**: `manifest.webmanifest`, `icon.svg`, `sw.js` (offline) e `js/pwa.js`
  (instalar o app).
- **Reserva honesta**: enquadrada como "solicitação" pendente de confirmação da
  vinícola, com captura de e-mail/WhatsApp e nota de "vagas estimadas".
- **Seção "Para vinícolas" (B2B)** + **newsletter** no rodapé (`js/parcerias.js`):
  torna o modelo de receita visível e captura leads/inscrições.
- **Dados enriquecidos** (`js/dados-extra.js`): endereço, telefone e comodidades
  por vinícola; inclusões e "o que levar" derivados das tags.

### Mudado
- Mappers do `api-client.js` preservam enriquecimento por lookup no seed
  (`SEED_VINICOLAS`/`SEED_EXPERIENCIAS`), corrigindo a perda de `tipo`/`tone`/
  comodidades quando o backend carrega o catálogo.
- Reserva agora guarda `codigo`, `vinicola_id`, `experiencia_id`, `endereco`,
  `telefone`, `contato` e `cancelamento`.
- Copy do agendamento ajustada de "confirmamos na hora" para o fluxo de solicitação.

### Novos storages
- `uvaevia.favoritos`, `uvaevia.transporte.modo`, `uvaevia.avaliacoes.uteis`,
  `uvaevia.leads.vinicolas`, `uvaevia.newsletter`.

---

## [0.4.1] - 2026-05-22 (noite) - Algoritmo v2 e Timeline v2

### Adicionado
- **Algoritmo de geração de roteiro v2**:
  - Novo fator: avaliação média da vinícola pesa no scoring (≥4.5 = +3, ≥4.0 = +2, ≥3.5 = +1,
    com `total ≥ 3` mínimo para evitar viés de poucas reviews).
  - PRNG com seed (Mulberry32) inline - botão **"Gerar nova variação"** regenera o roteiro com
    o mesmo input mas seed diferente.
  - **Rationale por parada**: motivos da escolha exibidos por baixo de cada experiência,
    com toggle global ("Mostrar critérios / Ocultar critérios").
  - **Ordenação geográfica intradiária**: dentro de cada dia, paradas reorganizadas por
    nearest-neighbor a partir da primeira (reduz deslocamento real).
  - **Chegada/saída por parada** calculadas a partir do horário inicial + duração + deslocamento.
  - **Sumário narrativo** ("Roteiro de 2 dias com foco em degustações premium…") acima do roteiro.
  - Penalidade de -1pt para experiências >1.5× o orçamento por parada.

- **Timeline da rota v2**:
  - Cabeçalho do dia ativo: janela (chegada→saída), nº paradas, duração, km.
  - Distância em km exibida no conector de deslocamento entre paradas.
  - **Sugestão automática de almoço** quando gap cai dentro de 12h-14h e dura ≥30min,
    a menos que uma das paradas já seja harmonizada.
  - **Chegada → Saída** mostrados em cada parada (substituindo só "horário sugerido").
  - **Motivo curto** abaixo da experiência na timeline ("combina com piquenique · clima a dois").
  - **Compartilhar via URL** (`#roteiro=base64(JSON)`, `navigator.share` no mobile,
    clipboard no desktop) + auto-restore no load.
  - **Exportar agenda** como `.ics` multi-evento (todas as paradas pontuadas com data/hora).
  - **Imprimir** com `@media print` otimizado - esconde tudo exceto Roteiro/Mapa,
    `page-break-inside: avoid` em cards e separadores.

### Mudado
- `plano` agora carrega `distanciaTotalKm`, `sumario`, `seed`; cada `stop` ganha
  `chegada`, `saida`, `distanciaKm`, `motivos`.
- Resumo do mapa exibe nova métrica de distância quando disponível.

---

## [0.4.0] - 2026-05-22 - Avaliações, real-time, reservas v2

### Adicionado
- **Avaliações de usuários** (épico inteiro):
  - Nova seção `#avaliacoes` com feed da comunidade, média geral, total e cards (autor inicial,
    perfil do visitante, vinícola, experiência, comentário e data).
  - Filtros (todas / 5 / 4+ / recentes) no estilo dos chips do admin.
  - Formulário inline dentro de cada reserva passada: picker de 1-5 estrelas (FA),
    textarea limitada a 320 chars, validação antes de enviar.
  - Persistência em `localStorage` (`uvaevia.avaliacoes`) + sync entre abas.
  - 12 avaliações seed para a comunidade não nascer vazia.
  - Bloco de reviews dentro do perfil da vinícola (média + 4 mais recentes).
  - Badge de média (estrela âmbar + nota + total) em cards de Boutique, Sugestões, Experiências.
  - Hero stat "nota média" agora calcula a média real (substitui mock 4.9).
- **Disponibilidade em tempo real** (tick simulado):
  - Decremento aleatório de 0-2 vagas a cada 45s (parece outros visitantes reservando).
  - Pausa quando aba fica oculta (Page Visibility API).
  - Timestamp "Atualizado há Xs" em sugestões e slots, refrescado a cada 5s.
  - Animação `.is-updated` nos slots que mudaram durante a sessão.
- **Sistema de reservas v2**:
  - Status derivado (Pendente nas primeiras 2h → Confirmada → Realizada → Cancelada).
  - Agrupamento por bucket temporal (Hoje / Amanhã / Esta semana / Em breve / Histórico).
  - Botão "Agenda" gera `.ics` baixável (compatível com Google/Apple/Outlook).
  - Botão "Avaliar" após data passar (abre form inline).
  - Confirm dialog padrão do navegador antes de cancelar.
  - Reservas canceladas mantidas no histórico mas excluídas do total.
- **Sugestões do dia v2**:
  - Filtros temporais: Hoje · Amanhã · Fim de semana · Todas.
  - Motivo personalizado por tag ("A luz dourada cai sobre os vinhedos…").
  - Fallback elegante quando o filtro estrito não traz nada.
  - Badge de média de avaliações no card.

### Mudado
- Spy de scroll inclui `#avaliacoes`, ativando o link na nav.
- `api-client.js` invoca `renderAvaliacoes()` no bootstrap pós-API (mesma forma de
  `renderSugestoes`/`renderBoutique`).
- Reserva agora armazena `criadaEm` e `cancelada` para alimentar o status derivado.

---

## [Não publicado] - 2026-05-15 (noite)

### Corrigido
- **Bug crítico**: atributo `hidden` era ignorado em elementos com `display: flex/grid`
  (summary, slots-block, nav-menu, vinicola-section etc). Resolvido com regra global
  `[hidden] { display: none !important; }`. Sintoma visível: o summary do form de reserva
  aparecia com valores "-" mesmo antes de selecionar experiência.

### Adicionado
- **Drawer lateral animado** no mobile: slide-in da direita com gradient bordô profundo,
  backdrop com blur, stagger animation nos itens, scroll lock no body.
- **Ícones nos itens do menu** (visíveis só no drawer mobile, escondidos no desktop).
- **Hero animada**:
  - Camada de gradientes radiais orbitando lentamente (`heroOrbit` 18s loop).
  - 4 ícones decorativos flutuando (`fa-wine-glass`, `fa-wine-bottle`, `fa-leaf`).
  - Shimmer sutil no título via `background-clip: text`.
  - Vinheta radial e brand-mark com micro-tilt periódico.
- **Transições suaves entre seções** via gradient backgrounds (fade da cor anterior nos
  primeiros ~100-120px de cada seção).
- **Verde/oliva nos destaques estratégicos**:
  - "Valor total estimado" agora em gradient oliva (era bordô).
  - "Próxima visita" com header em gradient oliva e linha pulsante no topo.
  - Tab ativa do mapa com bordô + bullet oliva pulsante.
  - Marker do mapa com anel oliva sutil.
  - Budget gauge com shimmer animado sobre o preenchimento.

### Mudado
- `overflow: hidden` + `position: relative` em todas as sections (contém decorações).
- `min-width: 0` em `form-grid`, `form-field`, `summary-row` etc para evitar overflow horizontal.
- `overflow-wrap: anywhere` em valores longos do summary.
- `font-size: clamp()` no valor total estimado (escala em telas muito pequenas).
- Breakpoint adicional ≤380px com paddings ainda mais compactos.

### Removido
- Decoração CSS `mapa-deslocamento::before` que usava emoji car → trocada por `<i class="fa-car-side">`.

---

## [0.3.0] - 2026-05-15 (tarde) (commit 20e998e)
- **Font Awesome 6.5** substituindo todos os emojis da interface (paleta consistente bordô/oliva).
- **Validação client-side completa** em todos os formulários:
  - Data mínima = hoje (planejamento de viagem e cadastro de horários).
  - Números positivos com `min` e mensagens de erro inline.
  - Feedback visual com classe `.is-invalid` e `<small class="form-error">` por campo.
- **CRUD de Vinícolas** no admin (subtab Vinícolas):
  - Nome, cidade, tipo (boutique/grande), descrição, paleta do cover, duração média, faixa de preço.
  - Validação contra nomes duplicados.
  - Persistência em `localStorage` (`uvaevia.vinicolas.custom`).
  - Lista visual com cover, badge custom/catálogo e ações ver/excluir.
- **Modo "Faixa de horários"** no admin de horários:
  - Seleciona data início/fim, hora inicial/final, intervalo (30min/1h/1h30/2h/3h).
  - Preview ao vivo de quantos slots serão criados.
  - Geração de múltiplos slots em uma submissão.
- **Subtabs internas** na Gestão (Horários | Vinícolas).
- **Re-mapeamento automático** das datas do seed para futuro relativo a hoje (demo nunca expira).
- `populateVinicolaSelects()` global, sincroniza b-vinicola / exp-vinicola / m-vinicola após qualquer mudança.
- `getAllVinicolas()` combina catálogo + custom (espelha `getAllHorarios()`).
- Botões com ícones (Font Awesome) - classe `.btn-icon` para espaçamento.
- Arquivos de documentação: `backlog.md`, `changelog.md`.

### Mudado
- **Scrollbar global oculta** via `scrollbar-width: none` + `::-webkit-scrollbar { display: none; }` mantendo scroll funcional.
- **Selects estilizados** com caret SVG bordô, options com hover bege/bordô, estados disabled diferenciados.
- **Mapa-deslocamento** usa `<i class="fa-car-side">` em vez de seta CSS pseudo-elemento.
- README.md reorganizado com seções mais limpas, badges atualizados.
- `api-client.js`: removida lógica duplicada de populate, agora chama `window.populateVinicolaSelects()`.
- VINICOLAS, EXPERIENCIAS lookup no front passou a usar `getAllVinicolas()` para considerar custom.

### Corrigido
- Variável `initial` não utilizada em `renderVinicolaPerfil()` removida (TS6133).
- Tags do `data-mode` em formulários multi-modo ficavam com `required` mesmo escondidas - agora `disabled` quando hidden.

---

## [0.2.0] - 2026-05-15 (commit 530341a)

### Adicionado
- **Mobile-first**: refator completo do `style.css` (base mobile, breakpoints `min-width` em 600/720/860/900/960).
- Tokens de espaçamento (`--space-1` a `--space-8`).
- Touch-targets de 44px (`--touch`).
- Tipografia premium: **Cormorant Garamond** + **Inter**.
- **Busca global** no hero com dropdown debounced (vinícolas + experiências).
- **Sugestões do dia**: 6 cards curados por tag (piquenique, premium, tour, etc).
- **Vinícolas boutique em destaque**: cards clicáveis com cover gradient.
- **Seção `#roteiro`** dedicada (saiu de inline):
  - Cards de meta (dias, paradas, tempo total, deslocamento, custo).
  - Badges de tags.
  - Gauge de orçamento.
  - Cards de parada com botões "Ver vinícola" e "Reservar".
  - Badges de disponibilidade (livre/quase cheio/lotado).
  - Botão "Editar roteiro".
- **Seção `#vinicola`**: perfil com cover, descrição, meta, experiências, horários clicáveis.
- **Seção `#mapa`**: visão resumida, tabs por dia, timeline vertical com marcadores numerados.
- **Reservas**: card "Valor total estimado" destacado, botões "Editar roteiro" / "Adicionar experiência".
- Algoritmo de scoring com peso por tag direta (+6), keyword (+3), perfil (+2), vagas, orçamento.
- Cálculo de **deslocamento** via Haversine + 45 km/h média.
- Persistência do plano em `localStorage` (`uvaevia.plano.atual`).
- Documentação: `context.md`, `decisoes.md`, `logs.md`, `README.md`.

### Mudado
- `api-client.js`: `mapVinicola` / `mapExperiencia` preservam `tipo`, `tone`, `tags` do fallback.
- Nav inclui Roteiro / Vinícola / Mapa (visíveis sob demanda após gerar roteiro).

---

## [0.1.0] - 2026-04-15 (commit 4fd87d9)

### Adicionado
- Backend PHP 8 + MySQL com 10 endpoints PDO:
  - `vinicolas`, `experiencias`, `horarios`, `reservas`, `roteiros`
  - `perfis`, `tags`, `categorias`, `visitantes`
- Schema MySQL com FKs, índices e seed do Vale dos Vinhedos.
- Cliente JS (`api-client.js`) com fallback para dados embutidos.
- Algoritmo de geração de roteiro server-side em `roteiros.php`.

---

## [0.0.2] - 2026-03-25

### Adicionado
- Catálogo de experiências com filtros (busca, vinícola, ordenação).
- Gestão de horários (admin) com CRUD em localStorage.
- Geração de roteiro v1 (client-side, scoring básico).

---

## [0.0.1] - 2026-02-28 - Primeira versão

### Adicionado
- Estrutura base do site (hero, planner, footer).
- Paleta enoturística inicial (bordô, bege, oliva).
- Formulário de reserva com slots de horário.
- Seção de diferenciais com 4 cards.
- Rodapé com explorar/contato.
