// Reservas confirmadas (lista, render, stats, ICS)
// Dividido de script.js — carregado como <script> classico, ordem importa.

// =================== Reservas confirmadas ===================
const STORAGE_KEY = 'uvaevia.reservas';
const listEl = document.getElementById('reservations-list');
const emptyEl = document.getElementById('reservations-empty');
const actionsEl = document.getElementById('reservations-actions');

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

// Status derivado da reserva: pendente -> confirmada -> realizada -> cancelada.
function getReservaStatus(r) {
    if (r.cancelada) return { cls: 'is-cancelada', label: 'Cancelada' };
    if (diasAte(r.data) < 0) return { cls: 'is-realizada', label: 'Realizada' };
    const criada = Number(r.criadaEm || 0);
    if (criada && (Date.now() - criada) < (2 * 60 * 60 * 1000)) {
        return { cls: 'is-pendente', label: 'Pendente' };
    }
    return { cls: 'is-confirmada', label: 'Confirmada' };
}

function bucketDaReserva(r) {
    const d = diasAte(r.data);
    if (r.cancelada) return 'realizadas';
    if (d < 0)       return 'realizadas';
    if (d === 0)     return 'hoje';
    if (d === 1)     return 'amanha';
    if (d <= 7)      return 'semana';
    return 'futuras';
}
const BUCKET_LABELS = {
    hoje:       { title: 'Hoje',        hint: 'Aproveite!' },
    amanha:     { title: 'Amanhã',      hint: 'Prepare-se' },
    semana:     { title: 'Esta semana', hint: 'Próximos dias' },
    futuras:    { title: 'Em breve',    hint: 'Planejado' },
    realizadas: { title: 'Histórico',   hint: 'Já visitadas' },
};
const BUCKET_ORDER = ['hoje', 'amanha', 'semana', 'futuras', 'realizadas'];

// Gera um .ics e dispara o download — funciona em Google/Apple/Outlook agenda.
function downloadICS(r) {
    const dt = new Date(r.data + 'T' + r.horario + ':00');
    if (isNaN(dt.getTime())) return;
    const dtEnd = new Date(dt.getTime() + (90 * 60 * 1000));
    const toICS = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//UvaVia//Reserva//PT',
        'BEGIN:VEVENT',
        `UID:${r.id}@uvaevia`,
        `DTSTAMP:${toICS(new Date())}`,
        `DTSTART:${toICS(dt)}`,
        `DTEND:${toICS(dtEnd)}`,
        `SUMMARY:${r.experiencia} — ${r.vinicola}`,
        `LOCATION:${r.vinicola}, ${r.cidade}`,
        `DESCRIPTION:Reserva Uva & Via — ${r.pessoas} pessoa(s). Responsável: ${r.nome}.`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reserva-${r.vinicola.replace(/\s+/g, '-').toLowerCase()}-${r.data}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
}

function renderReservas() {
    const reservas = loadReservas().sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
    if (reservas.length === 0) {
        emptyEl.hidden = false;
        listEl.hidden = true;
        statsEl.hidden = true;
        actionsEl.hidden = true;
        listEl.innerHTML = '';
        return;
    }
    emptyEl.hidden = true;
    listEl.hidden = false;
    statsEl.hidden = false;
    actionsEl.hidden = false;

    const futuras = reservas.filter(r => diasAte(r.data) >= 0 && !r.cancelada);
    const proxima = futuras[0];
    const totalValor = reservas.filter(r => !r.cancelada).reduce((sum, r) => sum + r.total, 0);

    rstatTotal.textContent = reservas.length;
    rstatValor.textContent = fmtBRL(totalValor);
    if (proxima) {
        const d = diasAte(proxima.data);
        rstatProxima.textContent = d === 0 ? 'Hoje' : d === 1 ? 'Amanhã' : `Em ${d} dias`;
    } else {
        rstatProxima.textContent = 'Concluídas';
    }

    // Agrupa por bucket temporal
    const grupos = {};
    reservas.forEach(r => {
        const b = bucketDaReserva(r);
        (grupos[b] = grupos[b] || []).push(r);
    });

    listEl.innerHTML = '';
    BUCKET_ORDER.forEach(bucket => {
        const itens = grupos[bucket];
        if (!itens || itens.length === 0) return;
        const groupLi = document.createElement('li');
        groupLi.className = 'reservas-group';
        const meta = BUCKET_LABELS[bucket];
        const groupHtml = [
            `<header class="reservas-group-head">
                <h3>${meta.title}</h3>
                <small>${itens.length} · ${meta.hint}</small>
            </header>`,
            '<ul class="reservas-group-list" style="list-style:none;display:flex;flex-direction:column;gap:1rem;">',
        ];
        itens.forEach(r => {
            const isNext = proxima && r.id === proxima.id;
            const status = getReservaStatus(r);
            const podeAvaliar = diasAte(r.data) < 0 && !r.cancelada && !temAvaliacaoDoUsuario(r.id);
            const jaAvaliou   = diasAte(r.data) < 0 && temAvaliacaoDoUsuario(r.id);
            groupHtml.push(`
                <li class="reserva-card${isNext ? ' is-next' : ''}" data-reserva="${r.id}">
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
                        ${jaAvaliou ? '<p class="reserva-meta" style="color:var(--oliva);margin-top:.35rem;"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Você já avaliou esta experiência</p>' : ''}
                    </div>
                    <div class="reserva-side">
                        <span class="reserva-status ${status.cls}">${isNext ? 'Próxima' : status.label}</span>
                        <strong class="reserva-total">${fmtBRL(r.total)}</strong>
                        <div class="reserva-actions">
                            <button type="button" class="reserva-action" data-action="comprovante" data-id="${r.id}"><i class="fa-regular fa-rectangle-list"></i> Comprovante</button>
                            ${!r.cancelada && diasAte(r.data) >= 0 ? `<button type="button" class="reserva-action" data-action="ics" data-id="${r.id}" title="Adicionar à agenda"><i class="fa-regular fa-calendar-plus"></i> Agenda</button>` : ''}
                            ${podeAvaliar ? `<button type="button" class="reserva-action is-primary" data-action="avaliar" data-id="${r.id}"><i class="fa-regular fa-star"></i> Avaliar</button>` : ''}
                            ${!r.cancelada && diasAte(r.data) >= 0 ? `<button type="button" class="reserva-action is-danger" data-action="cancelar" data-id="${r.id}"><i class="fa-regular fa-circle-xmark"></i> Cancelar</button>` : ''}
                        </div>
                        <div class="aval-form-container" data-form-for="${r.id}"></div>
                    </div>
                </li>
            `);
        });
        groupHtml.push('</ul>');
        groupLi.innerHTML = groupHtml.join('');
        listEl.appendChild(groupLi);
    });

    listEl.querySelectorAll('[data-action="comprovante"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof openComprovante === 'function') openComprovante(btn.dataset.id);
        });
    });
    listEl.querySelectorAll('[data-action="cancelar"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const r = loadReservas().find(x => x.id === id);
            if (!r) return;
            // Mensagem ciente da política de cancelamento — transparência total.
            const exp = (window.EXPERIENCIAS || []).find(e => e.id === r.experiencia_id || e.nome === r.experiencia);
            const policy = (r.cancelamento && window.CANCELAMENTO?.[r.cancelamento])
                || (typeof getCancelamento === 'function' && exp ? getCancelamento(exp) : { prazoHoras: 24, key: 'flex' });
            const horas = (new Date(r.data + 'T' + (r.horario || '00:00') + ':00') - Date.now()) / 3.6e6;
            let msg;
            if (horas >= policy.prazoHoras) {
                msg = `Cancelar esta reserva?\n\nVocê está dentro do prazo de ${policy.prazoHoras}h — reembolso integral. A vaga será liberada para outros visitantes.`;
            } else if (policy.key === 'moderada' && horas >= 24) {
                msg = `Atenção: faltam menos de ${policy.prazoHoras}h.\n\nO reembolso será de 50% conforme a política desta experiência. Deseja cancelar mesmo assim?`;
            } else {
                msg = `Atenção: faltam menos de 24h para a visita.\n\nEsta reserva não é reembolsável. Deseja cancelar mesmo assim?`;
            }
            if (!confirm(msg)) return;
            const updated = loadReservas().filter(x => x.id !== id);
            saveReservas(updated);
            renderReservas();
            showToast('Reserva cancelada.');
        });
    });
    listEl.querySelectorAll('[data-action="ics"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const r = loadReservas().find(x => x.id === btn.dataset.id);
            if (r) {
                downloadICS(r);
                showToast('Arquivo .ics gerado — abra para adicionar à agenda.');
            }
        });
    });
    listEl.querySelectorAll('[data-action="avaliar"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const container = listEl.querySelector(`[data-form-for="${id}"]`);
            if (!container) return;
            if (container.firstChild) {
                container.innerHTML = '';
                return;
            }
            const r = loadReservas().find(x => x.id === id);
            if (r) container.appendChild(buildAvalForm(r));
        });
    });
}

