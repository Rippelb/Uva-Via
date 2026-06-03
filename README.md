<div align="center">

# 🍇 Uva & Via

### Concierge digital de enoturismo para o Vale dos Vinhedos

*Monte seu roteiro ideal em minutos — sem filas, sem improviso.*

[![Status](https://img.shields.io/badge/status-MVP-6b7a3a?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/stack-PHP%208%20%2B%20MySQL%208%20%2B%20Vanilla%20JS-4a0d1f?style=flat-square)](#)
[![Mobile-first](https://img.shields.io/badge/design-mobile--first-d4b996?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-MIT-c98e3e?style=flat-square)](#)

[Demo local](#-rodando-local) ·
[Features](#-o-que-o-mvp-entrega) ·
[Arquitetura](#-arquitetura) ·
[Decisões](decisoes.md) ·
[Backlog](backlog.md) ·
[Changelog](changelog.md)

</div>

---

## 🍷 O problema

O Vale dos Vinhedos recebe mais de **400 mil turistas por ano**.
A maioria chega sem reserva (**67,7%**) e improvisa o roteiro (**48,4%**).
O resultado é uma experiência fragmentada, com tempo perdido em filas
e deslocamentos mal planejados.

**Uva & Via** transforma essa jornada caótica em algo organizado, personalizado e fluido.

---

## 💡 A proposta

Um sistema inteligente que monta automaticamente **roteiros enoturísticos otimizados**,
baseados em:

| Variável                          | O que faz                                              |
|-----------------------------------|--------------------------------------------------------|
| 🎯 **Preferências do visitante**  | 14 interesses (degustação, piquenique, pôr do sol…)    |
| 👥 **Perfil da viagem**           | Casal · Família · Amigos · Solo                        |
| 💰 **Orçamento**                  | Filtra experiências e calcula valor total estimado     |
| 🟢 **Disponibilidade real**       | Badges em tempo real (verde / amarelo / vermelho)      |
| 🗺️ **Proximidade geográfica**     | Haversine entre vinícolas — minimiza deslocamento      |
| ⏱️ **Ritmo do passeio**           | Tranquilo (2/dia) · Equilibrado (3) · Explorador (4+)  |

---

## ✨ O que o MVP entrega

### 🏠 Home
- Hero com **CTA duplo** ("Planejar meu roteiro" / "Ver mapa do dia")
- 🔍 **Busca global** (vinícolas + experiências em tempo real)
- ✨ **Sugestões do dia** — experiências curadas com vagas abertas
- 🏛️ **Vinícolas boutique em destaque** — Lídio Carraro, Torcello, Cave Geisse…

### 🧙 Wizard de Criação de Roteiro
- 6 campos validados (dias, pessoas, orçamento, perfil, ritmo)
- 14 chips de interesses
- Geração instantânea (zero round-trip)

### 📋 Roteiro Sugerido
- **Sumário narrativo** descrevendo o foco do conjunto ("…degustações premium e pôr do sol…")
- Resumo: dias, paradas, **tempo total**, deslocamento, **distância em km**, custo
- Tags de experiências incluídas
- Gauge de orçamento (dentro/acima)
- Cards de paradas com **chegada → saída**, motivos da escolha (toggle), e botões "Ver vinícola"/"Reservar"
- Badges de disponibilidade
- **"Gerar nova variação"** — re-roll com seed diferente

### 🍇 Página da Vinícola
- Cover personalizado, descrição, faixa de preço, duração média
- Lista de experiências com horários clicáveis
- Reserva direta com pré-preenchimento

### 🗺️ Mapa / Rota
- **Visão resumida** — tempo total, deslocamento, **distância em km**, paradas, saída sugerida
- **Barra de ações** — Imprimir · Compartilhar (URL com hash) · Exportar agenda (.ics multi-evento)
- Tabs por dia (scroll horizontal mobile-friendly)
- **Cabeçalho do dia ativo** com janela, nº paradas, duração e km do dia
- **Timeline vertical** com marcadores numerados, chegada → saída, deslocamento em km e tempo
- **Sugestão automática de pausa para almoço** quando há gap entre 12h-14h
- Motivo curto da escolha visível em cada parada

### 📅 Reservas Confirmadas
- Próxima visita destacada
- **Status derivado**: Pendente · Confirmada · Realizada · Cancelada
- **Grupos por bucket**: Hoje · Amanhã · Esta semana · Em breve · Histórico
- **Valor total estimado** em card destacado
- Botões "Editar roteiro" / "Adicionar experiência"
- **Exportar para agenda** (.ics — Google/Apple/Outlook) por reserva
- **Cancelar com confirmação** (evita perda acidental)

### ⭐ Avaliações da comunidade
- Feed público com média geral, total e cards (autor, perfil, vinícola, comentário, data)
- Filtros: Todas · 5 estrelas · 4+ estrelas · Mais recentes
- **Formulário inline** após a data da reserva passar (1-5 estrelas + texto até 320 chars)
- Bloco de reviews dentro do perfil de cada vinícola
- Badge de média em cards de Boutique/Sugestões/Experiências
- 12 avaliações seed para a comunidade não nascer vazia

### 🟢 Disponibilidade em tempo real
- Tick simulado a cada 45s — outros usuários "consomem" vagas
- Pausa quando aba fica oculta (Page Visibility API)
- Timestamp "Atualizado há Xs" nos slots e nas sugestões
- Animação `.is-updated` nos slots que mudaram

### 🛠️ Gestão (admin)
- **Subtabs:** Horários | Vinícolas
- **CRUD de vinícolas**: nome, cidade, tipo, descrição, paleta, duração média, faixa de preço
- **Horários — modo único** ou **modo faixa** (gera vários slots de uma vez com preview ao vivo)
- Validação completa: datas no futuro, números positivos, nomes únicos
- Métricas de ocupação em tempo real

### ✨ Qualidade e detalhes
- **Font Awesome 6** — ícones consistentes (não emojis variáveis por SO)
- **Scrollbar oculta** mantendo scroll funcional
- **Validação inline** em todos os formulários com mensagens de erro contextuais
- **Touch-targets 44px+** garantidos em todos os elementos clicáveis
- **`prefers-reduced-motion`** respeitado

---

## 🎨 Design

Paleta enoturística refinada:

```
Bordô profundo  #4a0d1f  ⬛  universo do vinho
Vinho claro     #6b1e2f  ⬛  hover/states
Bege            #f5ecd9  🟫  equilíbrio e leveza
Bege escuro     #d4b996  🟫  bordas decorativas
Oliva           #6b7a3a  🟢  eyebrows, status livre
```

**Tipografia:** Cormorant Garamond (serif itálico premium) + Inter (UI sans-serif).

**Mobile-first:** Toda a base parte do mobile e escala progressivamente com
breakpoints `min-width`. Touch-targets de 44px+ garantidos.

---

## 🧱 Arquitetura

```
┌─────────────────────────────────────────┐
│  Front-end vanilla (HTML + CSS + JS)    │
│  - SPA com 8 seções ancoradas           │
│  - Mobile-first, sem build step         │
│  - Fallback resiliente (offline-ready)  │
└────────────────┬────────────────────────┘
                 │ fetch
┌────────────────▼────────────────────────┐
│  PHP 8 API (10 endpoints PDO)           │
│  /api/vinicolas · /api/experiencias     │
│  /api/horarios  · /api/reservas         │
│  /api/roteiros  · ...                   │
└────────────────┬────────────────────────┘
                 │ PDO
┌────────────────▼────────────────────────┐
│  MySQL 8 / MariaDB (XAMPP)              │
│  - db/schema.mysql.sql                  │
│  - db/seed.mysql.sql                    │
└─────────────────────────────────────────┘
```

📖 Detalhes em **[context.md](context.md)**, **[decisoes.md](decisoes.md)** e **[backlog.md](backlog.md)**.

---

## 🚀 Rodando local

### Pré-requisitos
- XAMPP (Apache + MySQL) — testado com PHP 8.x
- Git

### Passos

```bash
# 1. Clonar dentro de htdocs
cd C:\xampp\htdocs
git clone https://github.com/Rippelb/Uva-Via.git uvaevia

# 2. Criar o banco e popular
# O instalador cria o banco `uva&via` (nome esperado por api/config/db.php),
# todas as tabelas, o seed e o admin supremo (admin@uvaevia.local / trocar123).
# Via phpMyAdmin: importe db/install.mysql.sql
# Ou via linha de comando:
mysql -u root < uvaevia/db/install.mysql.sql

# 3. Abrir
# http://localhost/uvaevia
```

**Sem banco?** O front carrega dados embutidos como fallback. Tudo funciona offline.

---

## 📁 Estrutura

```
uvaevia/
├── index.html              # Estrutura principal (SPA com seções ancoradas)
├── style.css               # CSS mobile-first com tokens e breakpoints progressivos
├── script.js               # Lógica do front, algoritmo de roteiro, mapa/rota
├── api-client.js           # Cliente fetch → /api/*.php (com fallback)
├── api/                    # Backend PHP
│   ├── vinicolas.php
│   ├── experiencias.php
│   ├── horarios.php
│   ├── reservas.php
│   ├── roteiros.php
│   └── config/
├── db/                     # Schema + seed MySQL
│   ├── schema.mysql.sql
│   └── seed.mysql.sql
├── context.md              # Visão de produto, público, dores, arquitetura
├── logs.md                 # Log cronológico de mudanças (informal)
├── changelog.md            # Changelog versionado em SemVer + Keep a Changelog
├── backlog.md              # Stories por épico, sprints planejadas, parking lot
├── decisoes.md             # Decisões de arquitetura e por quês
└── README.md
```

---

## 🍇 Vinícolas parceiras (seed)

### Boutique e intimista
Lídio Carraro · Torcello · Pizzato · Cave Geisse · Don Giovanni · Dom Cândido · Larentis

### Tradicionais e familiares
Miolo Wine Group · Casa Valduga · Salton

26 experiências catalogadas — degustações, harmonizações, piqueniques entre vinhedos, tours de cave, vindima.

---

## 📊 Pesquisa que sustenta o produto

| Métrica                                              | %       |
|------------------------------------------------------|---------|
| Valorizam disponibilidade em tempo real              | 93,6%   |
| Usariam app de roteiro personalizado                 | 93,5%   |
| Chegam sem reserva                                   | 67,7%   |
| Já visitaram regiões vinícolas mais de 3 vezes       | 64,5%   |
| Preferem soluções gratuitas                          | 61,3%   |

---

## 🛣️ Roadmap

### v1 (atual) — MVP funcional
- [x] CRUD de vinícolas + experiências + horários
- [x] Wizard de criação de roteiro
- [x] Algoritmo de geração com scoring
- [x] Mapa/rota com timeline
- [x] Reservas em localStorage
- [x] Mobile-first responsive
- [x] Disponibilidade em tempo real (front)

### v2 — Plataforma
- [ ] Login social (Google/Apple)
- [ ] Reservas persistentes server-side
- [ ] Pagamento integrado (Pix + cartão)
- [ ] Notificações push antes da visita
- [x] Reviews pós-experiência (entregue 2026-05-22)
- [x] Exportação .ics da reserva (entregue 2026-05-22)
- [x] Tick simulado de disponibilidade em tempo real (entregue 2026-05-22)
- [ ] Disponibilidade real via WebSocket/SSE do backend
- [ ] Reviews moderadas server-side

### v3 — Inteligência
- [ ] Recomendações por LLM dado histórico
- [ ] Roteiros colaborativos (família edita junto)
- [ ] Integração real com agendas das vinícolas
- [ ] App nativo (PWA / Capacitor)

---

## 🤝 Contribuindo

Este é um projeto acadêmico/MVP. Issues e PRs são bem-vindos.

**Antes de abrir PR:**
1. Mantenha o padrão mobile-first
2. Não introduza dependências/frameworks sem discussão (ver [decisoes.md](decisoes.md))
3. Atualize `logs.md` com a mudança
4. Teste no mobile (Chrome DevTools / dispositivo real)

---

## 📜 Licença

MIT — use, modifique, distribua. Beba com moderação. 🍷

---

<div align="center">

**Feito com 🍇 no Vale dos Vinhedos**

[context.md](context.md) · [decisoes.md](decisoes.md) · [backlog.md](backlog.md) · [changelog.md](changelog.md) · [logs.md](logs.md)

</div>
