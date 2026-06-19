// Catalogo de Experiencias + helpers de selects
// Dividido de script.js - carregado como <script> classico, ordem importa.

// =================== Catalogo de Experiencias ===================
const expSearch = document.getElementById('exp-search');
const expVinicolaSel = document.getElementById('exp-vinicola');
const expSort = document.getElementById('exp-sort');
const expGrid = document.getElementById('exp-grid');
const expEmpty = document.getElementById('exp-empty');
const expCount = document.getElementById('exp-count');

// Filtros por comodidade (da vinícola) + "só favoritos" - descoberta ao estilo
// dos filtros de GetYourGuide/Wanderlog.
const expComodFilters = new Set();

// VINICOLAS são populadas em populateVinicolaSelects() durante o Init

function renderExperiencias() {
    const term = expSearch.value.trim().toLowerCase();
    const vid = Number(expVinicolaSel.value) || null;
    const sort = expSort.value;

    let lista = EXPERIENCIAS.slice();
    if (term) {
        lista = lista.filter(e => {
            const vin = VINICOLAS.find(v => v.id === e.vinicola_id);
            const haystack = (e.nome + ' ' + (vin?.nome || '') + ' ' + (vin?.cidade || '')).toLowerCase();
            return haystack.includes(term);
        });
    }
    if (vid) lista = lista.filter(e => e.vinicola_id === vid);

    if (expComodFilters.size) {
        const wantFav = expComodFilters.has('__fav');
        const comods = [...expComodFilters].filter(c => c !== '__fav');
        lista = lista.filter(e => {
            if (wantFav && typeof isFavExp === 'function' && !isFavExp(e.id)) return false;
            if (comods.length) {
                const vin = getAllVinicolas().find(v => v.id === e.vinicola_id);
                const vc = window.getComodidades ? getComodidades(vin) : (vin?.comodidades || []);
                return comods.every(c => vc.includes(c));
            }
            return true;
        });
    }

    const sorters = {
        'nome':       (a, b) => a.nome.localeCompare(b.nome),
        'preco-asc':  (a, b) => a.preco - b.preco,
        'preco-desc': (a, b) => b.preco - a.preco,
        'duracao':    (a, b) => a.duracao - b.duracao,
    };
    lista.sort(sorters[sort] || sorters.nome);

    expCount.textContent = lista.length;
    expGrid.innerHTML = '';
    expEmpty.hidden = lista.length > 0;

    lista.forEach(e => {
        const vin = getAllVinicolas().find(v => v.id === e.vinicola_id);
        const vagas = countHorariosDisponiveis(e.id);
        const status = getDisponibilidadeStatus(vagas, 50);
        const rating = vin ? getMediaAvaliacoes(vin.id) : { media: 0, total: 0 };
        const card = document.createElement('article');
        card.className = 'exp-card';
        card.innerHTML = `
            ${window.favBtnHTML ? favBtnHTML('exp', e.id) : ''}
            <span class="exp-vinicola">${vin?.nome ?? '-'} · ${vin?.cidade ?? ''}</span>
            <h3>${e.nome}</h3>
            <div class="exp-meta">
                <span><i class="fa-regular fa-clock" aria-hidden="true"></i> <strong>${e.duracao} min</strong></span>
                <span><i class="fa-solid fa-tag" aria-hidden="true"></i> <strong>${fmtBRL(e.preco)}</strong>/pessoa</span>
                <span><span class="av-badge ${status.cls}">${vagas > 0 ? vagas + ' vagas' : 'Lotado'}</span></span>
                ${rating.total > 0 ? `<span><i class="fa-solid fa-star" aria-hidden="true" style="color:var(--status-quase)"></i> <strong>${rating.media.toFixed(1)}</strong> (${rating.total})</span>` : ''}
            </div>
            <div class="exp-card-actions">
                <button class="btn btn-ghost" type="button" data-action="ver" data-vin="${vin?.id}">Ver vinícola</button>
                <button class="btn btn-primary" type="button" data-action="reservar" data-vin="${vin?.id}" data-exp="${e.id}" ${vagas === 0 ? 'disabled' : ''}>
                    ${vagas === 0 ? 'Indisponível' : 'Reservar'}
                </button>
            </div>
        `;
        card.querySelector('[data-action="ver"]').addEventListener('click', () => {
            if (vin) openVinicola(vin.id);
        });
        const btnRes = card.querySelector('[data-action="reservar"]');
        btnRes.addEventListener('click', () => {
            if (btnRes.disabled) return;
            selVinicola.value = vin.id;
            refreshExperiencias();
            selExperiencia.value = e.id;
            refreshSlots();
            document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        });
        expGrid.appendChild(card);
    });
}
window.renderExperiencias = renderExperiencias;

expSearch.addEventListener('input', renderExperiencias);
expVinicolaSel.addEventListener('change', renderExperiencias);
expSort.addEventListener('change', renderExperiencias);

document.querySelectorAll('.exp-comod-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const c = chip.dataset.comod;
        if (expComodFilters.has(c)) expComodFilters.delete(c); else expComodFilters.add(c);
        const ativo = expComodFilters.has(c);
        chip.classList.toggle('is-active', ativo);
        chip.setAttribute('aria-pressed', String(ativo));
        renderExperiencias();
    });
});

