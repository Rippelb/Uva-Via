# 🎤 Uva & Via - Runbook da Apresentação

Guia para rodar e demonstrar o **fluxo crítico** (gerar roteiro -> reservar) ao vivo,
sem erros. O fluxo principal e 100% client-side e o app e guest-first (nao exige
login), entao o modo mais seguro de rodar nao precisa de XAMPP/MySQL/PHP.

---

## 1. Baixar o projeto (na maquina da demo)

**Opcao A (recomendada) - clonar do GitHub:**
```bash
git clone https://github.com/Rippelb/Uva-Via.git uvaevia
cd uvaevia
```

**Opcao B - sem git:** no GitHub, botao verde **Code -> Download ZIP**, e extraia a pasta.

> Use sempre a versao do GitHub: e exatamente a que sera avaliada.

---

## 2. Rodar (escolha 1 dos modos)

### Modo 1 - 1 clique (mais seguro para a banca)
Duplo-clique em **`iniciar-demo.bat`**. Ele sobe o servidor e abre o navegador em
`http://localhost:8000`. **Deixe a janela preta aberta** durante a apresentacao.
(Precisa de Python OU Node instalado. Python: https://www.python.org/downloads/,
marque "Add to PATH" na instalacao.)

### Modo 2 - comando manual
```bash
python -m http.server 8000
```
Depois abra `http://localhost:8000` no Chrome.
(Alternativas: extensao **Live Server** do VS Code, ou `npx serve`.)

### Modo 3 - completo com backend (opcional, so se for mostrar login/Gestao)
XAMPP: clonar em `C:\xampp\htdocs\uvaevia`, ligar Apache + MySQL, importar
`db/install.mysql.sql` no phpMyAdmin, abrir `http://localhost/uvaevia`.
Admin: `admin@uvaevia.local` / `trocar123`. **Para a nota tecnica nao e necessario.**

> ⚠️ NAO abra por `file://` (duplo-clique no index.html). Precisa ser `http://`
> (servidor local), senao o service worker e o fetch nao funcionam.

---

## 3. Caminho de ouro (o que mostrar na ordem)

**Abertura (15s):** "Uva & Via, concierge de enoturismo do Vale dos Vinhedos. 67,7%
dos turistas chegam sem reserva e improvisam. A acao principal do MVP e gerar um
roteiro otimizado e reservar. Vou fazer do inicio ao fim."

1. **Home:** role mostrando a hero e "Como funciona" (3 passos).
2. **Gerar o roteiro (acao principal)** em **Planejar**:
   - Data de inicio: uma data futura (obrigatorio)
   - Dias: 2 | Pessoas: 2 | Orcamento: 1500
   - Perfil: Casal (obrigatorio)
   - Ritmo: Equilibrado
   - Interesses: marque 2 ou 3 (ex.: Por do sol, Boutique, Degustacao premium)
   - Clique **"Gerar roteiro personalizado"**.
3. **Resultado:** paradas por dia (horario, chegada->saida), custo total, tags, e o
   bloco **"Como vao se locomover?" (motorista da rodada)**. Role ate o **Mapa** e
   clique **"Abrir rota no Maps"**.
4. **Reservar (fecha o ciclo):** clique **"Reservar"** numa parada -> escolha um
   **horario** -> preencha o **nome** -> **"Solicitar reserva"**. O **comprovante com
   codigo (UV-XXXX)** abre na hora.
5. **"Reservas"** no menu: a reserva aparece la, com botao **Comprovante**. Fim. ✅

**Se sobrar tempo:** favoritos (coracao), busca no hero, avaliacoes verificadas,
"Instalar app" (PWA).

---

## 4. Plano B (rede de seguranca)
- **Roteiro pronto = botao de panico:** em Planejar tem **"Roteiros prontos"**. Um
  clique (ex.: "Fim de semana a dois") **gera o roteiro completo** ja preenchido. E a
  mesma acao principal funcionando.
- Os 2 unicos campos obrigatorios sao **data futura** e **perfil**. Se faltar, aparece
  aviso amigavel (nao quebra).
- Faca um **ensaio 10 min antes** na mesma maquina e navegador.
- Antes de comecar: **Ctrl+Shift+R** (hard refresh) para garantir a versao nova.

---

## 5. Teste do sistema inteiro (faca ANTES do dia)

Abra o Console (F12 -> Console) e confira que **nao aparece erro vermelho** em
nenhum passo.

**Home**
- [ ] Pagina carrega (nao fica em branco). Botao "Entrar" no topo.
- [ ] Busca no hero: digite "Miolo" e "espumante", clique num resultado.
- [ ] Sugestoes do dia: alterne os filtros (Hoje / Amanha / Fim de semana / Todas).
- [ ] Vinicolas boutique: cards aparecem, coracao favorita/desfavorita.

**Planejar / Roteiro (o fluxo critico)**
- [ ] Validacao: deixe a data vazia -> erro; data no passado -> erro; sem perfil -> erro.
- [ ] Gerar roteiro com dados validos -> aparece roteiro com paradas.
- [ ] Os 6 roteiros prontos funcionam (1 clique cada).
- [ ] Gauge de orcamento: teste um orcamento baixo (ex.: 200) -> mostra "acima".
- [ ] Bloco de transporte: troque entre Carro / Motorista por app / Transfer.
- [ ] "Gerar nova variacao" e "Mostrar criterios".

**Mapa**
- [ ] Abas por dia, timeline com paradas, sugestao de almoco quando ha intervalo.
- [ ] "Abrir rota no Maps", "Como chegar" por parada.
- [ ] Imprimir, Compartilhar (copia link), Exportar agenda (.ics baixa).

**Perfil da vinicola**
- [ ] Abrir por um card boutique ou pela busca.
- [ ] Comodidades, "O que esta incluido / o que levar", politica de cancelamento.
- [ ] Clicar um horario leva para a reserva ja preenchida.

**Experiencias**
- [ ] Buscar, filtrar por vinicola, ordenar.
- [ ] Chips de comodidade (pet, criancas, acessivel...) e "Favoritos".

**Reservar / Comprovante**
- [ ] Vinicola -> experiencia -> horario -> nome -> "Solicitar reserva".
- [ ] Politica de cancelamento aparece no resumo antes de reservar.
- [ ] Comprovante abre com codigo, endereco, contato, incluido, politica.
- [ ] "Copiar codigo" e "Adicionar a agenda".

**Minhas reservas**
- [ ] Reserva aparece agrupada (Hoje / Amanha / Esta semana).
- [ ] Botoes Comprovante, Agenda e Cancelar (cancelar mostra a regra de reembolso).

**Favoritos / Avaliacoes / B2B**
- [ ] Secao Favoritos lista o que foi salvo e permite remover.
- [ ] Avaliacoes: filtros (5 estrelas / 4+ / recentes / uteis), voto "util", selo verificado.
- [ ] "Para vinicolas": enviar o formulario de parceria.
- [ ] Newsletter no rodape: enviar um e-mail.

**Extras**
- [ ] Disponibilidade em tempo real: espere ~45s e veja vagas mudarem ("atualizado ha Xs").
- [ ] Mobile: F12 -> icone de dispositivo -> testar a home e gerar um roteiro.
- [ ] PWA: icone de instalar na barra do Chrome; e em DevTools -> Network -> Offline,
      recarregue: o app ainda abre.
- [ ] Duas abas abertas: favorite numa, aparece na outra (sincronizacao).

---

## 6. Checklist final (1 min antes de apresentar)
- [ ] `iniciar-demo.bat` rodando, aberto em `http://localhost:8000` (nao file://).
- [ ] Ensaiei o caminho de ouro 1x sem erro.
- [ ] Sei a data futura e o perfil que vou digitar.
- [ ] Chrome em tela cheia, zoom 100%, Console sem erros.
- [ ] Plano B (roteiro pronto) na ponta da lingua.
