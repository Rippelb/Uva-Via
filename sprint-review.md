# 🍇 Uva & Via — Sprint Review

> Demonstração e validação das entregas com as partes interessadas.

---

## 📅 Período

Sprints de **2026-02-28 a 2026-05-22** (consolidado).

## 👥 Equipe

Time de desenvolvimento Uva & Via.

---

## 🎯 Objetivo principal do produto

Ser **a forma mais simples e inteligente de planejar enoturismo** no Vale dos
Vinhedos — transformar uma experiência caótica e improvisada em uma jornada
organizada, personalizada e fluida.

---

## ✍️ Situação das entregas (parágrafo)

Ao fim deste sprint, o **Uva & Via** atingiu um MVP funcional ponta a ponta no
Vale dos Vinhedos: o turista entra pelo wizard (dias, pessoas, orçamento, perfil,
ritmo e 14 interesses), recebe um **roteiro otimizado pelo algoritmo v2** — que
pondera tags, perfil, vagas, orçamento, avaliação média da vinícola e
proximidade geográfica intradiária via *nearest-neighbor* — e visualiza a rota
em uma **timeline com tabs por dia**, contendo chegada/saída, km entre paradas,
sugestão automática de almoço entre 12h e 14h, compartilhamento via URL,
exportação `.ics` multi-evento e modo de impressão otimizado. O turista abre o
**perfil da vinícola** com horários clicáveis, confirma **reservas com status
derivado** (pendente → confirmada → realizada → cancelada) agrupadas por bucket
temporal, e pode **avaliar** após a visita com estrelas e comentário — alimentando
a média geral exibida em cards de Boutique, Sugestões e Experiências. Em paralelo,
foram entregues **disponibilidade em tempo real** (tick simulado que pausa via
Page Visibility API), **admin completo** com CRUD de vinícolas e cadastro de
horários em modo único ou em **faixa** (intervalo entre slots com preview ao
vivo), **autenticação real** com login persistido (PHP 8 + MySQL 8 + 5 endpoints
em `api/auth/`), **mobile-first** com drawer lateral animado, validação inline
em todos os inputs, Font Awesome 6 substituindo emojis, scrollbar oculta com
selects estilizados na paleta, e uma **nova landing premium "Crepúsculo no
vinhedo"** com céu estratificado bordô, sol-poente respirando, ondas SVG entre
seções e uma **taça de vinho 3D em Three.js** (LatheGeometry + PhysicalMaterial,
material cristal IOR 1.62, vinho com vértices animados em meniscus) que gira
conforme o scroll do site — branch [`feature/landing-uva-via`](https://github.com/Rippelb/Uva-Via/tree/feature/landing-uva-via),
aguardando merge. Ao todo são **38 stories validadas em 12 épicos**, todos os
cards do Trello inicial concluídos, dois deles (Avaliações e Disponibilidade em
tempo real) puxados de Sprints futuros por terem se tornado críticos para a
percepção de valor. O **objetivo principal está essencialmente atingido para o
escopo MVP**: o ciclo *descobrir → planejar → reservar → avaliar* funciona com
dados realistas das 10 vinícolas e 26 experiências do Vale, com a estética
premium pedida pelo público de 45–55+ anos. A distância restante é de
**polimento na Sprint v1.1** (CRUD de experiências em vinícolas custom, modo
escuro, PWA e tour guiado) e de **evoluções pós-MVP** já planejadas: Sprint v2
migra os dados que hoje vivem em `localStorage` para o backend autenticado;
v2.1 introduz pagamento Pix; v3 entrega recomendações com LLM e integração real
com as agendas das vinícolas; v4 leva o produto para PWA e app nativo.

---

## 📊 Métricas do sprint

| Métrica                                              | Valor    |
|------------------------------------------------------|----------|
| Stories planejadas (MVP original — Trello)           | 30       |
| Stories concluídas                                   | **30 / 30 ✅** |
| Stories puxadas de sprints futuros                   | +8       |
| Total de stories entregues                           | **38**   |
| Épicos concluídos                                    | **12 / 12 ✅** |
| Vinícolas no seed                                    | 10       |
| Experiências catalogadas                             | 26       |
| Endpoints PHP                                        | 15       |
| Linhas de código (HTML + CSS + JS + PHP)             | ~ 9.000  |
| Branches abertas aguardando review                   | 1 (`feature/landing-uva-via`) |

---

## ✅ O que validamos com as partes interessadas

- **Fluxo completo** descobrir → planejar → reservar → avaliar
- **Mobile-first**: testado em DevTools de 320 px a 1440 px
- **Disponibilidade real** percebida pelo usuário (93,6% da pesquisa
  apontavam isto como prioridade)
- **Custo previsível** com gauge de orçamento + valor total estimado
- **Estética premium** alinhada ao público 45–55+
- **Acessibilidade**: skip-link, ARIA, `prefers-reduced-motion`, touch-targets
  de 44 px+, focus rings visíveis

## 🔍 Pontos de feedback recolhidos

- A landing nova em branch (`feature/landing-uva-via`) precisa de validação
  visual antes do merge — taça 3D em mobile pequena foi desligada por
  performance, decisão a confirmar.
- Avaliações são hoje apenas client-side (localStorage); para combate a spam,
  precisamos de moderação server-side (Sprint v3).
- Disponibilidade ainda é tick simulado; passar para websocket/SSE depende
  da integração com agendas reais (Sprint v3).

## 🎯 Próximos passos (Sprint v1.1 — polimento e demo)

1. Adicionar **experiências** a vinícolas customizadas (CRUD completo)
2. Tour guiado na primeira visita
3. Exportar roteiro como **PDF**
4. Modo escuro respeitando `prefers-color-scheme`
5. PWA com offline-first
6. Merge da branch `feature/landing-uva-via` após validação visual

---

## 📈 Conclusão

**Estamos no objetivo.** O MVP cumpre a promessa central
("planejar enoturismo da forma mais simples e inteligente") e adiciona camadas
de engajamento (avaliações, status de reservas, tempo real) que não estavam no
escopo original mas elevam o produto para um nível próximo do *production-ready*.
A próxima fronteira deixa de ser *features* e passa a ser **persistência server-side,
monetização e integração real com o ecossistema de vinícolas**.
