// ---------- Dados (espelham o seed do banco) ----------
// Estes arrays sao usados como fallback inicial. O api-client.js substitui
// o conteudo via splice() apos buscar do backend (api/*.php).
let VINICOLAS = [
    { id: 1, nome: 'Vinícola Pizzato', cidade: 'Bento Gonçalves' },
    { id: 2, nome: 'Vinícola Torcello', cidade: 'Monte Belo do Sul' },
    { id: 3, nome: 'Vinícola Larentis', cidade: 'Monte Belo do Sul' },
    { id: 4, nome: 'Lídio Carraro', cidade: 'Bento Gonçalves' },
    { id: 5, nome: 'Miolo Wine Group', cidade: 'Bento Gonçalves' },
    { id: 6, nome: 'Casa Valduga', cidade: 'Bento Gonçalves' },
    { id: 7, nome: 'Cave Geisse', cidade: 'Pinto Bandeira' },
    { id: 8, nome: 'Vinícola Salton', cidade: 'Bento Gonçalves' },
    { id: 9, nome: 'Don Giovanni', cidade: 'Bento Gonçalves' },
    { id: 10, nome: 'Dom Cândido', cidade: 'Garibaldi' },
];

let EXPERIENCIAS = [
    { id: 1, vinicola_id: 1, nome: 'Degustação de Merlots Pizzato', preco: 120, duracao: 75 },
    { id: 2, vinicola_id: 1, nome: 'Masterclass DNA 99', preco: 320, duracao: 120 },
    { id: 3, vinicola_id: 1, nome: 'Tour pelas caves Pizzato', preco: 60, duracao: 60 },
    { id: 4, vinicola_id: 2, nome: 'Degustação de espumantes Torcello', preco: 90, duracao: 60 },
    { id: 5, vinicola_id: 2, nome: 'Piquenique entre vinhedos Torcello', preco: 180, duracao: 120 },
    { id: 6, vinicola_id: 3, nome: 'Degustação do Tributo Larentis', preco: 150, duracao: 90 },
    { id: 7, vinicola_id: 3, nome: 'Tour história da família Larentis', preco: 40, duracao: 60 },
    { id: 8, vinicola_id: 3, nome: 'Vindima Larentis', preco: 220, duracao: 180 },
    { id: 9, vinicola_id: 4, nome: 'Degustação Agnus e Quorum', preco: 130, duracao: 60 },
    { id: 10, vinicola_id: 4, nome: 'Vertical Dádivas', preco: 380, duracao: 120 },
    { id: 11, vinicola_id: 4, nome: 'Tour Lídio Carraro', preco: 70, duracao: 75 },
    { id: 12, vinicola_id: 5, nome: 'Tour Miolo completo', preco: 80, duracao: 90 },
    { id: 13, vinicola_id: 5, nome: 'Experiência Lote 43', preco: 280, duracao: 90 },
    { id: 14, vinicola_id: 5, nome: 'Almoço harmonizado Miolo', preco: 450, duracao: 150 },
    { id: 15, vinicola_id: 6, nome: 'Tour Casa Valduga', preco: 70, duracao: 75 },
    { id: 16, vinicola_id: 6, nome: 'Jantar Maria Valduga', preco: 420, duracao: 180 },
    { id: 17, vinicola_id: 6, nome: 'Pôr do sol Valduga', preco: 120, duracao: 90 },
    { id: 18, vinicola_id: 7, nome: 'Caves na rocha Geisse', preco: 120, duracao: 75 },
    { id: 19, vinicola_id: 7, nome: 'Piquenique Geisse', preco: 250, duracao: 120 },
    { id: 20, vinicola_id: 7, nome: 'Degustação terroir Geisse', preco: 180, duracao: 60 },
    { id: 21, vinicola_id: 8, nome: 'Tour Salton histórico', preco: 45, duracao: 75 },
    { id: 22, vinicola_id: 8, nome: 'Degustação Intenso Salton', preco: 90, duracao: 60 },
    { id: 23, vinicola_id: 9, nome: 'Degustação clássica Don Giovanni', preco: 70, duracao: 60 },
    { id: 24, vinicola_id: 9, nome: 'Almoço toscano Don Giovanni', preco: 260, duracao: 120 },
    { id: 25, vinicola_id: 10, nome: 'Cave subterrânea Dom Cândido', preco: 45, duracao: 60 },
    { id: 26, vinicola_id: 10, nome: 'Flight de moscatéis Dom Cândido', preco: 55, duracao: 45 },
];

let HORARIOS = [
    { id: 1, experiencia_id: 1, data: '2026-05-08', horario: '10:00', vagas: 12 },
    { id: 2, experiencia_id: 1, data: '2026-05-08', horario: '14:00', vagas: 10 },
    { id: 3, experiencia_id: 1, data: '2026-05-09', horario: '11:00', vagas: 8 },
    { id: 4, experiencia_id: 2, data: '2026-05-09', horario: '15:00', vagas: 8 },
    { id: 5, experiencia_id: 3, data: '2026-05-10', horario: '09:30', vagas: 15 },
    { id: 6, experiencia_id: 4, data: '2026-05-08', horario: '10:00', vagas: 4 },
    { id: 7, experiencia_id: 4, data: '2026-05-08', horario: '16:00', vagas: 12 },
    { id: 8, experiencia_id: 5, data: '2026-05-09', horario: '16:00', vagas: 10 },
    { id: 9, experiencia_id: 6, data: '2026-05-09', horario: '11:00', vagas: 12 },
    { id: 10, experiencia_id: 7, data: '2026-05-10', horario: '14:00', vagas: 15 },
    { id: 11, experiencia_id: 8, data: '2026-05-10', horario: '09:00', vagas: 15 },
    { id: 12, experiencia_id: 9, data: '2026-05-08', horario: '10:00', vagas: 10 },
    { id: 13, experiencia_id: 10, data: '2026-05-09', horario: '14:00', vagas: 6 },
    { id: 14, experiencia_id: 11, data: '2026-05-08', horario: '15:30', vagas: 10 },
    { id: 15, experiencia_id: 12, data: '2026-05-08', horario: '10:00', vagas: 30 },
    { id: 16, experiencia_id: 13, data: '2026-05-09', horario: '11:00', vagas: 20 },
    { id: 17, experiencia_id: 14, data: '2026-05-08', horario: '12:30', vagas: 20 },
    { id: 18, experiencia_id: 15, data: '2026-05-09', horario: '10:00', vagas: 30 },
    { id: 19, experiencia_id: 16, data: '2026-05-10', horario: '20:00', vagas: 12 },
    { id: 20, experiencia_id: 17, data: '2026-05-09', horario: '17:30', vagas: 15 },
    { id: 21, experiencia_id: 18, data: '2026-05-10', horario: '10:00', vagas: 15 },
    { id: 22, experiencia_id: 19, data: '2026-05-10', horario: '12:00', vagas: 8 },
    { id: 23, experiencia_id: 20, data: '2026-05-08', horario: '11:00', vagas: 12 },
    { id: 24, experiencia_id: 21, data: '2026-05-08', horario: '10:00', vagas: 40 },
    { id: 25, experiencia_id: 22, data: '2026-05-09', horario: '15:00', vagas: 18 },
    { id: 26, experiencia_id: 23, data: '2026-05-09', horario: '14:00', vagas: 12 },
    { id: 27, experiencia_id: 24, data: '2026-05-10', horario: '12:30', vagas: 10 },
    { id: 28, experiencia_id: 25, data: '2026-05-10', horario: '10:00', vagas: 20 },
    { id: 29, experiencia_id: 26, data: '2026-05-09', horario: '11:30', vagas: 20 },
];

// ---------- Navegação ----------
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    });
});

// Active link conforme scroll
const sections = ['home', 'planejar', 'reservar', 'minhas-reservas', 'diferenciais']
    .map(id => document.getElementById(id))
    .filter(Boolean);
const navLinks = document.querySelectorAll('.nav-link');
const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
        }
    });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => spy.observe(s));

// Reveal on scroll
const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            reveal.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));

// ---------- Toast ----------
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = 'toast is-visible ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

// ---------- Form de planejamento + gerador de roteiro ----------
const INTEREST_KEYWORDS = {
    'degustacao-premium': ['premium', 'masterclass', 'vertical', 'lote 43', 'dádivas', 'dadivas', 'dna 99', 'icone'],
    'harmonizado':        ['harmonizad', 'almoço', 'almoco', 'jantar'],
    'boutique':           ['pizzato', 'torcello', 'larentis', 'don giovanni', 'dom cândido', 'dom candido'],
    'por-do-sol':         ['pôr do sol', 'por do sol', 'sol valduga'],
    'visita-tecnica':     ['tour', 'cave', 'caves', 'história', 'historia'],
    'gastronomia':        ['almoço', 'almoco', 'jantar', 'gastronomia', 'piquenique'],
    'vindima':            ['vindima'],
    'espumantes':         ['espumante', 'geisse', 'moscatéis', 'moscateis'],
    'masterclass':        ['masterclass', 'vertical'],
};

function addDays(isoDate, days) {
    const d = new Date(isoDate + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + days);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
}

function generateRoteiro(input) {
    const expsPerDay = { tranquilo: 2, equilibrado: 3, explorador: 4 }[input.pace] || 3;
    const totalExps = input.days * expsPerDay;
    const budgetPerExp = input.budget > 0 ? input.budget / totalExps / input.pessoas : Infinity;

    const scored = EXPERIENCIAS.map(e => {
        const vin = VINICOLAS.find(v => v.id === e.vinicola_id);
        const txt = (e.nome + ' ' + (vin ? vin.nome : '')).toLowerCase();
        let score = 0;
        input.interests.forEach(tag => {
            const kws = INTEREST_KEYWORDS[tag] || [];
            if (kws.some(k => txt.includes(k))) score += 5;
        });
        const vagas = countHorariosDisponiveis(e.id);
        if (vagas > 0) score += 1;
        if (e.preco <= budgetPerExp) score += 2;
        return { exp: e, vin, score, vagas };
    });

    scored.sort((a, b) => b.score - a.score || a.exp.preco - b.exp.preco);

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

    const startTimes = ['10:00', '12:30', '15:00', '17:30'];
    const dias = [];
    for (let i = 0; i < input.days; i++) {
        const dia = chosen.slice(i * expsPerDay, (i + 1) * expsPerDay).map((item, idx) => ({
            ...item,
            horario_sugerido: startTimes[idx] || '17:30',
        }));
        if (dia.length > 0) dias.push(dia);
    }

    const total = chosen.reduce((sum, it) => sum + it.exp.preco * input.pessoas, 0);
    return { dias, total, chosen, ...input };
}

function renderRoteiro(plano) {
    const el = document.getElementById('roteiro-output');
    const overBudget = plano.total > plano.budget && plano.budget > 0;
    const budgetPct = plano.budget > 0
        ? Math.min(100, Math.round((plano.total / plano.budget) * 100))
        : 0;
    const profileLabel = {
        casal: 'casal', solo: 'viajante solo', amigos: 'grupo de amigos', familia: 'família adulta'
    }[plano.profile] || 'viajante';

    el.hidden = false;
    el.innerHTML = `
        <header class="roteiro-header">
            <span class="planner-eyebrow">Seu roteiro está pronto</span>
            <h3>${plano.days} ${plano.days === 1 ? 'dia' : 'dias'} no Vale dos Vinhedos</h3>
            <p>${plano.chosen.length} experiências curadas para ${profileLabel} (${plano.pessoas} ${plano.pessoas === 1 ? 'pessoa' : 'pessoas'}) · ritmo ${plano.pace}.</p>
        </header>

        <div class="roteiro-meta">
            <div class="meta-stat"><span>Custo total</span><strong>${fmtBRL(plano.total)}</strong></div>
            <div class="meta-stat"><span>Por pessoa</span><strong>${fmtBRL(plano.pessoas > 0 ? plano.total / plano.pessoas : 0)}</strong></div>
            <div class="meta-stat"><span>Orçamento</span><strong>${fmtBRL(plano.budget)}</strong></div>
        </div>

        <div class="budget-gauge ${overBudget ? 'over' : ''}">
            <span class="bar"><span style="width:${budgetPct}%"></span></span>
            <p>${overBudget
                ? `⚠️ ${Math.round((plano.total / plano.budget) * 100 - 100)}% acima do orçamento`
                : `✓ Dentro do orçamento (${budgetPct}% utilizado)`}</p>
        </div>

        <div class="roteiro-days">
            ${plano.dias.map((dia, i) => `
                <article class="roteiro-day">
                    <h4>Dia ${i + 1}${plano.startDate ? ' · ' + addDays(plano.startDate, i) : ''}</h4>
                    <ol>
                        ${dia.map(item => `
                            <li class="roteiro-item">
                                <span class="time">${item.horario_sugerido}</span>
                                <div>
                                    <strong>${item.exp.nome}</strong>
                                    <span class="place">${item.vin.nome} · ${item.vin.cidade}</span>
                                </div>
                                <span class="price">${fmtBRL(item.exp.preco * plano.pessoas)}</span>
                            </li>
                        `).join('')}
                    </ol>
                </article>
            `).join('')}
        </div>

        <div class="roteiro-actions">
            <button type="button" class="btn btn-ghost" id="roteiro-clear">Descartar</button>
            <a href="#experiencias" class="btn btn-primary">Reservar experiências</a>
        </div>
    `;

    el.querySelector('#roteiro-clear').addEventListener('click', () => {
        el.hidden = true;
        el.innerHTML = '';
    });

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('travel-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const input = {
        startDate: fd.get('start-date') || '',
        days: Math.max(1, Number(fd.get('days')) || 1),
        pessoas: Math.max(1, Number(fd.get('people')) || 1),
        budget: Math.max(0, Number(fd.get('budget')) || 0),
        profile: fd.get('profile') || '',
        pace: fd.get('pace') || 'equilibrado',
        notes: fd.get('notes') || '',
        interests: [...e.target.querySelectorAll('input[name="interests"]:checked')].map(i => i.value),
    };
    const plano = generateRoteiro(input);
    renderRoteiro(plano);
    showToast('Roteiro gerado com base nas suas preferências!');
});

// ---------- Booking ----------
const selVinicola = document.getElementById('b-vinicola');
const selExperiencia = document.getElementById('b-experiencia');
const inpPessoas = document.getElementById('b-pessoas');
const inpNome = document.getElementById('b-nome');
const slotsBlock = document.getElementById('slots-block');
const slotsEl = document.getElementById('slots');
const summary = document.getElementById('summary');
const sumExp = document.getElementById('sum-exp');
const sumWhen = document.getElementById('sum-when');
const sumCalc = document.getElementById('sum-calc');
const sumTotal = document.getElementById('sum-total');
const btnReservar = document.getElementById('btn-reservar');

// Popular vinícolas
VINICOLAS.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.nome} — ${v.cidade}`;
    selVinicola.appendChild(opt);
});

// Snapshot da capacidade original de cada horário do catálogo
HORARIOS.forEach(h => { h.capacidade = h.vagas; });

// ---------- Horários custom (criados via Gestão) ----------
const STORAGE_HORARIOS = 'uvaevia.horarios.custom';
function loadCustomHorarios() {
    try { return JSON.parse(localStorage.getItem(STORAGE_HORARIOS)) || []; }
    catch { return []; }
}
function saveCustomHorarios(arr) {
    localStorage.setItem(STORAGE_HORARIOS, JSON.stringify(arr));
}
let customHorarios = loadCustomHorarios();

function getAllHorarios() {
    return [...HORARIOS, ...customHorarios];
}

let selectedHorarioId = null;

const fmtBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtData = (iso) => {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
};

function getExperiencia() {
    const id = Number(selExperiencia.value);
    return EXPERIENCIAS.find(e => e.id === id);
}

function getHorario() {
    return getAllHorarios().find(h => h.id === selectedHorarioId);
}

function refreshExperiencias() {
    const vid = Number(selVinicola.value);
    selExperiencia.innerHTML = '';
    selectedHorarioId = null;
    slotsBlock.hidden = true;
    summary.hidden = true;
    btnReservar.disabled = true;

    if (!vid) {
        selExperiencia.disabled = true;
        selExperiencia.appendChild(new Option('Escolha uma vinícola primeiro', ''));
        return;
    }
    selExperiencia.disabled = false;
    selExperiencia.appendChild(new Option('Selecione uma experiência…', ''));
    EXPERIENCIAS.filter(e => e.vinicola_id === vid).forEach(e => {
        selExperiencia.appendChild(new Option(`${e.nome} · ${fmtBRL(e.preco)}`, e.id));
    });
}

function vagasBadge(vagas, capacidade) {
    if (vagas === 0) return '<span class="vagas-badge full">Esgotado</span>';
    const pct = capacidade > 0 ? vagas / capacidade : 1;
    if (pct <= 0.3) return `<span class="vagas-badge low">Últimas ${vagas}</span>`;
    return `<span class="vagas-badge">${vagas} disponíveis</span>`;
}

function updateSlotsTimestamp() {
    const el = document.getElementById('slots-updated-time');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    el.dateTime = now.toISOString();
}

function refreshSlots(opts = {}) {
    const exp = getExperiencia();
    const previousVagas = {};
    document.querySelectorAll('.slot').forEach(s => {
        previousVagas[s.dataset.id] = Number(s.dataset.vagas);
    });

    if (!opts.preserveSelection) selectedHorarioId = null;
    slotsEl.innerHTML = '';
    if (!exp) {
        slotsBlock.hidden = true;
        summary.hidden = true;
        btnReservar.disabled = true;
        return;
    }
    const horarios = getAllHorarios().filter(h => h.experiencia_id === exp.id && h.vagas > 0);
    slotsBlock.hidden = false;
    updateSlotsTimestamp();
    if (horarios.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'slots-empty';
        empty.textContent = 'Sem horários disponíveis no momento — tente outra experiência.';
        slotsEl.appendChild(empty);
        summary.hidden = true;
        btnReservar.disabled = true;
        return;
    }
    horarios.forEach(h => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot';
        btn.dataset.id = h.id;
        btn.dataset.vagas = h.vagas;
        const cap = h.capacidade || h.vagas;
        btn.innerHTML = `
            <span class="slot-date">${fmtData(h.data)}</span>
            <span class="slot-time">${h.horario}</span>
            <span class="slot-vagas">${h.vagas} de ${cap}</span>
            ${vagasBadge(h.vagas, cap)}
        `;
        if (h.id === selectedHorarioId) btn.classList.add('is-selected');
        if (previousVagas[h.id] !== undefined && previousVagas[h.id] !== h.vagas) {
            btn.classList.add('is-updated');
            setTimeout(() => btn.classList.remove('is-updated'), 700);
        }
        btn.addEventListener('click', () => {
            selectedHorarioId = h.id;
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            refreshSummary();
        });
        slotsEl.appendChild(btn);
    });
    refreshSummary();
}

function refreshSummary() {
    const exp = getExperiencia();
    const hor = getHorario();
    const pessoas = Math.max(1, Number(inpPessoas.value) || 0);
    if (!exp || !hor) {
        summary.hidden = true;
        btnReservar.disabled = true;
        return;
    }
    summary.hidden = false;
    const total = exp.preco * pessoas;
    sumExp.textContent = exp.nome;
    sumWhen.textContent = `${fmtData(hor.data)} · ${hor.horario}`;
    sumCalc.textContent = `${pessoas} × ${fmtBRL(exp.preco)}`;
    sumTotal.textContent = fmtBRL(total);
    btnReservar.disabled = !inpNome.value.trim();
}

selVinicola.addEventListener('change', refreshExperiencias);
selExperiencia.addEventListener('change', refreshSlots);
inpPessoas.addEventListener('input', refreshSummary);
inpNome.addEventListener('input', refreshSummary);

// ---------- Reservas confirmadas ----------
const STORAGE_KEY = 'uvaevia.reservas';
const listEl = document.getElementById('reservations-list');
const emptyEl = document.getElementById('reservations-empty');

function loadReservas() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
}
function saveReservas(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

const statsEl = document.getElementById('reservations-stats');
const rstatTotal = document.getElementById('rstat-total');
const rstatProxima = document.getElementById('rstat-proxima');
const rstatValor = document.getElementById('rstat-valor');

function diasAte(isoData) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const alvo = new Date(isoData + 'T00:00:00');
    return Math.round((alvo - hoje) / (1000 * 60 * 60 * 24));
}

function renderReservas() {
    const reservas = loadReservas().sort((a, b) => {
        return (a.data + a.horario).localeCompare(b.data + b.horario);
    });
    if (reservas.length === 0) {
        emptyEl.hidden = false;
        listEl.hidden = true;
        statsEl.hidden = true;
        listEl.innerHTML = '';
        return;
    }
    emptyEl.hidden = true;
    listEl.hidden = false;
    statsEl.hidden = false;

    const futuras = reservas.filter(r => diasAte(r.data) >= 0);
    const proxima = futuras[0];
    const totalValor = reservas.reduce((sum, r) => sum + r.total, 0);

    rstatTotal.textContent = reservas.length;
    rstatValor.textContent = fmtBRL(totalValor);
    if (proxima) {
        const d = diasAte(proxima.data);
        rstatProxima.textContent = d === 0 ? 'Hoje' : d === 1 ? 'Amanhã' : `Em ${d} dias`;
    } else {
        rstatProxima.textContent = 'Concluídas';
    }

    listEl.innerHTML = '';
    reservas.forEach(r => {
        const isNext = proxima && r.id === proxima.id;
        const d = diasAte(r.data);
        const statusLabel = d < 0 ? 'Realizada' : (isNext ? 'Próxima' : 'Confirmada');
        const li = document.createElement('li');
        li.className = 'reserva-card' + (isNext ? ' is-next' : '');
        li.innerHTML = `
            <div class="reserva-when">
                <span class="reserva-day">${fmtData(r.data)}</span>
                <span class="reserva-time">${r.horario}</span>
            </div>
            <div class="reserva-info">
                <h3>${r.experiencia}</h3>
                <p class="reserva-place">${r.vinicola} · ${r.cidade}</p>
                <p class="reserva-meta">
                    <span>${r.pessoas} ${r.pessoas === 1 ? 'pessoa' : 'pessoas'}</span>
                    <span>·</span>
                    <span>Responsável: ${r.nome}</span>
                </p>
            </div>
            <div class="reserva-side">
                <span class="reserva-status">${statusLabel}</span>
                <strong class="reserva-total">${fmtBRL(r.total)}</strong>
                <button class="reserva-cancel" data-id="${r.id}" type="button">Cancelar</button>
            </div>
        `;
        listEl.appendChild(li);
    });

    listEl.querySelectorAll('.reserva-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const updated = loadReservas().filter(r => r.id !== id);
            saveReservas(updated);
            renderReservas();
            showToast('Reserva cancelada.');
        });
    });
}

document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const exp = getExperiencia();
    const hor = getHorario();
    const vin = VINICOLAS.find(v => v.id === Number(selVinicola.value));
    const pessoas = Math.max(1, Number(inpPessoas.value) || 0);
    const nome = inpNome.value.trim();
    if (!exp || !hor || !vin || !nome) {
        showToast('Preencha todos os campos antes de reservar.', 'error');
        return;
    }
    const reserva = {
        id: 'r_' + Date.now(),
        vinicola: vin.nome,
        cidade: vin.cidade,
        experiencia: exp.nome,
        data: hor.data,
        horario: hor.horario,
        pessoas,
        nome,
        total: exp.preco * pessoas,
    };
    const reservas = loadReservas();
    reservas.push(reserva);
    saveReservas(reservas);

    // Diminui as vagas (em memória para seed, persistente para custom)
    const seedH = HORARIOS.find(x => x.id === hor.id);
    if (seedH) seedH.vagas = Math.max(0, seedH.vagas - pessoas);
    const customH = customHorarios.find(x => x.id === hor.id);
    if (customH) {
        customH.vagas = Math.max(0, customH.vagas - pessoas);
        saveCustomHorarios(customHorarios);
    }

    btnReservar.classList.add('is-success');
    setTimeout(() => btnReservar.classList.remove('is-success'), 900);

    showToast(`Reserva confirmada em ${vin.nome}!`);
    renderReservas();

    // reset parcial
    selectedHorarioId = null;
    refreshSlots();
    inpNome.value = '';
    refreshSummary();

    // rola para a lista
    document.getElementById('minhas-reservas').scrollIntoView({ behavior: 'smooth' });
    renderManageTable();
    renderExperiencias();
});

// ---------- Catálogo de Experiências ----------
const expSearch = document.getElementById('exp-search');
const expVinicolaSel = document.getElementById('exp-vinicola');
const expSort = document.getElementById('exp-sort');
const expGrid = document.getElementById('exp-grid');
const expEmpty = document.getElementById('exp-empty');
const expCount = document.getElementById('exp-count');

VINICOLAS.forEach(v => {
    expVinicolaSel.appendChild(new Option(v.nome, v.id));
});

function countHorariosDisponiveis(expId) {
    return getAllHorarios()
        .filter(h => h.experiencia_id === expId && h.vagas > 0)
        .reduce((sum, h) => sum + h.vagas, 0);
}

function renderExperiencias() {
    const term = expSearch.value.trim().toLowerCase();
    const vid = Number(expVinicolaSel.value) || null;
    const sort = expSort.value;

    let lista = EXPERIENCIAS.slice();
    if (term) lista = lista.filter(e => e.nome.toLowerCase().includes(term));
    if (vid) lista = lista.filter(e => e.vinicola_id === vid);

    const sorters = {
        'nome': (a, b) => a.nome.localeCompare(b.nome),
        'preco-asc': (a, b) => a.preco - b.preco,
        'preco-desc': (a, b) => b.preco - a.preco,
        'duracao': (a, b) => a.duracao - b.duracao,
    };
    lista.sort(sorters[sort] || sorters.nome);

    expCount.textContent = lista.length;
    expGrid.innerHTML = '';
    expEmpty.hidden = lista.length > 0;

    lista.forEach(e => {
        const vin = VINICOLAS.find(v => v.id === e.vinicola_id);
        const vagas = countHorariosDisponiveis(e.id);
        const card = document.createElement('article');
        card.className = 'exp-card';
        card.innerHTML = `
            <span class="exp-vinicola">${vin.nome} · ${vin.cidade}</span>
            <h3>${e.nome}</h3>
            <div class="exp-meta">
                <span>⏱ <strong>${e.duracao} min</strong></span>
                <span>💰 <strong>${fmtBRL(e.preco)}</strong>/pessoa</span>
                <span>${vagas > 0 ? `🟢 ${vagas} vagas` : '🔒 sem vagas'}</span>
            </div>
            <button class="btn btn-primary" type="button" data-vinicola="${e.vinicola_id}" data-experiencia="${e.id}" ${vagas === 0 ? 'disabled' : ''}>
                ${vagas === 0 ? 'Indisponível' : 'Reservar'}
            </button>
        `;
        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            selVinicola.value = btn.dataset.vinicola;
            refreshExperiencias();
            selExperiencia.value = btn.dataset.experiencia;
            refreshSlots();
            document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        });
        expGrid.appendChild(card);
    });
}

expSearch.addEventListener('input', renderExperiencias);
expVinicolaSel.addEventListener('change', renderExperiencias);
expSort.addEventListener('change', renderExperiencias);

// ---------- Gestão de horários ----------
const mVinicola = document.getElementById('m-vinicola');
const mExperiencia = document.getElementById('m-experiencia');
const mData = document.getElementById('m-data');
const mHorario = document.getElementById('m-horario');
const mCapacidade = document.getElementById('m-capacidade');
const manageTable = document.getElementById('manage-table');
const statTotal = document.getElementById('stat-total');
const statVagas = document.getElementById('stat-vagas');
const statOcupacao = document.getElementById('stat-ocupacao');

VINICOLAS.forEach(v => {
    mVinicola.appendChild(new Option(v.nome, v.id));
});

mVinicola.addEventListener('change', () => {
    mExperiencia.innerHTML = '';
    const vid = Number(mVinicola.value);
    if (!vid) {
        mExperiencia.disabled = true;
        mExperiencia.appendChild(new Option('Escolha uma vinícola primeiro', ''));
        return;
    }
    mExperiencia.disabled = false;
    mExperiencia.appendChild(new Option('Selecione uma experiência…', ''));
    EXPERIENCIAS.filter(e => e.vinicola_id === vid).forEach(e => {
        mExperiencia.appendChild(new Option(e.nome, e.id));
    });
});

function renderManageTable() {
    const todos = getAllHorarios().slice().sort((a, b) => {
        return (a.data + a.horario).localeCompare(b.data + b.horario);
    });

    if (todos.length === 0) {
        manageTable.innerHTML = '<p class="manage-empty">Nenhum horário cadastrado.</p>';
        statTotal.textContent = '0';
        statVagas.textContent = '0';
        statOcupacao.textContent = '0%';
        return;
    }

    let totalVagasIniciais = 0;
    let totalVagasRestantes = 0;

    manageTable.innerHTML = '';
    todos.forEach(h => {
        const exp = EXPERIENCIAS.find(e => e.id === h.experiencia_id);
        const vin = exp ? VINICOLAS.find(v => v.id === exp.vinicola_id) : null;
        const capacidade = h.capacidade ?? h.vagas;
        const ocupadas = capacidade - h.vagas;
        const pct = capacidade > 0 ? Math.round((ocupadas / capacidade) * 100) : 0;
        const isCustom = customHorarios.some(c => c.id === h.id);

        totalVagasIniciais += capacidade;
        totalVagasRestantes += h.vagas;

        const barClass = pct >= 100 ? 'full' : (pct >= 70 ? 'low' : '');

        const row = document.createElement('div');
        row.className = 'manage-row' + (isCustom ? ' is-custom' : '');
        row.innerHTML = `
            <div class="manage-when">
                <span class="date">${fmtData(h.data)}</span>
                <span class="time">${h.horario}</span>
            </div>
            <div class="manage-exp">
                <h4>${exp ? exp.nome : '—'}</h4>
                <span class="vin">${vin ? vin.nome : '—'}</span>
            </div>
            <div class="manage-cap">
                <span>${h.vagas}/${capacidade} vagas · ${pct}% ocupado</span>
                <span class="bar ${barClass}"><span style="width:${pct}%"></span></span>
            </div>
            <span class="manage-badge ${isCustom ? 'custom' : ''}">${isCustom ? 'Custom' : 'Catálogo'}</span>
            <button class="manage-delete" type="button" data-id="${h.id}" ${isCustom ? '' : 'disabled title="Horários do catálogo não podem ser removidos"'}>
                Excluir
            </button>
        `;
        manageTable.appendChild(row);
    });

    manageTable.querySelectorAll('.manage-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const id = Number(btn.dataset.id);
            customHorarios = customHorarios.filter(h => h.id !== id);
            saveCustomHorarios(customHorarios);
            renderManageTable();
            renderExperiencias();
            showToast('Horário removido.');
        });
    });

    statTotal.textContent = todos.length;
    statVagas.textContent = totalVagasRestantes;
    const ocup = totalVagasIniciais > 0
        ? Math.round(((totalVagasIniciais - totalVagasRestantes) / totalVagasIniciais) * 100)
        : 0;
    statOcupacao.textContent = ocup + '%';
}

document.getElementById('manage-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const expId = Number(mExperiencia.value);
    const exp = EXPERIENCIAS.find(x => x.id === expId);
    const data = mData.value;
    const horario = mHorario.value;
    const capacidade = Math.max(1, Number(mCapacidade.value) || 0);

    if (!exp || !data || !horario || !capacidade) {
        showToast('Preencha todos os campos da gestão.', 'error');
        return;
    }

    const novoId = 1000 + Date.now() % 100000; // id alto para não colidir com seed
    const novo = {
        id: novoId,
        experiencia_id: expId,
        data,
        horario,
        capacidade,
        vagas: capacidade,
    };
    customHorarios.push(novo);
    saveCustomHorarios(customHorarios);

    showToast(`Horário criado: ${fmtData(data)} às ${horario}.`);
    e.target.reset();
    mExperiencia.disabled = true;
    mExperiencia.innerHTML = '<option value="">Escolha uma vinícola primeiro</option>';
    mCapacidade.value = 12;
    renderManageTable();
    renderExperiencias();
    if (selExperiencia.value && Number(selExperiencia.value) === expId) refreshSlots();
});

// ---------- Sync entre abas (disponibilidade em tempo real) ----------
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_HORARIOS) {
        customHorarios = loadCustomHorarios();
        if (selVinicola.value) refreshSlots({ preserveSelection: true });
        renderExperiencias();
        renderManageTable();
        showToast('Disponibilidade atualizada em outra aba.');
    }
    if (e.key === STORAGE_KEY) {
        renderReservas();
    }
});

// ---------- Init ----------
document.getElementById('year').textContent = new Date().getFullYear();
renderReservas();
renderExperiencias();
renderManageTable();
