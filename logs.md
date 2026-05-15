# 📜 Uva & Via — Logs de Desenvolvimento

Registro cronológico das mudanças significativas no projeto.

> Formato: `[YYYY-MM-DD] [autor]` Resumo da mudança.
> Para changelog versionado em SemVer, ver [changelog.md](changelog.md).

---

## 2026-05-15 (tarde) — Polimento UX + Admin

### Iconografia
- Substituídos **todos os emojis** por Font Awesome 6.5 (CDN): brand, hero search, sugestões,
  diferenciais, empty states, meta de cards, deslocamento no mapa.
- Adicionada classe utilitária `.btn-icon` para espaçamento em botões com ícone à esquerda.

### Validação de inputs
- Helper `setFieldError(input, msg)` / `clearFieldError(input)` + classe `.is-invalid`.
- Campos com `<small class="form-error" id="X-error">` mostram mensagem inline.
- Data início (planejamento) e data (horários admin) com `min={today}` aplicado no init e
  refrescado a cada 30 min.
- Validação contra datas passadas, números negativos, nomes duplicados de vinícolas.

### Admin / Gestão repaginada
- **Subtabs internas:** Horários | Vinícolas (cada uma com seu form e listagem).
- **Modo "Faixa de horários"**: cadastra vários slots de uma vez (data início/fim × hora início/fim
  com intervalo configurável). Preview ao vivo de quantos slots e capacidade total.
- **CRUD de vinícolas** novo: nome, cidade, tipo, descrição, paleta do cover, duração e preço.
  Persistência em `localStorage` (`uvaevia.vinicolas.custom`).
- Tabela visual de vinícolas com cover gradient, badge custom/catálogo e botões ver/excluir.
- Novo `getAllVinicolas()` unificando catálogo + custom em todas as listagens.
- `populateVinicolaSelects()` repopula `b-vinicola`, `exp-vinicola`, `m-vinicola` consistentemente.

### Scrollbar
- Escondida globalmente (`html`/`body`) via `scrollbar-width: none` + `::-webkit-scrollbar`.
- Scroll segue funcional; containers internos que precisam mostrar barra usam classe `.scrollable-inner`.

### Selects
- Caret custom em SVG bordô embutido no `background-image` (sem dependência externa).
- Estado disabled com caret cinza, cursor `not-allowed`.
- `option:checked` pintada em bege/bordô.
- `padding-right: 2.5rem` para não cobrir o caret com o texto.

### Datas do demo
- Re-mapeamento automático das datas do seed para `hoje + 3,4,5,...` em runtime.
  Demo nunca expira.

### Docs
- Criados `backlog.md` e `changelog.md`.

---

## 2026-05-15 (manhã) — Sprint Mobile-first + Features novas

### Refatoração mobile-first
- Reescrita do `style.css` com abordagem **mobile-first** (base = mobile,
  breakpoints `min-width` progressivos: 600 / 720 / 860 / 900 / 960).
- Tokens de espaçamento (`--space-1` a `--space-8`) e variável `--touch: 44px`
  garantindo touch-targets adequados em todos os elementos clicáveis.
- Inputs com `font-size: 16px` para evitar zoom automático no iOS.
- Adicionado `viewport-fit=cover`, `theme-color`, e `inputmode` em campos numéricos/busca.
- Skip-link para conteúdo + respeito a `prefers-reduced-motion`.

### Tipografia
- Adicionadas Google Fonts: **Cormorant Garamond** (serif itálico premium) e **Inter** (UI sans).
- Substituição do `Georgia` genérico — visual mais alinhado a apps de viagem premium.

### Navegação
- Adicionados links: Roteiro · Vinícola · Mapa (visíveis sob demanda após gerar roteiro).
- Drawer mobile com hamburger animado e `aria-expanded` atualizado.
- Active link via `IntersectionObserver` cobrindo todas as seções (incluindo as novas).

### Home — novas seções
- **Hero com busca global** (vinícolas + experiências, dropdown debounced 150ms).
- **Sugestões do dia**: 6 experiências curadas por tag (piquenique, premium, tour,
  harmonizado, pôr do sol, intimista), evita repetir vinícola.
- **Vinícolas boutique em destaque**: cards clicáveis com cover gradient personalizado
  (`tone-a` a `tone-e`), abrem o perfil da vinícola.

### Página da Vinícola (`#vinicola`) — nova seção
- Cover com gradiente customizável por vinícola.
- Bloco de meta: duração média, faixa de preço, número de experiências.
- Lista de experiências com badges de disponibilidade.
- **Botões de horário direto** que pré-preenchem o formulário de reserva.

### Mapa / Rota (`#mapa`) — nova seção
- **Visão resumida da rota**: tempo total, deslocamento, paradas, saída sugerida.
- Tabs por dia com scroll horizontal no mobile.
- **Timeline vertical** com marcadores numerados, conector visual entre paradas,
  badges de disponibilidade e info de deslocamento (calculado por haversine).
- Estado vazio amigável quando ainda não há roteiro.
- Persistência do plano atual em `localStorage` (`uvaevia.plano.atual`).

### Roteiro Sugerido (`#roteiro`) — promovido a seção própria
- Saiu do `#roteiro-output` inline dentro do planner; agora é seção navegável.
- **Cards de paradas** com botões "Ver vinícola" e "Reservar" por parada.
- **Tags badges** resumindo as experiências do roteiro.
- **Badge de disponibilidade** por parada (livre/quase cheio/lotado).
- Cards de meta agora incluem **tempo total** e **deslocamento** (não só custo).
- Botão "Editar roteiro" rola direto para o wizard.

### Reservas
- Card "Valor total estimado" destacado com gradiente bordô.
- **Botões "Editar roteiro" e "Adicionar experiência"** aparecem quando há reservas.

### Algoritmo
- Scoring agora considera tags diretas (não só keywords): +6 por tag direta,
  +3 por keyword no texto, +2 por match de perfil de viagem.
- Cálculo de **deslocamento** entre paradas via haversine (45 km/h média).
- **Tempo total** = soma das durações + deslocamentos.

### API client
- `mapVinicola` agora preserva `tipo`, `tone`, `latitude`, `longitude` do fallback
  quando o backend não fornece esses campos.
- `mapExperiencia` preserva `tags` (slugs) do fallback para o scoring funcionar.
- Adicionados `renderSugestoes()` e `renderBoutique()` ao hook de bootstrap pós-API.

### Documentação
- Criados: `context.md`, `logs.md`, `decisoes.md`, `README.md`.

---

## 2026-04-15 — Backend PHP/MySQL (commit anterior)

- Criados 10 endpoints PHP: vinicolas, experiencias, horarios, reservas, roteiros,
  perfis, tags, categorias, visitantes.
- Schema MySQL com integridade referencial e seed do Vale dos Vinhedos.
- Cliente JS (`api-client.js`) com fallback para dados embutidos quando a API falha.
- Algoritmo de roteiro server-side via `roteiros.php`.

## 2026-03-25 — Catálogo, Gestão e Roteiro v1

- Tela de catálogo de experiências com filtros e ordenação.
- Tela de gestão de horários (admin) com CRUD em localStorage.
- Geração de roteiro v1 (apenas client-side, scoring básico).

## 2026-03-10 — Reservas, Diferenciais e Rodapé

- Formulário de reserva com slots de horário.
- Seção de diferenciais com 4 cards.
- Rodapé com explorar/contato.

## 2026-02-28 — Setup inicial

- Estrutura base do site (hero, planner, footer).
- Paleta enoturística (bordô, bege, oliva).
