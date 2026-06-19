// Booking - montagem da reserva (selects, slots, resumo)
// Dividido de script.js - carregado como <script> classico, ordem importa.

// =================== Booking ===================
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

// Snapshot capacidade
HORARIOS.forEach(h => { h.capacidade = h.vagas; });

// Re-mapeia datas do seed para serem sempre futuras (demo nunca expira).
(function remapSeedDates() {
    const distinctDates = [...new Set(HORARIOS.map(h => h.data))].sort();
    if (distinctDates.length === 0) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const map = {};
    distinctDates.forEach((d, i) => {
        const target = new Date(today);
        target.setDate(target.getDate() + 3 + i); // hoje+3, +4, +5...
        const iso = target.toISOString().slice(0, 10);
        map[d] = iso;
    });
    HORARIOS.forEach(h => {
        if (map[h.data]) h.data = map[h.data];
    });
})();

// Horarios custom (criados via Gestao)
const STORAGE_HORARIOS = 'uvaevia.horarios.custom';
function loadCustomHorarios() {
    try { return JSON.parse(localStorage.getItem(STORAGE_HORARIOS)) || []; }
    catch { return []; }
}
function saveCustomHorarios(arr) {
    localStorage.setItem(STORAGE_HORARIOS, JSON.stringify(arr));
}
let customHorarios = loadCustomHorarios();

let selectedHorarioId = null;

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
    // Se o horario selecionado sumiu (vagas zeradas pelo tick em tempo real),
    // limpa a selecao para o resumo nao apontar um slot inexistente.
    if (selectedHorarioId && !horarios.some(h => h.id === selectedHorarioId)) {
        selectedHorarioId = null;
    }
    slotsBlock.hidden = false;
    updateSlotsTimestamp();
    if (horarios.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'slots-empty';
        empty.textContent = 'Sem horários disponíveis no momento, tente outra experiência.';
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

    // Política de cancelamento visível ANTES de reservar - transparência que
    // ataca a reclamação nº1 de plataformas de passeio.
    const polEl = document.getElementById('summary-policy');
    if (polEl && typeof getCancelamento === 'function') {
        const policy = getCancelamento(exp);
        polEl.innerHTML = `<span class="pol-badge pol-${policy.cls}"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ${policy.label}</span><small>${policy.desc}</small>`;
    }

    btnReservar.disabled = !inpNome.value.trim();
}

selVinicola.addEventListener('change', refreshExperiencias);
selExperiencia.addEventListener('change', refreshSlots);
inpPessoas.addEventListener('input', refreshSummary);
inpNome.addEventListener('input', refreshSummary);

