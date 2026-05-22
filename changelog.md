# 🍇 Uva & Via — Changelog

Todas as mudanças notáveis seguem o formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e versionamento semântico [SemVer](https://semver.org/lang/pt-BR/).

---

## [0.4.0] — 2026-05-22 — Avaliações, real-time, reservas v2

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

## [Não publicado] — 2026-05-15 (noite)

### Corrigido
- **Bug crítico**: atributo `hidden` era ignorado em elementos com `display: flex/grid`
  (summary, slots-block, nav-menu, vinicola-section etc). Resolvido com regra global
  `[hidden] { display: none !important; }`. Sintoma visível: o summary do form de reserva
  aparecia com valores "—" mesmo antes de selecionar experiência.

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

## [0.3.0] — 2026-05-15 (tarde) (commit 20e998e)
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
- Botões com ícones (Font Awesome) — classe `.btn-icon` para espaçamento.
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
- Tags do `data-mode` em formulários multi-modo ficavam com `required` mesmo escondidas — agora `disabled` quando hidden.

---

## [0.2.0] — 2026-05-15 (commit 530341a)

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

## [0.1.0] — 2026-04-15 (commit 4fd87d9)

### Adicionado
- Backend PHP 8 + MySQL com 10 endpoints PDO:
  - `vinicolas`, `experiencias`, `horarios`, `reservas`, `roteiros`
  - `perfis`, `tags`, `categorias`, `visitantes`
- Schema MySQL com FKs, índices e seed do Vale dos Vinhedos.
- Cliente JS (`api-client.js`) com fallback para dados embutidos.
- Algoritmo de geração de roteiro server-side em `roteiros.php`.

---

## [0.0.2] — 2026-03-25

### Adicionado
- Catálogo de experiências com filtros (busca, vinícola, ordenação).
- Gestão de horários (admin) com CRUD em localStorage.
- Geração de roteiro v1 (client-side, scoring básico).

---

## [0.0.1] — 2026-02-28 — Primeira versão

### Adicionado
- Estrutura base do site (hero, planner, footer).
- Paleta enoturística inicial (bordô, bege, oliva).
- Formulário de reserva com slots de horário.
- Seção de diferenciais com 4 cards.
- Rodapé com explorar/contato.
