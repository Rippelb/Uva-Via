# 🧠 Uva & Via - Análise de Negócio (visão de analista)

> Exercício pedido pelo dono do produto: **entrar na pele de um analista de
> negócios e responder - se o Uva & Via fracassar em 6 meses, por quê?** A partir
> do diagnóstico, derivamos features mitigantes e já as executamos.
>
> Data-base: junho/2026.

---

## 1. O que o negócio realmente é

Não somos "um site de vinhos". Somos um **agregador de planejamento + reserva**
de enoturismo. O valor para o turista (persona: casal 45-55+ que odeia
imprevisto) é **chegar com tudo resolvido**. O valor para a vinícola é
**ocupação previsível** e **visitante qualificado**. O dinheiro, quando existir,
virá de **comissão sobre reservas** e/ou **assinatura das vinícolas**.

Esse é um negócio de **marketplace de dois lados**. E marketplaces morrem por
motivos conhecidos.

---

## 2. Se fracassarmos em 6 meses, será por quê?

Ranqueado por probabilidade × letalidade.

### 🥇 Causa nº1 (a mais provável): "A reserva que não é reserva"
Hoje a reserva vive no `localStorage` do navegador do turista. A vinícola **não
recebe nada**. No dia, o turista chega confiante e **não há registro** - é
exatamente o *"passeio vendido e não entregue"* que mais aparece no Reclame Aqui
contra Civitatis/GetYourGuide. Basta **um** caso desses, um post no grupo de
Facebook de viagens, e a confiança - que é 100% do nosso valor - evapora.

> **A promessa ("confirmamos sua reserva na hora") é maior que a entrega.** Esse
> descompasso é o assassino mais rápido.

### 🥈 Causa nº2: Modelo de receita nunca ativado (sem runway)
Somos grátis (61,3% preferem grátis) e a monetização é "futura". Sem receita não
há caixa para vendas, suporte e marketing. A **Wine Locals** já transaciona (71
mil atividades/2025) e tem time comercial. Se não fecharmos o **lado da oferta**
(vinícolas pagantes/comissionadas) e o **pagamento**, isto é um belo MVP - não um
negócio.

### 🥉 Causa nº3: Cold start da oferta (supply side vazio)
A promessa "disponibilidade real" exige vinícolas mantendo agenda no sistema. Por
que elas fariam isso? A Wine Locals levou anos + equipe para chegar a 138
parceiros. Sem oferta real e atualizada, o "tempo real" é teatro e o turista
percebe.

### 4. Frequência/retenção baixa
Enoturismo é ocasional (poucas vezes por ano). O app é usado intensamente por uma
semana e **abandonado**. Sem recorrência, cada usuário custa caro e rende pouco -
a não ser que a comissão por transação seja alta o suficiente (volta à Causa nº2).

### 5. Distribuição inexistente
"Construímos, logo virão" é mito. O turista planeja no Google, Instagram e em
blogs. Sem SEO, conteúdo, parcerias com pousadas/hotéis e presença onde a decisão
acontece, não há tráfego - e marketplace sem demanda não atrai oferta.

### 6. Concentração em um único destino
Só Vale dos Vinhedos. TAM limitado e **sazonal** (vindima, feriados). Um inverno
fraco e o fluxo seca.

### 7. Incumbente pode copiar nosso diferencial
A Wine Locals pode adicionar "monte seu roteiro" num sprint. Nosso fosso só é real
se o **planejamento + logística + UX** forem consistentemente melhores e se
tivermos dados de uso para personalizar. Feature isolada não é defensável.

---

## 3. O diagnóstico em uma frase

> **O maior risco não é técnico, é de confiança e de modelo:** prometemos uma
> reserva confirmada que o outro lado não vê, e não capturamos valor para
> sustentar a operação que tornaria a promessa verdadeira.

---

## 4. O que dá pra mitigar AGORA no produto (e já executamos)

Não resolvemos sozinhos o backend de pagamento ou a força de vendas - mas o
**produto** pode parar de cavar a própria cova e começar a construir confiança e
o caminho de receita:

| Risco | Mitigação no produto | Status |
|-------|----------------------|:------:|
| nº1 Reserva fantasma | **Honestidade de status:** a reserva vira **"Solicitação"** e só fica "Confirmada" após a vinícola aceitar; copy ajustada; **captura de e-mail/WhatsApp** para a vinícola conseguir confirmar | ✅ feito |
| nº1 Falta de info | Comprovante com código, endereço, contato e política (entregue antes) | ✅ feito |
| nº2 Receita | **Seção "Para vinícolas"** explicando o modelo de parceria/comissão e captando o lead B2B | ✅ feito |
| nº4/nº5 Retenção/distribuição | **Captura de e-mail** (newsletter de roteiros/novidades) para reativar o usuário fora da janela da viagem | ✅ feito |
| Confiança geral | **Prova social** (nº de reservas, avaliações verificadas) e "Como funciona" claro | ✅ feito (parcial) |
| nº1 Transparência | Disponibilidade rotulada como **estimada** quando não confirmada pela vinícola | ✅ feito |

> O que **fica fora** do nosso alcance neste MVP (e precisa de decisão de
> negócio): integração real de agenda com as vinícolas, gateway de pagamento
> (Pix/cartão), e uma operação de aquisição (conteúdo/SEO + parcerias com
> hotelaria). Está registrado no roadmap do `README.md`.

---

## 5. Recomendação do analista (próximos 90 dias)

1. **Fechar 5-10 vinícolas-âncora** com agenda real e comissão acordada antes de
   escalar marketing. Sem oferta confiável, não gaste em demanda.
2. **Ativar pagamento** (Pix) e tornar a reserva de fato confirmável - transformar
   "Solicitação" em "Confirmada" via aceite da vinícola.
3. **Conteúdo + SEO** ("roteiro Vale dos Vinhedos", "o que fazer em Bento") para
   capturar a demanda na hora do planejamento - onde já perdemos para blogs.
4. **Medir** ativação (gerou roteiro), conversão (reservou) e a taxa de
   comparecimento (no-show) - o no-show é o termômetro da confiança.

A tecnologia já está à frente do negócio. O risco de 6 meses é **comercial e de
confiança**, não de código - e o produto agora joga a favor dos dois.
