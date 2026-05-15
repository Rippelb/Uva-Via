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
[Roadmap](#-roadmap)

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
- Resumo: dias, paradas, **tempo total**, deslocamento, custo
- Tags de experiências incluídas
- Gauge de orçamento (dentro/acima)
- Cards de paradas com **botões "Ver vinícola" e "Reservar"**
- Badges de disponibilidade

### 🍇 Página da Vinícola
- Cover personalizado, descrição, faixa de preço, duração média
- Lista de experiências com horários clicáveis
- Reserva direta com pré-preenchimento

### 🗺️ Mapa / Rota
- **Visão resumida** — tempo total, deslocamento, paradas, saída sugerida
- Tabs por dia (scroll horizontal mobile-friendly)
- **Timeline vertical** com marcadores numerados e deslocamento entre paradas

### 📅 Reservas Confirmadas
- Próxima visita destacada
- **Valor total estimado** em card destacado
- Botões "Editar roteiro" / "Adicionar experiência"

### 🛠️ Gestão (admin)
- CRUD de horários (data, hora, capacidade)
- Métricas de ocupação em tempo real

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

📖 Detalhes em **[context.md](context.md)** e **[decisoes.md](decisoes.md)**.

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
# Via phpMyAdmin (importar) ou linha de comando:
mysql -u root -e "CREATE DATABASE uvaevia CHARACTER SET utf8mb4;"
mysql -u root uvaevia < uvaevia/db/schema.mysql.sql
mysql -u root uvaevia < uvaevia/db/seed.mysql.sql

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
├── context.md              # Visão de produto, público, dores
├── logs.md                 # Log cronológico de mudanças
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
- [ ] Reviews pós-experiência

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

[context.md](context.md) · [decisoes.md](decisoes.md) · [logs.md](logs.md)

</div>
