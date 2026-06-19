// Roteiros prontos - curadoria de 1 clique. Inspirado nos "suggested trips" do
// CellarPass: para quem não quer preencher o wizard, escolhe um tema e o roteiro
// é gerado na hora (e pode ser ajustado depois). Reduz a fricção de partida.

const ROTEIROS_PRONTOS = [
    {
        id: 'romantico', icon: 'fa-heart', titulo: 'Fim de semana a dois',
        desc: 'Pôr do sol, boutiques intimistas e um jantar harmonizado.',
        input: { days: 2, pessoas: 2, budget: 1800, profile: 'casal', pace: 'equilibrado', interests: ['por-do-sol', 'boutique', 'harmonizado', 'degustacao-premium'] },
    },
    {
        id: 'primeira-vez', icon: 'fa-compass', titulo: 'Primeira vez no Vale',
        desc: 'O essencial: tours pelas caves, degustações clássicas e história.',
        input: { days: 2, pessoas: 2, budget: 1200, profile: 'casal', pace: 'equilibrado', interests: ['visita-tecnica', 'degustacao-classica', 'familiar'] },
    },
    {
        id: 'espumantes', icon: 'fa-wine-glass', titulo: 'Rota dos espumantes',
        desc: 'Méthode champenoise, caves na rocha e brindes premiados.',
        input: { days: 1, pessoas: 2, budget: 900, profile: 'casal', pace: 'explorador', interests: ['boutique', 'degustacao-premium', 'arquitetura'] },
    },
    {
        id: 'familia', icon: 'fa-people-roof', titulo: 'Família adulta',
        desc: 'Vinícolas familiares, tours e vindima participativa.',
        input: { days: 2, pessoas: 4, budget: 2000, profile: 'familia', pace: 'tranquilo', interests: ['familiar', 'visita-tecnica', 'vindima', 'piquenique'] },
    },
    {
        id: 'premium', icon: 'fa-gem', titulo: 'Maratona premium',
        desc: 'Verticais, Lote 43, sommelier e rótulos raros.',
        input: { days: 2, pessoas: 2, budget: 3500, profile: 'amigos', pace: 'explorador', interests: ['degustacao-premium', 'raros', 'sommelier', 'harmonizado'] },
    },
    {
        id: 'piquenique', icon: 'fa-basket-shopping', titulo: 'Dia de piquenique',
        desc: 'Cesta entre os vinhedos e um pôr do sol sem pressa.',
        input: { days: 1, pessoas: 2, budget: 700, profile: 'casal', pace: 'tranquilo', interests: ['piquenique', 'por-do-sol', 'boutique'] },
    },
];

// Próximo sábado (>= hoje) - começa a viagem num fim de semana plausível.
function proximoSabadoISO() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diasAteSabado = (6 - hoje.getDay() + 7) % 7; // 6 = sábado
    const alvo = new Date(hoje);
    alvo.setDate(alvo.getDate() + diasAteSabado);
    return alvo.toISOString().slice(0, 10);
}

function aplicarRoteiroPronto(preset) {
    const form = document.getElementById('travel-form');
    if (!form || !preset) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('start-date', proximoSabadoISO());
    set('days', preset.input.days);
    set('people', preset.input.pessoas);
    set('budget', preset.input.budget);
    set('profile', preset.input.profile);
    set('pace', preset.input.pace);
    form.querySelectorAll('input[name="interests"]').forEach(cb => {
        cb.checked = preset.input.interests.includes(cb.value);
    });
    // Limpa erros eventuais e dispara o fluxo normal de geração.
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    if (typeof form.requestSubmit === 'function') form.requestSubmit();
    else form.dispatchEvent(new Event('submit', { cancelable: true }));
}

function renderRoteirosProntos() {
    const grid = document.getElementById('roteiros-prontos-grid');
    if (!grid) return;
    grid.innerHTML = ROTEIROS_PRONTOS.map(p => `
        <button type="button" class="rp-card" data-rp="${p.id}">
            <span class="rp-icon" aria-hidden="true"><i class="fa-solid ${p.icon}"></i></span>
            <span class="rp-body">
                <strong>${p.titulo}</strong>
                <span class="rp-desc">${p.desc}</span>
                <span class="rp-meta">${p.input.days} ${p.input.days === 1 ? 'dia' : 'dias'} · ${p.input.pessoas} ${p.input.pessoas === 1 ? 'pessoa' : 'pessoas'}</span>
            </span>
        </button>
    `).join('');
    grid.querySelectorAll('[data-rp]').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = ROTEIROS_PRONTOS.find(p => p.id === btn.dataset.rp);
            aplicarRoteiroPronto(preset);
            if (typeof showToast === 'function') showToast(`Roteiro "${preset.titulo}" montado - ajuste como quiser.`);
        });
    });
}
window.renderRoteirosProntos = renderRoteirosProntos;
