// ---------- Dados (espelham o seed do banco) ----------
const VINICOLAS = [
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

const EXPERIENCIAS = [
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

const HORARIOS = [
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

// ---------- Form de planejamento ----------
document.getElementById('travel-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.interests = [...e.target.querySelectorAll('input[name="interests"]:checked')].map(i => i.value);
    console.log('Dados da viagem:', data);
    showToast('Roteiro sendo gerado com base nas suas preferências!');
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
    return HORARIOS.find(h => h.id === selectedHorarioId);
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

function refreshSlots() {
    const exp = getExperiencia();
    selectedHorarioId = null;
    slotsEl.innerHTML = '';
    if (!exp) {
        slotsBlock.hidden = true;
        summary.hidden = true;
        btnReservar.disabled = true;
        return;
    }
    const horarios = HORARIOS.filter(h => h.experiencia_id === exp.id && h.vagas > 0);
    slotsBlock.hidden = false;
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
        btn.innerHTML = `
            <span class="slot-date">${fmtData(h.data)}</span>
            <span class="slot-time">${h.horario}</span>
            <span class="slot-vagas">${h.vagas} vagas</span>
        `;
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

function renderReservas() {
    const reservas = loadReservas().sort((a, b) => {
        return (a.data + a.horario).localeCompare(b.data + b.horario);
    });
    if (reservas.length === 0) {
        emptyEl.hidden = false;
        listEl.hidden = true;
        listEl.innerHTML = '';
        return;
    }
    emptyEl.hidden = true;
    listEl.hidden = false;
    listEl.innerHTML = '';
    reservas.forEach(r => {
        const li = document.createElement('li');
        li.className = 'reserva-card';
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
                <span class="reserva-status">Confirmada</span>
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

    // Diminui as vagas no banco em memória
    const h = HORARIOS.find(x => x.id === hor.id);
    if (h) h.vagas = Math.max(0, h.vagas - pessoas);

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
});

// ---------- Init ----------
document.getElementById('year').textContent = new Date().getFullYear();
renderReservas();
