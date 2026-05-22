# 🍇 Uva & Via — Backlog

Pendente, em progresso e concluído. Inspirado nos cards Trello do MVP +
ideias que surgiram durante o desenvolvimento.

> Legenda: ✅ feito · 🔄 em progresso · ⏸ pausado · 📋 a fazer

---

## 🎯 Sprint atual

| # | Story | Epic | Status |
|---|---|---|---|
| 24 | CRUD de vinícolas (admin) | Infra | ✅ |
| 26 | Gestão de horários — modo único | Infra | ✅ |
| 26b | Gestão de horários — modo faixa (bulk) | Infra | ✅ |
| 30 | Responsividade mobile completa | UX | ✅ |
| 29 | Rodapé com diferenciais | UX | ✅ |
| – | Validação de inputs (datas, números) | Qualidade | ✅ |
| – | Font Awesome substituindo emojis | UX | ✅ |
| – | Ocultar scrollbar visual | UX | ✅ |
| – | Selects estilizados na paleta | UX | ✅ |
| 31 | Avaliações da comunidade (estrelas + comentário) | Engajamento | ✅ |
| 32 | Tick de disponibilidade em tempo real (simulado) | UX | ✅ |
| 33 | Reservas v2 — status, grupos, .ics, cancelar com confirmação | Reservas | ✅ |
| 34 | Sugestões com filtros temporais e motivo personalizado | Home | ✅ |

---

## ÉPICO: HOME / LANDING PAGE

| # | Story | Status |
|---|---|---|
| 1 | Hero Banner com CTA duplo | ✅ |
| 2 | Busca de vinícolas e experiências (filtro em tempo real) | ✅ |
| 3 | Sugestões do dia (experiências curadas com vagas) | ✅ |
| 4 | Vinícolas boutique em destaque | ✅ |
| 5 | Menu de navegação principal com indicação da aba ativa | ✅ |

## ÉPICO: CRIAÇÃO DE ROTEIRO

| # | Story | Status |
|---|---|---|
| 6 | Formulário dias / orçamento / pessoas com validação | ✅ |
| 7 | Seleção de perfil de viagem (casal, amigos, família, solo) | ✅ |
| 8 | Seleção de interesses (14 chips) | ✅ |
| 9 | Botão "Gerar roteiro personalizado" com algoritmo de otimização | ✅ |

## ÉPICO: ROTEIRO SUGERIDO

| # | Story | Status |
|---|---|---|
| 10 | Resumo do roteiro (dias, paradas, tempo total, deslocamento, custo) | ✅ |
| 11 | Tags de experiências incluídas (badges) | ✅ |
| 12 | Cards de paradas por dia com botões "Ver vinícola" e "Reservar" | ✅ |
| 13 | Disponibilidade em tempo real (verde/amarelo/vermelho) | ✅ |

## ÉPICO: PÁGINA DA VINÍCOLA

| # | Story | Status |
|---|---|---|
| 14 | Perfil completo (foto, descrição, duração média, faixa de preço) | ✅ |
| 15 | Lista de experiências da vinícola | ✅ |
| 16 | Horários disponíveis (botões selecionáveis) | ✅ |
| 17 | Reservar horário com pré-preenchimento e confirmação | ✅ |

## ÉPICO: MAPA / ROTA

| # | Story | Status |
|---|---|---|
| 18 | Timeline da rota com paradas, horários e deslocamento | ✅ |
| 19 | Tabs por dia (scroll horizontal mobile) | ✅ |
| 20 | Visão resumida da rota (tempo total, partida, melhor horário, paradas) | ✅ |

## ÉPICO: RESERVAS

| # | Story | Status |
|---|---|---|
| 21 | Lista de reservas confirmadas + estado vazio | ✅ |
| 22 | Valor total estimado (card destacado) | ✅ |
| 23 | Botões "Editar roteiro" e "Adicionar experiência" | ✅ |
| 33a | Status derivado (pendente/confirmada/realizada/cancelada) | ✅ |
| 33b | Agrupamento por bucket temporal (hoje/amanhã/semana…) | ✅ |
| 33c | Exportação .ics para Google/Apple/Outlook | ✅ |
| 33d | Confirm dialog antes de cancelar | ✅ |

## ÉPICO: AVALIAÇÕES / COMUNIDADE

| # | Story | Status |
|---|---|---|
| 31a | Seção pública de avaliações com média e total | ✅ |
| 31b | Filtros (todas / 5 estrelas / 4+ / recentes) | ✅ |
| 31c | Formulário inline na reserva passada (1-5 estrelas + comentário) | ✅ |
| 31d | Reviews dentro do perfil da vinícola | ✅ |
| 31e | Badge de média em cards de Boutique/Sugestões/Experiências | ✅ |
| 31f | Persistência em localStorage + sync entre abas | ✅ |

## ÉPICO: DISPONIBILIDADE EM TEMPO REAL

| # | Story | Status |
|---|---|---|
| 32a | Tick simulado a cada 45s decrementando vagas aleatórias | ✅ |
| 32b | Pausa automática quando aba fica oculta (Page Visibility API) | ✅ |
| 32c | Timestamp "Atualizado há X" em sugestões e slots | ✅ |
| 32d | Animação `.is-updated` nos slots quando vagas mudam | ✅ |

## ÉPICO: INFRAESTRUTURA / BACKEND

| # | Story | Status |
|---|---|---|
| 24 | CRUD de vinícolas com seed | ✅ |
| 25 | CRUD de experiências vinculado a vinícola | ✅ |
| 26 | Gestão de horários por slot (única + faixa) | ✅ |
| 27 | Algoritmo de geração de roteiros otimizado | ✅ |
| 28 | Sistema de reservas com controle de vagas | ✅ |

## ÉPICO: DIFERENCIAIS / UX

| # | Story | Status |
|---|---|---|
| 29 | Rodapé com diferenciais (4 ícones) | ✅ |
| 30 | Responsividade mobile em todas as telas | ✅ |

---

## 🚧 Próximas sprints

### Sprint v1.1 — Polimento e demo

- 📋 Adicionar **experiências** a vinícolas customizadas (CRUD completo no admin)
- 📋 Tour guiado na primeira visita (overlay com pontos de destaque)
- 📋 Exportar roteiro como PDF (lib `html2pdf.js`)
- 📋 Compartilhar roteiro via link (encode no hash)
- 📋 Modo escuro respeitando `prefers-color-scheme`

### Sprint v2 — Autenticação e persistência

- 📋 Login social (Google / Apple)
- 📋 Migrar reservas/horários custom do localStorage para o backend
- 📋 Página "Minha conta" com histórico
- 📋 Reset de senha por email
- 📋 RGPD: termo de uso e política de privacidade

### Sprint v2.1 — Pagamento e receita

- 📋 Integração Pix via API gateway (Mercado Pago / Stripe)
- 📋 Cartão de crédito tokenizado
- 📋 Comissão por reserva confirmada (modelo de negócio)
- 📋 Painel de receita para a vinícola
- 📋 Cupons e códigos promocionais

### Sprint v3 — Inteligência e escala

- 📋 Recomendações por LLM (histórico do visitante → próximas sugestões)
- 📋 Embeddings de experiências para "vinícolas parecidas com…"
- 📋 Notificações push antes da visita
- ✅ ~~Sistema de reviews pós-experiência (estrelas + texto)~~ — entregue em 2026-05-22 (épico Avaliações)
- 📋 Reviews moderadas server-side (anti-spam, idioma)
- 📋 Roteiros colaborativos (família/grupo edita junto via socket)
- 📋 Integração real com agendas das vinícolas (API/webhook)
- 📋 Disponibilidade real (substituir tick simulado por websocket/SSE do backend)

### Sprint v4 — Mobile nativo

- 📋 PWA com offline-first
- 📋 App nativo iOS/Android (Capacitor)
- 📋 Notificações geo-localizadas (chegou perto da vinícola)
- 📋 Apple Wallet / Google Wallet para reservas

---

## 🐛 Bugs / Débito técnico

| # | Item | Prioridade |
|---|---|---|
| – | Re-mapeamento de datas do seed: hoje é temporário em script.js, deveria vir do backend já futuro | baixa |
| – | Tags do banco vs slugs do front: dependemos do fallback para preservar slugs | média |
| – | Custom vinicolas não podem ter experiências (apenas perfis) | alta |
| – | Sem testes automatizados (manual QA por enquanto) | média |

---

## 💡 Ideias guardadas (parking lot)

- Filtro "vinícolas com vagas para amanhã"
- Comparador de duas vinícolas lado a lado
- Tour 360° via embed
- Playlist Spotify por vinícola
- Modo "lua de mel" (sugestões otimizadas para casais em viagem romântica)
- Programa de fidelidade (visitas → carimbos → desconto)
- Mini-jogo de degustação (qual vinho casa com X?)
