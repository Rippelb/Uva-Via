# 📜 Uva & Via - Logs de Desenvolvimento

Registro cronológico das mudanças significativas no projeto.

> Formato: `[YYYY-MM-DD] [autor]` Resumo da mudança.
> Para changelog versionado em SemVer, ver [changelog.md](changelog.md).

---

## 2026-06-19 - Sprint final: guest-first + robustez do fluxo crítico (verificado ao vivo)

Sprint de fechamento com foco no **fluxo crítico do MVP** (gerar roteiro → reservar)
para a apresentação. Verificação ao vivo via Chrome headless (DevTools Protocol):
home renderiza, gerar roteiro → 6 paradas → mapa → reserva → comprovante, favoritos
e roteiro pronto, **sem erros de console**. Edge cases (0 interesses, orçamento 0,
1 dia, explorador, 5 dias, regenerar, catálogo vazio) todos verdes.

- **Guest-first (correção crítica):** o fluxo central deixou de ficar atrás do muro
  de login (ver `decisoes.md` D-24). Service worker passou a network-first.
- **Revisão adversarial multi-agente** (21 achados confirmados de 40) → correções de
  robustez na geração de roteiro, reserva (anti-overbooking, slots), caminho com
  backend (mappers) e acessibilidade (focus trap, touch targets).
- **Onboarding "Como funciona"** + meta tags **Open Graph/SEO**.

---

## 2026-06-17 - Repaginação guiada por pesquisa (confiança, logística, favoritos, PWA)

Repaginação evolutiva (sem reescrita) a partir de pesquisa de mercado e análise de
risco de negócio. Documentos: `pesquisa-mercado.md`, `pesquisa-mercado-extensiva.md`
(dados/fontes/experts + output em 11 skills) e `analise-negocio.md`.

### Produto / persona
- **Motorista da rodada / transporte** - atende a maior dor real do Vale (vinícolas
  distantes + Lei Seca). Bloco no roteiro com 3 modos e dicas práticas.
- **Confiança na reserva** - comprovante com código/endereço/contato/inclusões,
  política de cancelamento clara (flex/moderada) e reserva enquadrada como
  "solicitação" pendente de confirmação. Ataca a reclamação nº1 do setor.
- **Favoritos**, **roteiros prontos (1 clique)**, **rota no Google Maps**,
  **lembrete da visita**, **reviews verificadas + voto útil**, **filtros por
  comodidade** e **PWA instalável/offline**.

### Negócio
- **Seção "Para vinícolas" (B2B)** e **newsletter** mitigam os riscos de receita e
  retenção apontados em `analise-negocio.md`.

### Técnico
- Novos módulos em `js/`: `dados-extra`, `favoritos`, `transporte`, `comprovante`,
  `lembrete`, `roteiros-prontos`, `parcerias`, `pwa`. Mappers do `api-client`
  passam a preservar campos de enriquecimento via snapshot do seed.

---

## 2026-05-22 (noite) - Algoritmo v2 e Timeline v2

### Algoritmo de geração de roteiro v2
- **Novo fator de scoring**: avaliação média da vinícola - bem avaliada (≥4.5/5 e ≥3 reviews)
  ganha +3 pts, ≥4.0 ganha +2, ≥3.5 ganha +1. Reaproveita a base de avaliações da feature
  entregue mais cedo nesta data.
- **PRNG com seed (Mulberry32)** - adiciona variabilidade controlada. Botão **"Gerar nova variação"**
  cria roteiros diferentes a partir do mesmo input, sem mexer nas preferências.
- **Rationale por escolha** (motivos): cada parada agora explica por que foi sugerida
  ("combina com piquenique · clima a dois · nota 4.8 entre visitantes"). Toggle no roteiro
  exibe/oculta todos os critérios de uma vez.
- **Ordenação geográfica intradiária** - dentro de cada dia, paradas são ordenadas pela menor
  distância até a parada anterior (nearest-neighbor). Reduz deslocamento real.
- **Cálculo de chegada/saída por parada** - a partir do horário sugerido inicial, o algoritmo
  calcula `chegada` e `saida` reais considerando duração e deslocamento.
- **Sumário narrativo** - frase curta acima do roteiro descrevendo o que o conjunto entrega
  ("Roteiro de 2 dias com foco em degustações premium e pôr do sol nas serras…").
- **Bonus**: penaliza experiências muito acima do orçamento (`>1.5x budget per stop`) com -1pt.

### Timeline da rota v2
- **Cabeçalho do dia ativo** com 4 stats: janela do dia (primeira chegada → última saída),
  número de paradas, duração do dia, e km totais do dia.
- **Distância em km por trecho** ao lado do tempo de deslocamento ("12min · 8.4 km até Cave Geisse").
- **Sugestão de almoço automática** - quando o gap entre duas paradas cai dentro de 12h-14h
  e dura ≥30min, insere card "Pausa sugerida - almoço" entre elas. Não duplica se uma das
  paradas já é harmonizada.
- **Chegada → Saída** visíveis em cada parada da timeline (não só horário sugerido).
- **Compartilhar roteiro via URL** - encode base64 do input em `#roteiro=…`, usa
  `navigator.share` no mobile ou copia para clipboard no desktop. Hash decodificado no load
  regenera o roteiro automaticamente.
- **Exportar agenda (.ics multi-evento)** - gera um único arquivo com todas as paradas
  pontuadas com data/hora; compatível com Google/Apple/Outlook.
- **Imprimir roteiro** - `@media print` agora esconde tudo exceto roteiro+mapa, adiciona
  `page-break-inside: avoid` em cards e separadores para um PDF nativo organizado.

### Infra
- `Mulberry32` (PRNG) implementado inline em [generateRoteiro](script.js#L735-L745).
- `tryRestorePlanoFromHash()` no init, antes de cair para `loadPlan()` (localStorage).
- Texto narrativo escrito de forma a soar natural por idioma, com fallback "experiências variadas".

---

## 2026-05-22 - Avaliações, real-time, reservas v2 e sugestões filtráveis

### Avaliações de usuários (nova feature)
- Nova seção `#avaliacoes` com feed da comunidade - média geral, total, estrelas,
  e cards com avatar/inicial, perfil do visitante, vinícola, experiência, comentário e data.
- **Filtros**: Todas · 5 estrelas · 4+ estrelas · Mais recentes (chips no mesmo estilo do admin).
- **Formulário inline** dentro de cada reserva passada - picker de 1 a 5 estrelas (FA `fa-star`),
  textarea com limite de 320 caracteres, validação de nota mínima antes de habilitar envio.
- **Persistência em localStorage** (`uvaevia.avaliacoes`) + 12 avaliações seed para a comunidade
  não nascer vazia. Após avaliar, a reserva ganha selo "Você já avaliou esta experiência".
- **Bloco de avaliações no perfil da vinícola** - mostra média + estrelas + 4 reviews mais recentes,
  ou empty state convidativo.
- **Badge de média** nos cards de Boutique, Sugestões e Experiências (estrela âmbar + nota + total).
- Hero stat "nota média" agora calcula a média real das avaliações (substitui mock 4.9).

### Disponibilidade em tempo real (aprimorado)
- **Tick simulado** a cada 45s: decrementa 1-2 vagas aleatórias para dar sensação de "outros visitantes reservando".
- **Pausa quando aba não está visível** (Page Visibility API) - economia de processamento.
- **Timestamp "Atualizado há X"** em todas as superfícies de disponibilidade (sugestões, slots),
  refrescado a cada 5s sem causar re-render.
- Live dot já existente nas sugestões e no formulário de reserva, agora alimentado pelo tick global.
- Slots animam (`.is-updated`) quando o número de vagas muda durante a sessão do usuário.

### Sistema de reservas v2
- **Status derivado**: Pendente (primeiras 2h) → Confirmada → Realizada → Cancelada (pill colorida).
- **Agrupamento por bucket temporal**: Hoje · Amanhã · Esta semana · Em breve · Histórico -
  cada grupo com header serif itálico e contagem.
- **Ações inline por reserva**: "Agenda" (gera `.ics` baixável para Google/Apple/Outlook),
  "Avaliar" (após data passar - abre formulário inline), "Cancelar" (confirm dialog antes).
- Reservas canceladas mantidas no histórico mas excluídas da soma do valor total.
- Confirm dialog padrão do navegador antes de cancelar - evita perda acidental.

### Sugestões do dia (aprimorado)
- **Filtros temporais**: Hoje · Amanhã · Fim de semana · Todas (chips no estilo do admin).
- **Motivo personalizado** por sugestão - frase explicando porque essa experiência foi recomendada
  (ex.: "A luz dourada cai sobre os vinhedos - momento icônico" para `por-do-sol`).
- **Badge de média** em cada card (estrela + nota + total de avaliações).
- **Fallback elegante** quando o filtro estrito não traz nada - botão "Ver todas" inline.

### Infra
- Funções globais expostas em `window` (`renderAvaliacoes`) para o `api-client.js` re-renderizar
  pós-bootstrap.
- Sync entre abas adicionado para `STORAGE_AVAL` - avaliar numa aba atualiza a outra.
- Spy de scroll inclui `#avaliacoes` para destacar o link na nav.
- IDs altos (>=1000) continuam reservados para custom data local - coexistência com seed/backend.

---

## 2026-05-15 (tarde) - Polimento UX + Admin

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

## 2026-05-15 (manhã) - Sprint Mobile-first + Features novas

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
- Substituição do `Georgia` genérico - visual mais alinhado a apps de viagem premium.

### Navegação
- Adicionados links: Roteiro · Vinícola · Mapa (visíveis sob demanda após gerar roteiro).
- Drawer mobile com hamburger animado e `aria-expanded` atualizado.
- Active link via `IntersectionObserver` cobrindo todas as seções (incluindo as novas).

### Home - novas seções
- **Hero com busca global** (vinícolas + experiências, dropdown debounced 150ms).
- **Sugestões do dia**: 6 experiências curadas por tag (piquenique, premium, tour,
  harmonizado, pôr do sol, intimista), evita repetir vinícola.
- **Vinícolas boutique em destaque**: cards clicáveis com cover gradient personalizado
  (`tone-a` a `tone-e`), abrem o perfil da vinícola.

### Página da Vinícola (`#vinicola`) - nova seção
- Cover com gradiente customizável por vinícola.
- Bloco de meta: duração média, faixa de preço, número de experiências.
- Lista de experiências com badges de disponibilidade.
- **Botões de horário direto** que pré-preenchem o formulário de reserva.

### Mapa / Rota (`#mapa`) - nova seção
- **Visão resumida da rota**: tempo total, deslocamento, paradas, saída sugerida.
- Tabs por dia com scroll horizontal no mobile.
- **Timeline vertical** com marcadores numerados, conector visual entre paradas,
  badges de disponibilidade e info de deslocamento (calculado por haversine).
- Estado vazio amigável quando ainda não há roteiro.
- Persistência do plano atual em `localStorage` (`uvaevia.plano.atual`).

### Roteiro Sugerido (`#roteiro`) - promovido a seção própria
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

## 2026-04-15 - Backend PHP/MySQL (commit anterior)

- Criados 10 endpoints PHP: vinicolas, experiencias, horarios, reservas, roteiros,
  perfis, tags, categorias, visitantes.
- Schema MySQL com integridade referencial e seed do Vale dos Vinhedos.
- Cliente JS (`api-client.js`) com fallback para dados embutidos quando a API falha.
- Algoritmo de roteiro server-side via `roteiros.php`.

## 2026-03-25 - Catálogo, Gestão e Roteiro v1

- Tela de catálogo de experiências com filtros e ordenação.
- Tela de gestão de horários (admin) com CRUD em localStorage.
- Geração de roteiro v1 (apenas client-side, scoring básico).

## 2026-03-10 - Reservas, Diferenciais e Rodapé

- Formulário de reserva com slots de horário.
- Seção de diferenciais com 4 cards.
- Rodapé com explorar/contato.

## 2026-02-28 - Setup inicial

- Estrutura base do site (hero, planner, footer).
- Paleta enoturística (bordô, bege, oliva).
