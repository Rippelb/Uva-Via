// Sync entre abas + Init (DEVE ser o ultimo a carregar)
// Dividido de script.js — carregado como <script> classico, ordem importa.

// =================== Sync entre abas ===================
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_HORARIOS) {
        customHorarios = loadCustomHorarios();
        if (selVinicola.value) refreshSlots({ preserveSelection: true });
        renderExperiencias();
        renderManageTable();
        renderSugestoes();
        showToast('Disponibilidade atualizada em outra aba.');
    }
    if (e.key === STORAGE_VINICOLAS) {
        customVinicolas = loadCustomVinicolas();
        populateVinicolaSelects();
        renderManageVinList();
        renderBoutique();
        renderExperiencias();
    }
    if (e.key === STORAGE_KEY) {
        renderReservas();
    }
    if (e.key === STORAGE_PLAN) {
        const p = loadPlan();
        if (p) renderMapa(p);
    }
    if (e.key === STORAGE_AVAL) {
        renderAvaliacoes();
        renderBoutique();
        renderSugestoes();
        renderExperiencias();
    }
});

// =================== Init ===================
function setMinDateInputs() {
    const today = getTodayISO();
    ['start-date', 'm-data', 'm-data-fim'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.min = today;
    });
}

document.getElementById('year').textContent = new Date().getFullYear();
populateVinicolaSelects();
setMinDateInputs();
applyManageMode();
renderReservas();
renderExperiencias();
renderManageTable();
renderManageVinList();
renderSugestoes();
renderBoutique();
renderAvaliacoes();
if (typeof renderFavoritos === 'function') renderFavoritos();

// Tenta restaurar plano via hash compartilhado antes de cair pro localStorage
const restauradoDoHash = tryRestorePlanoFromHash();
const planoSalvo = restauradoDoHash ? null : loadPlan();
if (planoSalvo) {
    renderMapa(planoSalvo);
    document.querySelector('[data-mapa-link]')?.removeAttribute('hidden');
}

// Re-aplica min={today} a cada meia hora caso o usuario deixe a aba aberta
setInterval(setMinDateInputs, 30 * 60 * 1000);

// Inicia o tick de disponibilidade em tempo real (45s) com pausa quando aba oculta
startLiveTick();
