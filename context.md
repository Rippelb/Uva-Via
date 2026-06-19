# 🍷 Uva & Via - Context

> Planejador inteligente de enoturismo para o Vale dos Vinhedos (RS, Brasil).

---

## 1. Visão Geral

**Uva & Via** é um MVP de concierge digital que ajuda o turista a planejar visitas a vinícolas
cruzando preferências, perfil da viagem, orçamento, disponibilidade real e tempo de deslocamento.

O usuário responde um wizard de 6 perguntas (dias, pessoas, orçamento, perfil, ritmo, interesses)
e o sistema gera um roteiro otimizado com paradas por dia, tempo total, deslocamento entre
vinícolas e um mapa-timeline com tabs por dia.

---

## 2. Problema → Solução

| Dor do turista                                  | Como o Uva & Via resolve                                |
|-------------------------------------------------|----------------------------------------------------------|
| 67,7% chegam sem reserva                        | Reserva direto pela tela de vinícola/agendamento         |
| 48,4% improvisam o roteiro                      | Wizard gera roteiro pronto em segundos                   |
| 45,2% já enfrentaram falta de informação        | Disponibilidade em tempo real (badges verde/amarelo/vermelho) |
| Falta de previsibilidade de custos              | Valor total estimado destacado em todas as telas         |
| Perda de tempo com deslocamento                 | Algoritmo calcula proximidade (haversine + 45 km/h média) |

---

## 3. Público-alvo

- **Demográfico:** Maiores de 18 anos; pico entre 45-55+ (53,4%)
- **Comportamental:** 64,5% já visitaram regiões vinícolas mais de 3 vezes; 50% viajam com família
- **Perfis de viagem:** Casal · Família adulta · Grupo de amigos · Viajante solo
- **Disposição a pagar:** 61,3% preferem soluções gratuitas (logo: MVP free + monetização futura via comissão de reservas)

---

## 4. Arquitetura do MVP

```
┌────────────────────────────────────────────────────┐
│                    Front-end                       │
│   index.html · style.css · script.js               │
│   - Mobile-first, vanilla JS, sem build step       │
│   - SPA com seções ancoradas (#home, #planejar...) │
└────────────────────────────────────────────────────┘
                       │  fetch
                       ▼
┌────────────────────────────────────────────────────┐
│                    PHP API                         │
│   api/*.php  (10 endpoints)                        │
│   - vinicolas, experiencias, horarios, tags        │
│   - reservas, roteiros, perfis, categorias         │
│   - visitantes                                     │
└────────────────────────────────────────────────────┘
                       │  PDO
                       ▼
┌────────────────────────────────────────────────────┐
│                MySQL (XAMPP)                       │
│   db/schema.mysql.sql · db/seed.mysql.sql          │
│   - 10 vinícolas, 26 experiências, ~30 horários    │
└────────────────────────────────────────────────────┘
```

**Fallback resiliente:** se a API estiver fora do ar, o `script.js` tem dados embutidos
(mesmo seed do banco) - o site continua navegável e funcional.

---

## 5. Funcionalidades do MVP

### 5.1 Home / Landing
- Hero com CTA duplo ("Planejar meu roteiro" / "Ver mapa do dia")
- **Busca global** (vinícolas + experiências, em tempo real)
- **Sugestões do dia** (6 experiências curadas com vagas)
- **Vinícolas boutique em destaque** (lista clicável → perfil da vinícola)
- Nav adaptativa: hamburger no mobile, horizontal no desktop

### 5.2 Wizard de Criação de Roteiro
- 6 campos: data início, dias, pessoas, orçamento, perfil, ritmo
- 14 chips de interesses (degustação, harmonização, piquenique, etc)
- Validação client-side + observações livres

### 5.3 Algoritmo de Geração
Sistema de scoring por experiência considerando:
- Match direto de tag (+6 por tag)
- Match por keyword no nome/vinícola (+3)
- Match por perfil (+2 quando combina, ex.: família + tag familiar)
- Vagas disponíveis (+1/+2)
- Preço dentro do orçamento por experiência (+2)

Distribuição por dia respeitando o ritmo:
- Tranquilo: 2 paradas/dia
- Equilibrado: 3 paradas/dia
- Explorador: 4 paradas/dia

Horários sugeridos: 10:00 → 12:30 → 15:00 → 17:30
Deslocamento estimado: haversine entre vinícolas a 45 km/h, mínimo 5min.

### 5.4 Tela de Roteiro Sugerido
- Resumo: dias, paradas, tempo total, deslocamento, custo total
- **Tags badges** com experiências incluídas
- Gauge de orçamento (dentro/acima)
- Cards de paradas por dia com:
  - Horário, duração, disponibilidade (badge colorida)
  - Botões "Ver vinícola" e "Reservar"
  - Preço por parada × pessoas
- Botões finais: "Editar roteiro", "Ver no mapa", "Confirmar reservas"

### 5.5 Página da Vinícola
- Cover com gradiente personalizado por vinícola
- Descrição, duração média, faixa de preço, número de experiências
- Lista de experiências da vinícola com:
  - Disponibilidade
  - Botões de horário direto (clique = preenche o booking e rola para reserva)

### 5.6 Mapa / Rota
- **Visão resumida:** tempo total, deslocamento, paradas, saída sugerida (cidade + horário)
- **Tabs por dia** (scroll horizontal no mobile)
- **Timeline vertical** com marcadores numerados, horário, duração, badge de disponibilidade,
  vinícola e experiência. Conector visual entre paradas indica deslocamento.

### 5.7 Reservas
- Stats: total de reservas, próxima visita (Hoje/Amanhã/Em N dias), **valor total estimado** destacado
- **Botões "Editar roteiro" e "Adicionar experiência"**
- Lista ordenada por data/hora com card destacado para a próxima
- Cancelamento individual

### 5.8 Gestão (admin)
- CRUD de horários customizados (data, horário, capacidade)
- Tabela com vagas restantes, % de ocupação, badge custom/catálogo
- Stats agregados (total de horários, vagas livres, ocupação)
- Sincronização entre abas via `storage` event

---

## 6. Base de Vinícolas (seed)

**Boutique:** Pizzato · Torcello · Larentis · Lídio Carraro · Cave Geisse · Don Giovanni · Dom Cândido
**Grandes:** Miolo · Casa Valduga · Salton

Cada vinícola tem: nome, cidade, descrição, tipo (boutique/grande), latitude/longitude,
duração média, faixa de preço, paleta de cover (tones a-e).

---

## 7. Design System

### Paleta
- **Bordô profundo** `#4a0d1f` - universo do vinho (CTAs, headers, brand)
- **Vinho claro** `#6b1e2f` - hover/states
- **Bege sofisticado** `#f5ecd9` - superfícies neutras, equilíbrio
- **Bege escuro** `#d4b996` - bordas decorativas, secondary copy
- **Oliva** `#6b7a3a` - eyebrows, status livre, accent secundário
- **Status:** livre `#2d7a4f` · quase cheio `#c98e3e` · lotado `#a83247`

### Tipografia
- **Cormorant Garamond** (serif itálico) - títulos, números destacados, identidade premium
- **Inter** (sans-serif) - body, UI, labels

### Espaçamento
8 tokens de espaçamento (`--space-1` a `--space-8`, de 0.25rem a 4rem).

### Touch targets
Mínimo de **44px** (Apple HIG / Material) em todos os elementos clicáveis.

### Acessibilidade
- Skip-link para conteúdo
- `prefers-reduced-motion` respeitado
- ARIA labels em nav, dialog patterns, search results
- Inputs com `inputmode` apropriado (numeric, search)
- Font-size 16px nos inputs (evita zoom no iOS)

---

## 8. Mobile-first

Todo o CSS é estruturado **mobile-first**: a base é mobile e os breakpoints `min-width`
escalam progressivamente.

| Breakpoint  | Aplicação                                              |
|-------------|--------------------------------------------------------|
| base (≤599) | 1 coluna, nav drawer, botões full-width                |
| ≥ 600px     | grids 2 colunas, hero-actions horizontais, stats 3 cols |
| ≥ 720px     | exp-filters 4 cols, manage-row tabela, reservas 3 cols  |
| ≥ 860px     | nav horizontal (drawer some), todos os menus inline     |
| ≥ 900px     | roteiro-meta 5 cols, mapa-resumo 4 cols, diff 4 cols    |
| ≥ 960px     | grids de cards 3 cols                                   |

---

## 9. Estado e Persistência

Dois storages no `localStorage`:

| Chave                       | Conteúdo                                     |
|-----------------------------|----------------------------------------------|
| `uvaevia.reservas`          | Lista de reservas/solicitações               |
| `uvaevia.horarios.custom`   | Horários criados via Gestão                  |
| `uvaevia.plano.atual`       | Último roteiro gerado (alimenta o Mapa)      |
| `uvaevia.avaliacoes`        | Avaliações enviadas pelo usuário             |
| `uvaevia.avaliacoes.uteis`  | Votos de "útil" nas avaliações               |
| `uvaevia.favoritos`         | Vinícolas e experiências favoritadas         |
| `uvaevia.transporte.modo`   | Modo de transporte escolhido no roteiro      |
| `uvaevia.leads.vinicolas`   | Leads B2B da seção "Para vinícolas"          |
| `uvaevia.newsletter`        | Inscrições da newsletter                     |

Sincronização entre abas via evento `storage`.

---

## 10. Limitações conhecidas (MVP)

- Sem autenticação real (visitante anônimo por nome)
- Sem pagamento (reservas fictícias)
- Reservas persistem em localStorage; o backend recebe via fire-and-forget
- Distância calculada por haversine (linha reta), não usa rotas reais
- Sugestões do dia são curadas estaticamente por tag prioritária, não usam histórico

---

## 11. Evolução futura

- Integração real com APIs de agendamento das vinícolas
- Login social e perfil persistente do visitante
- Sistema de pagamento (Pix + cartão)
- Recomendações com IA (LLM dado o histórico)
- Notificações push antes da visita
- Avaliações e reviews pós-experiência
- Roteiros colaborativos (família/grupo edita junto)
- App nativo (Capacitor/PWA)

---

## 12. Stack atual

| Camada          | Tecnologia                                |
|-----------------|-------------------------------------------|
| Front-end       | HTML5 + CSS3 (mobile-first) + JS vanilla  |
| Tipografia      | Google Fonts (Cormorant Garamond + Inter) |
| API             | PHP 8 + PDO                               |
| Banco           | MySQL 8 (XAMPP / MariaDB compat.)         |
| Hospedagem dev  | XAMPP local (`http://localhost/uvaevia`)  |
| Versionamento   | Git + GitHub (`Rippelb/Uva-Via`)          |

Por que **não** usamos framework: ver `decisoes.md`.

---

## 13. Como rodar local

```bash
# Pré-requisito: XAMPP com Apache + MySQL rodando
# 1. Clone dentro de htdocs
cd C:\xampp\htdocs
git clone https://github.com/Rippelb/Uva-Via.git uvaevia

# 2. Importar schema + seed pelo phpMyAdmin (ou linha de comando):
mysql -u root uvaevia < db/schema.mysql.sql
mysql -u root uvaevia < db/seed.mysql.sql

# 3. Abrir
# http://localhost/uvaevia
```

Sem MySQL? O front carrega os dados embutidos como fallback automaticamente.
