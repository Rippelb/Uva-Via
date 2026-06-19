// Favoritos / lista de desejos - salva vinícolas e experiências no localStorage.
// Padrão em GetYourGuide/Wanderlog/Wine Locals; faltava aqui. Carregado antes do
// init.js para que favBtnHTML exista quando os cards forem renderizados.

const STORAGE_FAV = 'uvaevia.favoritos';

function loadFavoritos() {
    try {
        const f = JSON.parse(localStorage.getItem(STORAGE_FAV)) || {};
        return { vinicolas: f.vinicolas || [], experiencias: f.experiencias || [] };
    } catch { return { vinicolas: [], experiencias: [] }; }
}
function saveFavoritos(f) {
    try { localStorage.setItem(STORAGE_FAV, JSON.stringify(f)); } catch { /* ignore */ }
}
function isFavVin(id) { return loadFavoritos().vinicolas.includes(Number(id)); }
function isFavExp(id) { return loadFavoritos().experiencias.includes(Number(id)); }
function countFavoritos() {
    const f = loadFavoritos();
    return f.vinicolas.length + f.experiencias.length;
}
function toggleFavVin(id) {
    id = Number(id);
    const f = loadFavoritos();
    const i = f.vinicolas.indexOf(id);
    if (i >= 0) f.vinicolas.splice(i, 1); else f.vinicolas.push(id);
    saveFavoritos(f);
    return f.vinicolas.includes(id);
}
function toggleFavExp(id) {
    id = Number(id);
    const f = loadFavoritos();
    const i = f.experiencias.indexOf(id);
    if (i >= 0) f.experiencias.splice(i, 1); else f.experiencias.push(id);
    saveFavoritos(f);
    return f.experiencias.includes(id);
}

// Botão de coração reutilizável - usado nos templates de cards.
function favBtnHTML(type, id) {
    const ativo = type === 'vin' ? isFavVin(id) : isFavExp(id);
    const lbl = ativo ? 'Remover dos favoritos' : 'Salvar nos favoritos';
    return `<button type="button" class="fav-btn${ativo ? ' is-fav' : ''}" data-fav-type="${type}" data-fav-id="${id}" aria-pressed="${ativo}" aria-label="${lbl}" title="${lbl}"><i class="fa-${ativo ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i></button>`;
}

// Atualiza no DOM todos os botões de um mesmo item (sem re-render pesado).
function setFavBtnState(type, id) {
    const ativo = type === 'vin' ? isFavVin(id) : isFavExp(id);
    document.querySelectorAll(`.fav-btn[data-fav-type="${type}"][data-fav-id="${id}"]`).forEach(b => {
        b.classList.toggle('is-fav', ativo);
        b.setAttribute('aria-pressed', String(ativo));
        const lbl = ativo ? 'Remover dos favoritos' : 'Salvar nos favoritos';
        b.setAttribute('aria-label', lbl);
        b.setAttribute('title', lbl);
        const i = b.querySelector('i');
        if (i) { i.classList.toggle('fa-solid', ativo); i.classList.toggle('fa-regular', !ativo); }
    });
}

function updateFavCount() {
    const n = countFavoritos();
    const badge = document.getElementById('fav-count');
    if (badge) {
        badge.textContent = n;
        badge.hidden = n === 0;
    }
}

function renderFavoritos() {
    const grid = document.getElementById('fav-grid');
    const empty = document.getElementById('fav-empty');
    if (!grid) return;
    updateFavCount();

    const f = loadFavoritos();
    const vins = f.vinicolas.map(id => getAllVinicolas().find(v => v.id === id)).filter(Boolean);
    const exps = f.experiencias.map(id => EXPERIENCIAS.find(e => e.id === id)).filter(Boolean);

    if (vins.length === 0 && exps.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;

    const blocos = [];
    if (vins.length) {
        blocos.push(`<h3 class="fav-subtitle"><i class="fa-solid fa-wine-bottle" aria-hidden="true"></i> Vinícolas salvas (${vins.length})</h3>`);
        blocos.push('<div class="fav-cards">');
        vins.forEach(v => {
            const rating = getMediaAvaliacoes(v.id);
            const ratingTag = rating.total > 0 ? `<span><i class="fa-solid fa-star" aria-hidden="true" style="color:var(--status-quase)"></i> ${rating.media.toFixed(1)}</span>` : '';
            const initial = (v.nome || '?').replace(/^Vin[íi]cola\s+/i, '').charAt(0).toUpperCase();
            blocos.push(`
                <article class="fav-card">
                    <div class="fav-cover tone-${v.tone || 'a'}" aria-hidden="true">${initial}</div>
                    <div class="fav-card-body">
                        <strong>${v.nome.replace(/^Vin[íi]cola\s+/i, '')}</strong>
                        <span class="fav-card-sub">${v.cidade || ''} · ${v.tipo === 'boutique' ? 'Boutique' : 'Vinícola'} ${ratingTag}</span>
                        <div class="fav-card-actions">
                            <button type="button" class="btn btn-ghost btn-sm" data-fav-open="vin" data-id="${v.id}">Ver vinícola</button>
                            ${favBtnHTML('vin', v.id)}
                        </div>
                    </div>
                </article>
            `);
        });
        blocos.push('</div>');
    }
    if (exps.length) {
        blocos.push(`<h3 class="fav-subtitle"><i class="fa-solid fa-wine-glass" aria-hidden="true"></i> Experiências salvas (${exps.length})</h3>`);
        blocos.push('<div class="fav-cards">');
        exps.forEach(e => {
            const vin = getAllVinicolas().find(v => v.id === e.vinicola_id);
            const vagas = countHorariosDisponiveis(e.id);
            blocos.push(`
                <article class="fav-card fav-card--exp">
                    <div class="fav-card-body">
                        <strong>${e.nome}</strong>
                        <span class="fav-card-sub">${vin?.nome || ''} · ${fmtBRL(e.preco)}/pessoa</span>
                        <div class="fav-card-actions">
                            <button type="button" class="btn btn-ghost btn-sm" data-fav-open="exp" data-id="${e.id}" data-vin="${e.vinicola_id}">Ver</button>
                            <button type="button" class="btn btn-primary btn-sm" data-fav-reservar data-id="${e.id}" data-vin="${e.vinicola_id}" ${vagas === 0 ? 'disabled' : ''}>${vagas === 0 ? 'Indisponível' : 'Reservar'}</button>
                            ${favBtnHTML('exp', e.id)}
                        </div>
                    </div>
                </article>
            `);
        });
        blocos.push('</div>');
    }
    grid.innerHTML = blocos.join('');

    grid.querySelectorAll('[data-fav-open]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.dataset.favOpen;
            if (tipo === 'vin') openVinicola(Number(btn.dataset.id));
            else openVinicola(Number(btn.dataset.vin), Number(btn.dataset.id));
        });
    });
    grid.querySelectorAll('[data-fav-reservar]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            openVinicola(Number(btn.dataset.vin), Number(btn.dataset.id));
        });
    });
}
window.renderFavoritos = renderFavoritos;
window.favBtnHTML = favBtnHTML;
window.updateFavCount = updateFavCount;

// Clique global nos corações (delegação) - funciona em qualquer card.
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const type = btn.dataset.favType;
    const id = Number(btn.dataset.favId);
    const agora = type === 'vin' ? toggleFavVin(id) : toggleFavExp(id);
    setFavBtnState(type, id);
    updateFavCount();
    renderFavoritos();
    if (typeof showToast === 'function') {
        showToast(agora ? 'Salvo nos seus favoritos.' : 'Removido dos favoritos.');
    }
});

// Sincroniza entre abas
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_FAV) {
        document.querySelectorAll('.fav-btn').forEach(b => setFavBtnState(b.dataset.favType, Number(b.dataset.favId)));
        renderFavoritos();
    }
});
