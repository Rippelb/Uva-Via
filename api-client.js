// Cliente da API Uva & Via. Carregado APOS script.js.
// Substitui o conteudo dos arrays VINICOLAS/EXPERIENCIAS/HORARIOS pelos dados
// do backend mantendo a forma esperada pelo frontend (preco, duracao, vagas).

const API_BASE = (() => {
    // Funciona tanto em http://localhost/Uva-Via quanto em subpaths.
    const path = window.location.pathname.replace(/index\.html?$/, '').replace(/\/$/, '');
    return (path || '') + '/api';
})();

const UvaViaApi = {
    base: API_BASE,
    async _get(path, params = {}) {
        const qs = new URLSearchParams(params).toString();
        const url = `${API_BASE}${path}${qs ? '?' + qs : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
        return res.json();
    },
    async _send(path, method, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.erro || `${method} ${path} -> ${res.status}`);
        return data;
    },
    vinicolas: (params) => UvaViaApi._get('/vinicolas.php', params),
    vinicola: (id) => UvaViaApi._get('/vinicolas.php', { id }),
    experiencias: (params) => UvaViaApi._get('/experiencias.php', params),
    horarios: (params) => UvaViaApi._get('/horarios.php', params),
    tags: () => UvaViaApi._get('/tags.php'),
    perfis: () => UvaViaApi._get('/perfis.php'),
    categorias: () => UvaViaApi._get('/categorias.php'),
    reservasDoVisitante: (email) => UvaViaApi._get('/reservas.php', { email }),
    criarReserva: (payload) => UvaViaApi._send('/reservas.php', 'POST', payload),
    cancelarReserva: (id) => UvaViaApi._send(`/reservas.php?id=${id}`, 'DELETE'),
    gerarRoteiro: (payload) => UvaViaApi._send('/roteiros.php', 'POST', payload),
    roteirosDoVisitante: (email) => UvaViaApi._get('/roteiros.php', { email }),
};
window.UvaViaApi = UvaViaApi;

// Mapeia API -> shape esperado pelo frontend legado.
function mapVinicola(v) {
    return {
        id: Number(v.id),
        nome: v.nome,
        cidade: v.cidade,
        descricao: v.descricao,
        foto_url: v.foto_url,
        latitude: v.latitude != null ? Number(v.latitude) : null,
        longitude: v.longitude != null ? Number(v.longitude) : null,
        duracao_media_min: v.duracao_media_min != null ? Number(v.duracao_media_min) : null,
        preco_min: v.preco_min != null ? Number(v.preco_min) : null,
        preco_max: v.preco_max != null ? Number(v.preco_max) : null,
    };
}

function mapExperiencia(e) {
    return {
        id: Number(e.id),
        vinicola_id: Number(e.vinicola_id),
        categoria_id: e.categoria_id != null ? Number(e.categoria_id) : null,
        nome: e.nome,
        descricao: e.descricao,
        preco: Number(e.preco_por_pessoa),
        duracao: Number(e.duracao_minutos),
        categoria: e.categoria,
        tags: Array.isArray(e.tags) ? e.tags : [],
    };
}

function mapHorario(h) {
    const cap = Number(h.capacidade_maxima);
    return {
        id: Number(h.id),
        vinicola_id: Number(h.vinicola_id),
        experiencia_id: Number(h.experiencia_id),
        data: h.data,
        horario: typeof h.horario === 'string' ? h.horario.slice(0, 5) : h.horario,
        vagas: Number(h.vagas_disponiveis),
        capacidade: cap,
        status: h.status,
    };
}

function repopularSelect(selectEl, items, valueKey, labelFn, placeholder) {
    if (!selectEl) return;
    const previous = selectEl.value;
    selectEl.innerHTML = '';
    if (placeholder) selectEl.appendChild(new Option(placeholder, ''));
    items.forEach(it => selectEl.appendChild(new Option(labelFn(it), it[valueKey])));
    if (previous && items.some(it => String(it[valueKey]) === previous)) {
        selectEl.value = previous;
    }
}

async function bootstrap() {
    try {
        const [vinicolas, experiencias, horarios] = await Promise.all([
            UvaViaApi.vinicolas(),
            UvaViaApi.experiencias(),
            UvaViaApi.horarios({ incluir_lotados: 1 }),
        ]);

        const fmtBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        VINICOLAS.splice(0, VINICOLAS.length, ...vinicolas.map(mapVinicola));
        EXPERIENCIAS.splice(0, EXPERIENCIAS.length, ...experiencias.map(mapExperiencia));
        HORARIOS.splice(0, HORARIOS.length, ...horarios.map(mapHorario));

        // Re-popula os <select> ligados aos dados.
        const selVinicola = document.getElementById('b-vinicola');
        const expVinicolaSel = document.getElementById('exp-vinicola');
        const mVinicola = document.getElementById('m-vinicola');

        repopularSelect(selVinicola, VINICOLAS, 'id',
            v => `${v.nome} — ${v.cidade}`, 'Selecione uma vinícola…');
        repopularSelect(expVinicolaSel, VINICOLAS, 'id',
            v => v.nome, 'Todas as vinícolas');
        repopularSelect(mVinicola, VINICOLAS, 'id',
            v => v.nome, 'Selecione…');

        // Re-renderiza catalogo e gestao usando os dados frescos.
        if (typeof window.renderExperiencias === 'function') window.renderExperiencias();
        if (typeof window.renderManageTable === 'function') window.renderManageTable();

        console.info(`[Uva&Via] API carregada: ${VINICOLAS.length} vinicolas, ${EXPERIENCIAS.length} experiencias, ${HORARIOS.length} horarios.`);
    } catch (err) {
        console.warn('[Uva&Via] Falha ao carregar API, usando dados embutidos.', err);
    }
}

// Persiste reservas tambem no backend (alem do localStorage usado pela UI).
// Captura: roda ANTES do handler original (que reseta o form apos sucesso).
document.getElementById('booking-form')?.addEventListener('submit', (ev) => {
    const slotSelected = ev.currentTarget.querySelector('.slot.is-selected');
    const expSelect = document.getElementById('b-experiencia');
    const nome = document.getElementById('b-nome')?.value.trim();
    const pessoas = Math.max(1, Number(document.getElementById('b-pessoas')?.value) || 1);

    if (!slotSelected || !nome || !expSelect?.value) return;
    const horarioId = Number(slotSelected.dataset.id);
    // IDs altos (>=1000) sao horarios criados localmente via Gestao e nao existem no backend.
    if (!horarioId || horarioId >= 1000) return;

    // Fire-and-forget: nao bloqueia o handler original.
    UvaViaApi.criarReserva({
        horario_id: horarioId,
        num_pessoas: pessoas,
        visitante: {
            nome_completo: nome,
            email: `${nome.toLowerCase().replace(/\s+/g, '.')}@uvaevia.local`,
        },
    }).then(() => console.info('[Uva&Via] Reserva persistida no backend.'))
      .catch(err => console.warn('[Uva&Via] Reserva nao foi persistida no backend.', err));
}, { capture: true });

// Roda apos o script.js ja ter populado os selects e wired tudo.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
