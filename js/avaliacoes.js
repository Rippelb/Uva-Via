// Avaliacoes (reviews)
// Dividido de script.js - carregado como <script> classico, ordem importa.

// =================== AVALIACOES (reviews) ===================
const STORAGE_AVAL = 'uvaevia.avaliacoes';
let avalFilter = 'todas';

// --- Votos de "útil" (helpful) - confiança ao estilo GetYourGuide/Tripadvisor.
const STORAGE_AVAL_UTEIS = 'uvaevia.avaliacoes.uteis';
function loadUteis() {
    try { return JSON.parse(localStorage.getItem(STORAGE_AVAL_UTEIS)) || {}; }
    catch { return {}; }
}
function saveUteis(o) { try { localStorage.setItem(STORAGE_AVAL_UTEIS, JSON.stringify(o)); } catch { /* ignore */ } }
function hashId(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
// Baseline para a comunidade não nascer com tudo zerado (apenas para reviews seed).
function baselineUteis(a) {
    if (a.local) return 0;
    return 3 + (hashId(a.id) % 9) + (a.nota >= 5 ? 4 : 0);
}
function getUteisTotal(a) {
    const stored = loadUteis()[a.id];
    return baselineUteis(a) + (stored?.count || 0);
}
function jaVotouUtil(a) { return !!loadUteis()[a.id]?.voted; }
function voteUtil(id) {
    const o = loadUteis();
    const cur = o[id] || { count: 0, voted: false };
    if (cur.voted) { cur.count = Math.max(0, (cur.count || 0) - 1); cur.voted = false; }
    else { cur.count = (cur.count || 0) + 1; cur.voted = true; }
    o[id] = cur; saveUteis(o);
    return cur.voted;
}
// Visita verificada: review veio de uma reserva real (local) ou é curada (seed).
function avalVerificada(a) {
    return !!(a.verificada || a.local || a.reserva_id || String(a.id).startsWith('av_seed'));
}

function loadAvaliacoes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_AVAL)) || []; }
    catch { return []; }
}
function saveAvaliacoes(arr) {
    localStorage.setItem(STORAGE_AVAL, JSON.stringify(arr));
}
function getAllAvaliacoes() {
    return [...AVALIACOES_SEED, ...loadAvaliacoes()];
}
function temAvaliacaoDoUsuario(reservaId) {
    return loadAvaliacoes().some(a => a.reserva_id === reservaId);
}
function getMediaAvaliacoes(vinId) {
    const list = getAllAvaliacoes().filter(a => a.vinicola_id === vinId);
    if (list.length === 0) return { media: 0, total: 0 };
    const soma = list.reduce((s, a) => s + a.nota, 0);
    return { media: soma / list.length, total: list.length };
}
function getMediaGeral() {
    const all = getAllAvaliacoes();
    if (all.length === 0) return { media: 0, total: 0 };
    const soma = all.reduce((s, a) => s + a.nota, 0);
    return { media: soma / all.length, total: all.length };
}

// Renderiza N estrelas. Usa fa-solid para cheia, fa-regular para vazia.
function renderEstrelas(nota, tamanho = '') {
    const cheia = Math.round(nota || 0);
    let html = `<span class="aval-stars ${tamanho}" aria-label="${(nota||0).toFixed(1)} de 5 estrelas">`;
    for (let i = 1; i <= 5; i++) {
        html += i <= cheia
            ? '<i class="fa-solid fa-star" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-star star-empty" aria-hidden="true"></i>';
    }
    return html + '</span>';
}

function fmtDataAval(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

function avalCardHTML(a, opts = {}) {
    const vin = getAllVinicolas().find(v => v.id === a.vinicola_id);
    const exp = EXPERIENCIAS.find(e => e.id === a.experiencia_id);
    const initial = (a.autor || '?').charAt(0).toUpperCase();
    const showVin = opts.showVin !== false;
    const verificada = avalVerificada(a);
    const uteis = getUteisTotal(a);
    const votou = jaVotouUtil(a);
    return `
        <article class="aval-card" data-id="${a.id}">
            <div class="aval-card-header">
                <div class="aval-author">
                    <span class="aval-avatar" aria-hidden="true">${initial}</span>
                    <div class="aval-author-info">
                        <strong>${a.autor}</strong>
                        <small>${a.perfil || 'Visitante'}${verificada ? ' · <span class="aval-verif"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> visita verificada</span>' : ''}</small>
                    </div>
                </div>
                ${renderEstrelas(a.nota, 'sm')}
            </div>
            ${showVin && vin ? `<span class="aval-vin">${vin.nome} · ${vin.cidade || ''}</span>` : ''}
            ${exp ? `<span class="aval-exp">${exp.nome}</span>` : ''}
            <p class="aval-comment">${a.comentario}</p>
            <footer class="aval-card-foot">
                <span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${fmtDataAval(a.data)}</span>
                ${a.local ? '<span><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Sua avaliação</span>' : ''}
                <button type="button" class="aval-util${votou ? ' is-voted' : ''}" data-util="${a.id}" aria-pressed="${votou}" title="Esta avaliação foi útil?">
                    <i class="fa-regular fa-thumbs-up" aria-hidden="true"></i> Útil <span class="aval-util-count">${uteis}</span>
                </button>
            </footer>
        </article>
    `;
}

function renderAvaliacoes() {
    const grid = document.getElementById('aval-grid');
    const empty = document.getElementById('aval-empty');
    const mediaEl = document.getElementById('aval-media');
    const totalEl = document.getElementById('aval-total');
    const starsEl = document.getElementById('aval-stars-media');
    if (!grid) return;

    const all = getAllAvaliacoes();
    const { media, total } = getMediaGeral();
    if (mediaEl) mediaEl.textContent = total > 0 ? media.toFixed(1) : '-';
    if (totalEl) totalEl.textContent = total;
    const heroRating = document.getElementById('hero-rating');
    if (heroRating && total > 0) heroRating.textContent = media.toFixed(1);
    if (starsEl) {
        if (total > 0) {
            const inner = renderEstrelas(media, 'lg').replace(/^<span[^>]*>|<\/span>$/g, '');
            starsEl.innerHTML = inner;
        } else {
            starsEl.innerHTML = '';
        }
    }

    let lista = all.slice();
    if (avalFilter === '5')      lista = lista.filter(a => a.nota === 5);
    else if (avalFilter === '4') lista = lista.filter(a => a.nota >= 4);
    if (avalFilter === 'uteis') {
        lista.sort((a, b) => getUteisTotal(b) - getUteisTotal(a));
    } else {
        // ordenacao padrao: recentes primeiro
        lista.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
    }
    lista = lista.slice(0, avalFilter === 'recentes' ? 9 : 12);

    if (lista.length === 0) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;
    grid.innerHTML = lista.map(a => avalCardHTML(a)).join('');
}
window.renderAvaliacoes = renderAvaliacoes;

document.querySelectorAll('.aval-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        avalFilter = btn.dataset.avalFilter;
        document.querySelectorAll('.aval-filter').forEach(b => {
            const on = b.dataset.avalFilter === avalFilter;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-selected', String(on));
        });
        renderAvaliacoes();
    });
});

// Voto "útil" - delegação global, funciona em qualquer card de avaliação.
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.aval-util');
    if (!btn) return;
    const id = btn.dataset.util;
    const voted = voteUtil(id);
    document.querySelectorAll(`.aval-util[data-util="${id}"]`).forEach(b => {
        b.classList.toggle('is-voted', voted);
        b.setAttribute('aria-pressed', String(voted));
        const c = b.querySelector('.aval-util-count');
        if (c) {
            const n = Number(c.textContent) || 0;
            c.textContent = voted ? n + 1 : Math.max(0, n - 1);
        }
    });
});

// Formulario inline de avaliacao numa reserva passada
function buildAvalForm(reserva) {
    const form = document.createElement('div');
    form.className = 'aval-form';
    form.innerHTML = `
        <span class="aval-form-head">Avaliar sua visita a ${reserva.vinicola}</span>
        <div class="aval-rating-picker" role="radiogroup" aria-label="Sua nota de 1 a 5 estrelas">
            ${[1,2,3,4,5].map(n => `<button type="button" data-n="${n}" aria-label="${n} estrela${n>1?'s':''}"><i class="fa-regular fa-star" aria-hidden="true"></i></button>`).join('')}
        </div>
        <textarea placeholder="Conte como foi a experiência: atendimento, vinhos, ambiente, harmonização…" maxlength="320" rows="3"></textarea>
        <div class="aval-form-actions">
            <button type="button" class="btn btn-ghost" data-aval-cancel>Cancelar</button>
            <button type="button" class="btn btn-primary" data-aval-send disabled>Enviar avaliação</button>
        </div>
    `;
    let notaSelecionada = 0;
    const buttons = form.querySelectorAll('.aval-rating-picker button');
    const textarea = form.querySelector('textarea');
    const sendBtn = form.querySelector('[data-aval-send]');
    const cancelBtn = form.querySelector('[data-aval-cancel]');

    buttons.forEach(b => {
        b.addEventListener('click', () => {
            notaSelecionada = Number(b.dataset.n);
            buttons.forEach(x => {
                const n = Number(x.dataset.n);
                x.classList.toggle('is-active', n <= notaSelecionada);
                const i = x.querySelector('i');
                if (i) {
                    i.classList.toggle('fa-solid', n <= notaSelecionada);
                    i.classList.toggle('fa-regular', n > notaSelecionada);
                }
            });
            sendBtn.disabled = notaSelecionada === 0;
        });
    });
    cancelBtn.addEventListener('click', () => form.remove());
    sendBtn.addEventListener('click', () => {
        if (notaSelecionada < 1) return;
        const vin = getAllVinicolas().find(v => v.nome === reserva.vinicola);
        const exp = EXPERIENCIAS.find(e => e.nome === reserva.experiencia);
        const nova = {
            id: 'av_' + Date.now(),
            reserva_id: reserva.id,
            vinicola_id: vin ? vin.id : null,
            experiencia_id: exp ? exp.id : null,
            nota: notaSelecionada,
            autor: reserva.nome,
            perfil: 'Visitante',
            comentario: textarea.value.trim() || 'Experiência avaliada.',
            data: getTodayISO(),
            local: true,
        };
        const arr = loadAvaliacoes();
        arr.push(nova);
        saveAvaliacoes(arr);
        showToast('Avaliação enviada. Obrigada por compartilhar!');
        form.remove();
        renderAvaliacoes();
        renderReservas();
        renderBoutique();
        renderSugestoes();
        renderExperiencias();
    });
    return form;
}

