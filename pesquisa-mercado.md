# 🔍 Uva & Via — Pesquisa de Mercado, Concorrentes e Plano de Execução

> Documento de produto. Sintetiza a persona, mapeia os concorrentes (Brasil e
> exterior), cruza com as reclamações reais de plataformas de passeios e deriva
> um **plano prático** do que copiar/superar — já em execução neste repositório.
>
> Data-base: junho/2026.

---

## 1. Onde estamos (síntese do produto)

**Uva & Via** é um concierge digital de enoturismo para o **Vale dos Vinhedos**
(Serra Gaúcha, RS). O turista responde um wizard (data, dias, pessoas, orçamento,
perfil, ritmo, interesses) e o sistema gera um **roteiro otimizado** por
proximidade geográfica, disponibilidade e preferências, com mapa-timeline,
reservas, avaliações e um painel de gestão.

- **Stack:** front vanilla (HTML/CSS/JS modular em `js/`), API PHP 8 + MySQL,
  fallback client-side resiliente (o site funciona offline).
- **Maturidade:** MVP funcional, com algoritmo de scoring v2, reservas em
  `localStorage`, reviews, disponibilidade simulada em tempo real e login.

### Diferencial central já entregue
Somos um dos poucos que **monta o roteiro inteiro** (não só vende um passeio
avulso) e **otimiza o deslocamento** entre vinícolas. Esse é o nosso fosso.

---

## 2. Persona principal

Cruzando a pesquisa que sustenta o produto (`README.md`/`context.md`) com a
realidade do destino:

> **"Cláudia & Roberto", o casal enoturista 45–55+**
> Já visitaram regiões vinícolas mais de 3 vezes (64,5% da base), viajam de
> casal ou em família adulta (50% família), valorizam estética premium mas com
> **legibilidade alta** (presbiopia é comum), pesquisam muito antes de ir e
> **odeiam imprevisto**. 61,3% preferem soluções gratuitas.

### As dores reais (ranqueadas)

| # | Dor | Evidência | Como atacamos |
|---|-----|-----------|----------------|
| 1 | **Chega sem reserva e se frustra** | 67,7% chegam sem reservar | Reserva direta + disponibilidade real |
| 2 | **Improvisa o roteiro e perde tempo** | 48,4% improvisam | Wizard + algoritmo de roteiro |
| 3 | **Falta de informação confiável** | 45,2% já sofreram | Info clara + comprovante + "o que está incluído" |
| 4 | **Sem previsibilidade de custo** | — | Valor total estimado em toda tela |
| 5 | **🚗 Logística: vinícolas distantes (3–8 km) e _quem vai dirigir?_** | Tripadvisor/guias de viagem | **Plano de transporte + motorista da rodada (novo)** |

> **Insight forte da pesquisa de campo:** as vinícolas do Vale são distantes
> umas das outras e **dirigir após degustar é o calcanhar de Aquiles** do
> passeio. Quem não quer alugar carro depende de Uber, agência ou Maria Fumaça.
> Nenhum concorrente trata bem essa dor — é a nossa maior oportunidade de
> diferenciação. (Fonte: fórum Tripadvisor Bento Gonçalves; guias Melhores
> Destinos, 360meridianos.)

---

## 3. Mapa de concorrentes

### 3.1 Brasil / enoturismo (concorrência direta)

| Player | O que é | Forças | Lacunas |
|--------|---------|--------|---------|
| **Wine Locals** | Marketplace BR de experiências de vinho. 138 parceiros no RS, 71 mil atividades vendidas em 2025. Tours/visitas 51,7%, degustações 20,2%, enogastronomia 16,0%. | Catálogo amplo, política de cancelamento publicada, "Guia do Enoturismo 2026", marca consolidada. | **Vende passeio avulso**, não monta roteiro nem otimiza deslocamento. Sem personalização por perfil. |
| **Wine XP** | Plataforma de reservas de enoturismo (PT/BR). | Reúne experiências de várias regiões. | Foco em reserva, não em planejamento de roteiro. |
| **Agências locais** (Vale das Vinhas etc.) | Pacotes "dia todo" com transporte. | **Resolvem transporte** + guia. | Engessado, sem personalização, sem self-service digital. |

### 3.2 Enoturismo internacional (referência de features)

| Player | Destaques que valem copiar |
|--------|----------------------------|
| **CellarPass** (EUA) | **Itinerário multi-dia dentro da plataforma**, disponibilidade em tempo real, **confirmação instantânea + e-mails de lembrete**, roteiros sugeridos por especialistas, integração com POS/clube da vinícola. |
| **Winalist** (intl.) | Reserva de experiências de vinho, curadoria, reviews. |

### 3.3 Planejadores de viagem (padrão-ouro de UX)

| Player | Destaques que valem copiar |
|--------|----------------------------|
| **Wanderlog** | **Edição colaborativa em tempo real** (estilo Google Docs), **otimizador de rota**, orçamento, mapa, adicionar de guias com 1 clique, **export da rota pro Google Maps**, acesso offline (Pro). |
| **TripIt** | Centraliza confirmações, itinerário consolidado, lembretes. |

### 3.4 Marketplaces de passeios (confiança e reserva)

| Player | Destaques que valem copiar |
|--------|----------------------------|
| **GetYourGuide** | **Cancelamento grátis até 24h**, **voucher mobile (mostre no celular, sem imprimir)**, reviews verificadas, +200 mi de ingressos vendidos (prova social), suporte 24/7. |
| **Civitatis** | Catálogo enorme, reservas; **porém alvo das reclamações abaixo.** |

---

## 4. Reclame Aqui — o que dá errado (e como blindar o Uva & Via)

Análise das reclamações recorrentes contra **Civitatis** e **GetYourGuide**
(plataformas de passeios) no Reclame Aqui:

| Reclamação recorrente | Tradução pra produto | Nossa blindagem |
|-----------------------|----------------------|------------------|
| "Cancelaram com <24h e não reembolsaram" | Política de cancelamento **opaca e assimétrica** | **Política de cancelamento explícita por experiência**, mostrada **antes** de reservar, com selo "Cancelamento grátis até Xh" |
| "Desencontro de informações, perdi o passeio" | Endereço/horário/o-que-levar pouco claros | **Comprovante/voucher** com código, endereço, horário, "o que levar" e contato |
| "Passeio vendido e não entregue" | Falta de confirmação confiável | **Confirmação imediata** + status da reserva (Pendente → Confirmada → Realizada) |
| "Comunicação difícil com o fornecedor" | Sem canal claro | **Contato da vinícola visível** no comprovante + FAQ |

> Conclusão: **confiança é feature.** Transparência de cancelamento, comprovante
> rico e comunicação clara são o que separa uma plataforma "ok" de uma "amada".

Fontes: listas de reclamações Reclame Aqui (Civitatis, GetYourGuide).

---

## 5. Matriz de lacunas → o que executar

Legenda: ✅ já temos · 🟡 parcial · ❌ falta

| Capacidade | Uva & Via | Concorrentes | Ação |
|------------|:---------:|:------------:|------|
| Monta roteiro otimizado | ✅ | 🟡 (só Wanderlog/CellarPass) | manter como fosso |
| Disponibilidade em tempo real | ✅ | ✅ | manter |
| Reserva + comprovante mobile | 🟡 | ✅ | **criar voucher/comprovante** |
| Política de cancelamento clara | ❌ | 🟡 | **criar (selo + texto)** |
| "O que está incluído / levar" | ❌ | ✅ | **enriquecer dados + UI** |
| Plano de transporte / motorista | ❌ | ❌ | **criar — diferencial único** |
| Favoritos / lista de desejos | ❌ | ✅ | **criar** |
| Export rota Google Maps / Waze | ❌ | ✅ (Wanderlog) | **criar** |
| Roteiros prontos (curadoria 1-clique) | ❌ | ✅ (CellarPass) | **criar** |
| Reviews verificadas + úteis | 🟡 | ✅ | **enriquecer** |
| Lembrete antes da visita | 🟡 (.ics) | ✅ | **criar banner de lembrete** |
| Filtros (acessível, pet, kids, veg) | ❌ | ✅ | **criar** |
| App instalável / offline (PWA) | 🟡 (fallback) | ✅ | **criar manifest + SW** |
| Prova social / confiança | 🟡 | ✅ | **reforçar (selos)** |

---

## 6. Plano prático (ordem de execução = ordem dos commits)

Princípio: **evoluir a base, não reescrever.** Vanilla JS, mobile-first, sem
build step, respeitando o design atual (a taça 3D e a hero ficam).

1. **Enriquecer o modelo de dados** — inclusões, "o que levar", política de
   cancelamento, transporte, tags de acessibilidade. Tornar os mappers da API
   robustos (corrige perda de `tipo`/`tone`).
2. **Favoritos / lista de desejos** — salvar vinícolas e experiências.
3. **Plano de transporte & motorista da rodada** — o grande diferencial.
4. **Confiança na reserva** — política de cancelamento + comprovante/voucher
   com "o que levar", endereço e contato.
5. **Export de rota** (Google Maps / Waze) + **lembrete** da próxima visita.
6. **Roteiros prontos** (curadoria de 1 clique).
7. **Reviews turbinadas** — verificadas, votos de "útil", filtro por perfil.
8. **Filtros de catálogo** — acessibilidade, pet/kids friendly, vegetariano.
9. **PWA** — manifest + service worker (offline de verdade na estrada).
10. **Polimento, prova social e documentação.**

> Cada item vira um (ou mais) commit independente, todos na conta do autor do
> projeto. Análise de risco de negócio ("por que fracassaríamos em 6 meses") em
> `analise-negocio.md`, com features mitigantes também executadas.

---

## 7. Fontes

- Wine Locals — plataforma e políticas: https://www.wine-locals.com/ · https://loja.wine-locals.com/politica-de-cancelamento
- Wine Locals Guia do Enoturismo 2026 (Jornal da Capital): https://jornaldacapital.com.br/
- CellarPass — features de reserva e itinerário: https://business.cellarpass.com/reservation-features · https://www.cellarpass.com/
- Wanderlog — planejador colaborativo e otimização de rota: https://wanderlog.com/
- GetYourGuide — cancelamento grátis, voucher mobile, confiança: https://www.thetraveler.org/what-is-getyourguide-and-how-does-it-work/
- Reclame Aqui — Civitatis (reclamações de cancelamento/reembolso/informação): https://www.reclameaqui.com.br/empresa/civitatis/lista-reclamacoes/
- Reclame Aqui — GetYourGuide: https://www.reclameaqui.com.br/empresa/getyourguide_186554/lista-reclamacoes/
- Transporte no Vale dos Vinhedos (fórum Tripadvisor Bento Gonçalves): https://www.tripadvisor.com.br/ShowTopic-g680210-i17503-k10650262
- Guias do destino: https://www.matraqueando.com.br/vale-dos-vinhedos-roteiro-completo · https://guia.melhoresdestinos.com.br/vale-dos-vinhedos.html
