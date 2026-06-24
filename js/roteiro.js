// Form de planejamento + gerador e render de roteiro
// Dividido de script.js — carregado como <script> classico, ordem importa.

// =================== Form de planejamento + gerador de roteiro ===================
const INTEREST_KEYWORDS = {
    'degustacao-classica': ['degustaç', 'flight', 'intenso', 'clássica'],
    'degustacao-premium':  ['premium', 'masterclass', 'vertical', 'lote 43', 'dádivas', 'dadivas', 'dna 99', 'ícone', 'icone', 'agnus'],
    'harmonizado':         ['harmoniz', 'almoço', 'almoco', 'jantar'],
    'piquenique':          ['piquenique'],
    'visita-tecnica':      ['tour', 'cave', 'caves', 'história', 'historia', 'subterrânea', 'subterranea'],
    'boutique':            ['pizzato', 'torcello', 'larentis', 'don giovanni', 'dom cândido', 'dom candido', 'geisse', 'lídio', 'lidio'],
    'raros':               ['raros', 'lote 43', 'dádivas', 'dadivas', 'vertical', 'dna 99'],
    'sommelier':           ['masterclass', 'sommelier', 'vertical', 'jantar', 'lote 43'],
    'por-do-sol':          ['pôr do sol', 'por do sol', 'sol valduga', 'piquenique geisse'],
    'vindima':             ['vindima'],
    'familiar':            ['cristofoli', 'larentis', 'salton', 'pizzato', 'família', 'familia'],
    'arquitetura':         ['caves na rocha', 'castelo', 'toscano', 'arquitetura', 'piquenique'],
    'rapida':              [],
    'completa':            [],
};

const STORAGE_PLAN = 'uvaevia.plano.atual';
function savePlan(plano) {
    try { localStorage.setItem(STORAGE_PLAN, JSON.stringify(plano)); }
    catch (e) { /* ignore */ }
}
function loadPlan() {
    try { return JSON.parse(localStorage.getItem(STORAGE_PLAN)) || null; }
    catch { return null; }
}
function clearPlan() {
    localStorage.removeItem(STORAGE_PLAN);
}

function getAllHorarios() {
    return [...HORARIOS, ...customHorarios];
}
function getAllVinicolas() {
    return [...VINICOLAS, ...customVinicolas];
}

// Algoritmo v2 — scoring com 7 fatores + rationale por escolha.
// Fatores: tags diretas, keywords no nome, perfil de viagem, vagas atuais,
// preco vs orcamento, avaliacao media da vinicola, e variedade (anti-mesma-cidade-seguida).
// Aceita `seed` opcional para gerar variacoes do mesmo input ("regenerar").
function generateRoteiro(input) {
    const expsPerDay = { tranquilo: 2, equilibrado: 3, explorador: 4 }[input.pace] || 3;
    const totalExps = input.days * expsPerDay;
    const budgetPerExp = input.budget > 0 ? input.budget / totalExps / input.pessoas : Infinity;
    const seed = Number(input.seed || 0);

    // PRNG simples com seed — Mulberry32. Permite reproduzir / variar o roteiro
    // sem alterar o input.
    function makeRand(s) {
        let a = s >>> 0;
        return function () {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            let t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    const rand = makeRand(seed || Date.now());

    const scored = EXPERIENCIAS.map(e => {
        const vin = VINICOLAS.find(v => v.id === e.vinicola_id);
        const txt = (e.nome + ' ' + (vin ? vin.nome + ' ' + (vin.cidade || '') : '')).toLowerCase();
        const expTags = e.tags || [];
        const motivos = [];
        let score = 0;

        // Fator 1: interesses do visitante (tags + keywords)
        const tagsBateu = [];
        input.interests.forEach(tag => {
            if (expTags.includes(tag)) {
                score += 6;
                tagsBateu.push(tag);
            }
            const kws = INTEREST_KEYWORDS[tag] || [];
            if (kws.some(k => txt.includes(k))) score += 3;
        });
        if (tagsBateu.length) {
            const nomes = tagsBateu.map(t => TAG_LABEL[t] || t).join(', ').toLowerCase();
            motivos.push(`combina com ${nomes}`);
        }

        // Fator 2: perfil de viagem
        let bonusPerfil = 0;
        if (input.profile === 'familia' && expTags.includes('familiar')) { bonusPerfil = 2; motivos.push('ideal para família adulta'); }
        if (input.profile === 'solo'    && expTags.includes('rapida'))   { bonusPerfil = 2; motivos.push('ritmo enxuto para solo'); }
        if (input.profile === 'amigos'  && (expTags.includes('completa') || expTags.includes('harmonizado'))) { bonusPerfil = 2; motivos.push('experiência completa para grupos'); }
        if (input.profile === 'casal'   && (expTags.includes('por-do-sol') || expTags.includes('boutique')))  { bonusPerfil = 2; motivos.push('clima a dois'); }
        score += bonusPerfil;

        // Fator 3: vagas / disponibilidade
        const vagas = countHorariosDisponiveis(e.id);
        if (vagas > 0) score += 1;
        if (vagas > 5) score += 1;
        if (vagas > 10) { score += 1; motivos.push('vagas abertas'); }

        // Fator 4: preco vs orcamento
        if (e.preco <= budgetPerExp) { score += 2; motivos.push('dentro do orçamento'); }
        else if (input.budget > 0 && e.preco > budgetPerExp * 1.5) score -= 1;

        // Fator 5 (novo): avaliacoes da vinicola — bem avaliada pesa mais.
        if (typeof getMediaAvaliacoes === 'function' && vin) {
            const rating = getMediaAvaliacoes(vin.id);
            if (rating.total >= 3) {
                if (rating.media >= 4.5) { score += 3; motivos.push(`nota ${rating.media.toFixed(1)} entre visitantes`); }
                else if (rating.media >= 4.0) { score += 2; motivos.push(`nota ${rating.media.toFixed(1)}`); }
                else if (rating.media >= 3.5) { score += 1; }
            }
        }

        // Fator 6 (novo): aleatoriedade leve com seed — permite variacao real ao regenerar.
        score += rand() * 1.5;

        return { exp: e, vin, score, vagas, motivos };
    });

    scored.sort((a, b) => b.score - a.score || a.exp.preco - b.exp.preco);

    // Selecao: prioriza variedade (uma experiencia por vinicola), depois preenche.
    const chosen = [];
    const usedVin = new Set();
    for (const item of scored) {
        if (chosen.length >= totalExps) break;
        if (usedVin.has(item.exp.vinicola_id) && usedVin.size < VINICOLAS.length) continue;
        chosen.push(item);
        usedVin.add(item.exp.vinicola_id);
    }
    for (const item of scored) {
        if (chosen.length >= totalExps) break;
        if (!chosen.includes(item)) chosen.push(item);
    }

    // Distribuicao por dia + horarios sugeridos (com janelas calculadas).
    const startTimes = ['10:00', '12:30', '15:00', '17:30'];
    const dias = [];
    for (let i = 0; i < input.days; i++) {
        const fatia = chosen.slice(i * expsPerDay, (i + 1) * expsPerDay);
        // Otimiza ordem dentro do dia por proximidade geografica
        // (primeira eh ancora, demais sao escolhidas pela menor distancia ate a anterior).
        const ordenado = [];
        const sobra = fatia.slice();
        if (sobra.length) ordenado.push(sobra.shift());
        while (sobra.length) {
            const ultima = ordenado[ordenado.length - 1];
            sobra.sort((a, b) => distanciaKm(ultima.vin, a.vin) - distanciaKm(ultima.vin, b.vin));
            ordenado.push(sobra.shift());
        }
        const dia = ordenado.map((item, idx) => {
            const status = getDisponibilidadeStatus(item.vagas, 50);
            return {
                exp: item.exp,
                vin: item.vin,
                vagas: item.vagas,
                disponibilidade: status,
                horario_sugerido: startTimes[idx] || '17:30',
                motivos: item.motivos || [],
            };
        });
        if (dia.length > 0) dias.push(dia);
    }

    // Calcula tempo total + deslocamentos + horarios reais de chegada/saida por parada.
    let tempoTotal = 0;
    let tempoDesloc = 0;
    let distanciaTotalKm = 0;
    dias.forEach(dia => {
        let prev = null;
        let cursorMin = 0;
        dia.forEach((stop, idx) => {
            if (idx === 0) {
                cursorMin = timeToMin(stop.horario_sugerido);
                stop.chegada = stop.horario_sugerido;
                stop.deslocamentoMin = 0;
                stop.distanciaKm = 0;
            } else {
                const desloc = tempoDeslocamentoMin(prev.vin, stop.vin);
                const km = distanciaKm(prev.vin, stop.vin);
                stop.deslocamentoMin = desloc;
                stop.distanciaKm = km;
                cursorMin += prev.exp.duracao + desloc;
                stop.chegada = minToTime(cursorMin);
                stop.horario_sugerido = stop.chegada;
                tempoDesloc += desloc;
                distanciaTotalKm += km;
            }
            stop.saida = minToTime(cursorMin + stop.exp.duracao);
            tempoTotal += stop.exp.duracao;
            tempoTotal += stop.deslocamentoMin;
            prev = stop;
        });
    });

    const total = chosen.reduce((sum, it) => sum + it.exp.preco * input.pessoas, 0);
    const tagsPresentes = [...new Set(chosen.flatMap(it => it.exp.tags || []))];

    // Narrativa do roteiro — destaque as 2 caracteristicas mais fortes do conjunto.
    const sumario = construirSumarioRoteiro({ chosen, days: input.days, distanciaTotalKm });

    return {
        dias,
        total,
        chosen: chosen.map(c => ({ exp: c.exp, vin: c.vin, vagas: c.vagas, motivos: c.motivos })),
        tempoTotal,
        tempoDesloc,
        distanciaTotalKm,
        tagsPresentes,
        sumario,
        seed: input.seed || Date.now(),
        ...input,
    };
}

// Texto narrativo "porque esse roteiro" — frase curta exibida acima do roteiro.
function construirSumarioRoteiro({ chosen, days, distanciaTotalKm }) {
    const cidades = [...new Set(chosen.map(c => c.vin?.cidade).filter(Boolean))];
    const temPiq = chosen.some(c => (c.exp.tags || []).includes('piquenique'));
    const temPremium = chosen.some(c => (c.exp.tags || []).includes('degustacao-premium'));
    const temHarmoniza = chosen.some(c => (c.exp.tags || []).includes('harmonizado'));
    const temPorSol = chosen.some(c => (c.exp.tags || []).includes('por-do-sol'));
    const temBoutique = chosen.filter(c => c.vin?.tipo === 'boutique').length;

    const traços = [];
    if (temPremium)   traços.push('degustações premium');
    if (temHarmoniza) traços.push('harmonização gastronômica');
    if (temPiq)       traços.push('piquenique entre vinhedos');
    if (temPorSol)    traços.push('pôr do sol nas serras');
    if (temBoutique >= 2) traços.push('vinícolas boutique intimistas');

    const trecho = traços.slice(0, 2).join(' e ') || 'experiências variadas';
    const cidStr = cidades.length === 1
        ? cidades[0]
        : (cidades.slice(0, -1).join(', ') + ' e ' + cidades[cidades.length - 1]);

    return `Roteiro de ${days} ${days === 1 ? 'dia' : 'dias'} pelo Vale dos Vinhedos com foco em ${trecho}. ` +
           `Passa por ${cidStr}, com ~${Math.round(distanciaTotalKm)} km de deslocamento total — equilibrando ritmo e descobertas.`;
}

// =================== Renderiza Roteiro Sugerido ===================
const TAG_LABEL = {
    'degustacao-classica': 'Degustação clássica',
    'degustacao-premium':  'Degustação premium',
    'harmonizado':         'Gastronomia harmonizada',
    'piquenique':          'Piquenique',
    'visita-tecnica':      'Tour pelas caves',
    'boutique':            'Boutique',
    'raros':               'Vinhos raros',
    'sommelier':           'Com sommelier',
    'por-do-sol':          'Pôr do sol',
    'vindima':             'Vindima',
    'familiar':            'Familiar',
    'arquitetura':         'Arquitetura',
    'rapida':              'Experiência rápida',
    'completa':            'Experiência completa',
};

function renderRoteiro(plano) {
    const section = document.getElementById('roteiro');
    section.hidden = false;
    document.querySelector('[data-roteiro-link]')?.removeAttribute('hidden');
    document.querySelector('[data-mapa-link]')?.removeAttribute('hidden');

    const overBudget = plano.total > plano.budget && plano.budget > 0;
    const budgetPct = plano.budget > 0
        ? Math.min(100, Math.round((plano.total / plano.budget) * 100))
        : 0;
    const profileLabel = {
        casal: 'casal', solo: 'viajante solo', amigos: 'grupo de amigos', familia: 'família adulta'
    }[plano.profile] || 'viajante';

    document.getElementById('roteiro-subtitle').textContent =
        `${plano.chosen.length} experiências para ${profileLabel} (${plano.pessoas} ${plano.pessoas === 1 ? 'pessoa' : 'pessoas'}) · ritmo ${plano.pace}.`;

    // Sumario narrativo (novo) + barra de acoes do algoritmo
    let sumarioEl = document.getElementById('roteiro-sumario');
    if (!sumarioEl) {
        sumarioEl = document.createElement('div');
        sumarioEl.id = 'roteiro-sumario';
        sumarioEl.className = 'roteiro-sumario';
        const meta = document.getElementById('roteiro-meta');
        meta.parentNode.insertBefore(sumarioEl, meta);
    }
    sumarioEl.innerHTML = `
        <p class="roteiro-narrativa"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> ${plano.sumario || ''}</p>
        <div class="roteiro-algoritmo-actions">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-regenerar">
                <i class="fa-solid fa-shuffle btn-icon" aria-hidden="true"></i>
                Gerar nova variação
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-toggle-motivos">
                <i class="fa-regular fa-lightbulb btn-icon" aria-hidden="true"></i>
                <span>Mostrar critérios</span>
            </button>
        </div>
    `;

    const kmEl = plano.distanciaTotalKm > 0
        ? `<div class="meta-stat"><span>Distância</span><strong>${Math.round(plano.distanciaTotalKm)} km</strong></div>`
        : '';
    document.getElementById('roteiro-meta').innerHTML = `
        <div class="meta-stat"><span>Dias</span><strong>${plano.days}</strong></div>
        <div class="meta-stat"><span>Paradas</span><strong>${plano.chosen.length}</strong></div>
        <div class="meta-stat"><span>Tempo total</span><strong>${minutosParaHHMM(plano.tempoTotal)}</strong></div>
        <div class="meta-stat"><span>Deslocamento</span><strong>${minutosParaHHMM(plano.tempoDesloc)}</strong></div>
        ${kmEl}
        <div class="meta-stat"><span>Custo total</span><strong>${fmtBRL(plano.total)}</strong></div>
    `;

    // Tags
    document.getElementById('roteiro-tags').innerHTML = plano.tagsPresentes
        .filter(t => TAG_LABEL[t])
        .slice(0, 10)
        .map(t => `<span class="roteiro-tag">${TAG_LABEL[t]}</span>`)
        .join('');

    // Budget gauge
    document.getElementById('roteiro-budget').className = 'budget-gauge' + (overBudget ? ' over' : '');
    document.getElementById('roteiro-budget').innerHTML = `
        <span class="bar"><span style="width:${budgetPct}%"></span></span>
        <p>${overBudget
            ? `<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ${Math.round((plano.total / plano.budget) * 100 - 100)}% acima do orçamento`
            : (plano.budget > 0 ? `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Dentro do orçamento (${budgetPct}% utilizado)` : 'Orçamento não informado')}</p>
    `;

    // Dias
    document.getElementById('roteiro-days').innerHTML = plano.dias.map((dia, i) => `
        <article class="roteiro-day">
            <h4>Dia ${i + 1}${plano.startDate ? ' · ' + fmtDataCurta(addDays(plano.startDate, i)) : ''}</h4>
            <ol>
                ${dia.map(stop => {
                    const motivos = (stop.motivos || []).slice(0, 3);
                    const motivosHtml = motivos.length
                        ? `<div class="stop-motivos" hidden><i class="fa-regular fa-lightbulb" aria-hidden="true"></i> Escolhida porque: <em>${motivos.join(' · ')}</em></div>`
                        : '';
                    const chegadaSaida = stop.chegada && stop.saida
                        ? `<small class="stop-window">${stop.chegada} → ${stop.saida}</small>`
                        : '';
                    return `
                    <li class="roteiro-stop">
                        <div class="stop-when">
                            <span class="stop-time">${stop.horario_sugerido}</span>
                            <span class="stop-duracao">${stop.exp.duracao} min</span>
                            ${chegadaSaida}
                        </div>
                        <div class="stop-main">
                            <strong>${stop.exp.nome}</strong>
                            <span class="stop-place">
                                ${stop.vin.nome} · ${stop.vin.cidade || ''}
                                <span class="av-badge ${stop.disponibilidade.cls}">${stop.disponibilidade.label}</span>
                            </span>
                            ${motivosHtml}
                        </div>
                        <div class="stop-actions">
                            <span class="stop-price">${fmtBRL(stop.exp.preco * plano.pessoas)}</span>
                            <button type="button" class="btn btn-ghost" data-action="ver-vinicola" data-vin="${stop.vin.id}">Ver vinícola</button>
                            <button type="button" class="btn btn-primary" data-action="reservar" data-vin="${stop.vin.id}" data-exp="${stop.exp.id}" data-dia="${i}" data-horario="${stop.horario_sugerido}">Reservar</button>
                        </div>
                    </li>
                `;}).join('')}
            </ol>
        </article>
    `).join('');

    // Bind: toggle motivos
    section.querySelector('#btn-toggle-motivos')?.addEventListener('click', () => {
        const btn = section.querySelector('#btn-toggle-motivos');
        const todos = section.querySelectorAll('.stop-motivos');
        const todosVisiveis = [...todos].every(m => !m.hidden);
        todos.forEach(m => { m.hidden = todosVisiveis; });
        btn.querySelector('span').textContent = todosVisiveis ? 'Mostrar critérios' : 'Ocultar critérios';
    });

    // Bind: regenerar — gera variacao com novo seed
    section.querySelector('#btn-regenerar')?.addEventListener('click', () => {
        const novoInput = { ...plano, seed: Date.now() };
        const novoPlano = generateRoteiro(novoInput);
        window.resetMapaActiveDay?.(); // roteiro novo -> mapa volta para o Dia 1
        renderRoteiro(novoPlano);
        showToast('Variação gerada com base nos mesmos critérios.');
    });

    // Bind acoes
    section.querySelectorAll('[data-action="ver-vinicola"]').forEach(btn => {
        btn.addEventListener('click', () => openVinicola(Number(btn.dataset.vin)));
    });
    section.querySelectorAll('[data-action="reservar"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const vinId = Number(btn.dataset.vin);
            const expId = Number(btn.dataset.exp);
            document.getElementById('b-vinicola').value = vinId;
            refreshExperiencias();
            document.getElementById('b-experiencia').value = expId;

            // Preenche pessoas do plano antes dos slots (resumo usa o valor atual)
            const inpPessoasEl = document.getElementById('b-pessoas');
            if (inpPessoasEl && plano.pessoas) inpPessoasEl.value = plano.pessoas;

            // Pre-selecao defensiva do slot: data alvo (inicio + dia) e horario sugerido.
            // Se nada casar, mantem o comportamento atual (sem pre-selecao).
            let horarioAlvo = null;
            try {
                const diaIdx = Number(btn.dataset.dia);
                const horaSugerida = btn.dataset.horario || '';
                const dataAlvo = (plano.startDate && Number.isInteger(diaIdx) && diaIdx >= 0)
                    ? addDays(plano.startDate, diaIdx)
                    : '';
                const candidatos = getAllHorarios()
                    .filter(h => h.experiencia_id === expId && h.vagas > 0);
                if (horaSugerida) {
                    if (dataAlvo) {
                        horarioAlvo = candidatos.find(h => h.data === dataAlvo && h.horario === horaSugerida) || null;
                    }
                    if (!horarioAlvo) {
                        horarioAlvo = candidatos.find(h => h.horario === horaSugerida) || null;
                    }
                }
            } catch (err) {
                horarioAlvo = null;
            }

            if (horarioAlvo) {
                selectedHorarioId = horarioAlvo.id; // binding global de js/reserva.js
                refreshSlots({ preserveSelection: true });
            } else {
                refreshSlots();
            }
            document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        });
    });

    savePlan(plano);
    renderMapa(plano);

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('travel-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const startDate = fd.get('start-date') || '';
    const days      = Math.max(1, Number(fd.get('days')) || 1);
    const pessoas   = Math.max(1, Number(fd.get('people')) || 1);
    const budget    = Math.max(0, Number(fd.get('budget')) || 0);
    const profile   = fd.get('profile') || '';

    // Validacao
    const startDateInput = document.getElementById('start-date');
    const profileInput = document.getElementById('profile');
    let invalid = false;

    if (!startDate) {
        setFieldError(startDateInput, 'Informe a data de início da viagem.');
        invalid = true;
    } else if (isPastDate(startDate)) {
        setFieldError(startDateInput, 'A data de início não pode estar no passado.');
        invalid = true;
    } else {
        clearFieldError(startDateInput);
    }
    if (!profile) {
        setFieldError(profileInput, 'Selecione o perfil da viagem.');
        invalid = true;
    } else {
        clearFieldError(profileInput);
    }
    if (invalid) {
        showToast('Revise os campos destacados antes de gerar o roteiro.', 'error');
        return;
    }

    const input = {
        startDate, days, pessoas, budget, profile,
        pace:      fd.get('pace') || 'equilibrado',
        notes:     fd.get('notes') || '',
        interests: [...e.target.querySelectorAll('input[name="interests"]:checked')].map(i => i.value),
    };
    const plano = generateRoteiro(input);
    window.resetMapaActiveDay?.(); // roteiro novo -> mapa volta para o Dia 1
    renderRoteiro(plano);
    showToast('Roteiro gerado com base nas suas preferências!');
});

// Limpa erros em tempo real
['start-date', 'profile', 'days', 'people', 'budget'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearFieldError(el));
    if (el && el.tagName === 'SELECT') el.addEventListener('change', () => clearFieldError(el));
});

document.getElementById('roteiro-edit')?.addEventListener('click', () => {
    document.getElementById('planejar').scrollIntoView({ behavior: 'smooth' });
});

