// Cliente da API Uva & Via. Carregado APOS script.js.
// Gerencia sessao via cookie HttpOnly + CSRF token, e substitui o conteudo dos
// arrays VINICOLAS/EXPERIENCIAS/HORARIOS pelos dados do backend.

const API_BASE = (() => {
    const path = window.location.pathname.replace(/index\.html?$/, '').replace(/\/$/, '');
    return (path || '') + '/api';
})();

const authState = {
    user: null,
    csrf: '',
    listeners: new Set(),
};

function notifyAuthChange() {
    authState.listeners.forEach(fn => {
        try { fn(authState.user); } catch (err) { console.error(err); }
    });
}

async function apiFetch(path, { method = 'GET', body = null, params = null } = {}) {
    let url = `${API_BASE}${path}`;
    if (params) {
        const qs = new URLSearchParams(params).toString();
        if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }
    const headers = {};
    const mutating = !['GET', 'HEAD', 'OPTIONS'].includes(method);
    if (mutating) {
        headers['Content-Type'] = 'application/json';
        if (authState.csrf) headers['X-CSRF-Token'] = authState.csrf;
    }
    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.erro || `${method} ${path} -> ${res.status}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

const UvaViaApi = {
    base: API_BASE,

    // --- Sessao
    get user() { return authState.user; },
    get csrf() { return authState.csrf; },
    onAuthChange(fn) {
        authState.listeners.add(fn);
        return () => authState.listeners.delete(fn);
    },
    async refreshSession() {
        const data = await apiFetch('/auth/me.php');
        authState.user = data.user;
        authState.csrf = data.csrf || '';
        notifyAuthChange();
        return authState.user;
    },
    async login(email, senha) {
        const data = await apiFetch('/auth/login.php', { method: 'POST', body: { email, senha } });
        authState.user = data.user;
        authState.csrf = data.csrf || '';
        notifyAuthChange();
        return data.user;
    },
    async register(payload) {
        const data = await apiFetch('/auth/register.php', { method: 'POST', body: payload });
        authState.user = data.user;
        authState.csrf = data.csrf || '';
        notifyAuthChange();
        return data.user;
    },
    async logout() {
        await apiFetch('/auth/logout.php', { method: 'POST' });
        authState.user = null;
        await UvaViaApi.refreshSession();
    },
    async changePassword(senha_atual, senha_nova) {
        return apiFetch('/auth/change-password.php', { method: 'POST', body: { senha_atual, senha_nova } });
    },
    async forgotPassword(email) {
        return apiFetch('/auth/forgot-password.php', { method: 'POST', body: { email } });
    },
    async resetPassword(token, senha_nova) {
        return apiFetch('/auth/reset-password.php', { method: 'POST', body: { token, senha_nova } });
    },

    // --- Catalogo
    vinicolas: (params) => apiFetch('/vinicolas.php', { params }),
    vinicola: (id) => apiFetch('/vinicolas.php', { params: { id } }),
    experiencias: (params) => apiFetch('/experiencias.php', { params }),
    horarios: (params) => apiFetch('/horarios.php', { params }),
    tags: () => apiFetch('/tags.php'),
    perfis: () => apiFetch('/perfis.php'),
    categorias: () => apiFetch('/categorias.php'),

    // --- Reservas / Roteiros
    minhasReservas: () => apiFetch('/reservas.php'),
    criarReserva: (payload) => apiFetch('/reservas.php', { method: 'POST', body: payload }),
    cancelarReserva: (id) => apiFetch('/reservas.php', { method: 'DELETE', params: { id } }),
    meusRoteiros: () => apiFetch('/roteiros.php'),
    gerarRoteiro: (payload) => apiFetch('/roteiros.php', { method: 'POST', body: payload }),

    // --- Admin (adm_supremo)
    listarUsuarios: (params) => apiFetch('/usuarios.php', { params }),
    criarUsuario: (payload) => apiFetch('/usuarios.php', { method: 'POST', body: payload }),
    atualizarUsuario: (id, payload) => apiFetch('/usuarios.php', { method: 'PUT', body: { id, ...payload } }),
    removerUsuario: (id) => apiFetch('/usuarios.php', { method: 'DELETE', params: { id } }),

    criarVinicola: (payload) => apiFetch('/vinicolas.php', { method: 'POST', body: payload }),
    atualizarVinicola: (id, payload) => apiFetch('/vinicolas.php', { method: 'PUT', body: { id, ...payload } }),
    removerVinicola: (id) => apiFetch('/vinicolas.php', { method: 'DELETE', params: { id } }),

    criarExperiencia: (payload) => apiFetch('/experiencias.php', { method: 'POST', body: payload }),
    atualizarExperiencia: (id, payload) => apiFetch('/experiencias.php', { method: 'PUT', body: { id, ...payload } }),
    removerExperiencia: (id) => apiFetch('/experiencias.php', { method: 'DELETE', params: { id } }),

    criarHorario: (payload) => apiFetch('/horarios.php', { method: 'POST', body: payload }),
    atualizarHorario: (id, payload) => apiFetch('/horarios.php', { method: 'PUT', body: { id, ...payload } }),
    removerHorario: (id) => apiFetch('/horarios.php', { method: 'DELETE', params: { id } }),
};
window.UvaViaApi = UvaViaApi;

// --- Mapeamento campos API -> frontend legado

// Snapshot dos seeds estaticos (js/data.js) capturado ANTES do splice do
// bootstrap — fallback por id para tags (slugs) e tipo/tone das vinicolas.
const EXPERIENCIAS_TAGS_FALLBACK = {};
(window.EXPERIENCIAS || []).forEach(e => {
    if (Array.isArray(e.tags)) EXPERIENCIAS_TAGS_FALLBACK[Number(e.id)] = e.tags.slice();
});
const VINICOLAS_ESTILO_FALLBACK = {};
(window.VINICOLAS || []).forEach(v => {
    VINICOLAS_ESTILO_FALLBACK[Number(v.id)] = { tipo: v.tipo, tone: v.tone };
});

// Nomes do seed do banco (db/install.mysql.sql, tags_interesse) -> slugs do front.
const TAG_NOME_PARA_SLUG = {
    'Degustacao classica':       'degustacao-classica',
    'Degustacao premium':        'degustacao-premium',
    'Gastronomia harmonizada':   'harmonizado',
    'Piquenique entre vinhedos': 'piquenique',
    'Tour pelas caves':          'visita-tecnica',
    'Experiencia boutique':      'boutique',
    'Vinhos raros':              'raros',
    'Experiencia com sommelier': 'sommelier',
    'Por do sol':                'por-do-sol',
    'Vindima':                   'vindima',
    'Vinicolas familiares':      'familiar',
    'Arquitetura e paisagens':   'arquitetura',
    'Experiencia rapida':        'rapida',
    'Experiencia completa':      'completa',
};

// Slug generico: minusculas, sem diacriticos, espacos/pontuacao -> hifen.
function slugifyTag(nome) {
    return String(nome || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Converte as tags da API ([{id, nome}]) nos slugs que o front espera.
function mapTagsExperiencia(e) {
    // 1) Fallback por id: seed estatico ja usa os slugs corretos do front.
    const seed = EXPERIENCIAS_TAGS_FALLBACK[Number(e.id)];
    if (seed) return seed.slice();
    // 2) Dicionario nome-do-banco -> slug; 3) slugify generico.
    return (Array.isArray(e.tags) ? e.tags : [])
        .map(t => {
            const nome = typeof t === 'string' ? t : (t && t.nome) || '';
            return TAG_NOME_PARA_SLUG[nome] || slugifyTag(nome);
        })
        .filter(Boolean);
}

function mapVinicola(v) {
    const estilo = VINICOLAS_ESTILO_FALLBACK[Number(v.id)] || {};
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
        tipo: v.tipo || estilo.tipo || 'grande',
        tone: v.tone || estilo.tone || 'a',
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
        tags: mapTagsExperiencia(e),
    };
}
function mapHorario(h) {
    return {
        id: Number(h.id),
        vinicola_id: Number(h.vinicola_id),
        experiencia_id: Number(h.experiencia_id),
        data: h.data,
        horario: typeof h.horario === 'string' ? h.horario.slice(0, 5) : h.horario,
        vagas: Number(h.vagas_disponiveis),
        capacidade: Number(h.capacidade_maxima),
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
    // 1) Sessao primeiro (define o csrf token). Se o backend estiver inacessivel,
    //    libera o modo convidado offline com os dados embutidos em vez de deixar
    //    a pagina travada para sempre atras do gate de login (body.auth-locked).
    try {
        await UvaViaApi.refreshSession();
    } catch (err) {
        console.warn('[Uva&Via] Backend inacessivel — modo convidado offline (dados embutidos).', err);
        window.UvaViaAuthUI?.unlock?.();
        window.UvaViaAuthUI?.close?.();
        return;
    }

    // 2) Catalogo: substitui os arrays de fallback pelos dados reais do backend.
    try {
        const [vinicolas, experiencias, horarios] = await Promise.all([
            UvaViaApi.vinicolas(),
            UvaViaApi.experiencias(),
            UvaViaApi.horarios({ incluir_lotados: 1 }),
        ]);

        if (Array.isArray(window.VINICOLAS)) {
            VINICOLAS.splice(0, VINICOLAS.length, ...vinicolas.map(mapVinicola));
        }
        if (Array.isArray(window.EXPERIENCIAS)) {
            EXPERIENCIAS.splice(0, EXPERIENCIAS.length, ...experiencias.map(mapExperiencia));
        }
        if (Array.isArray(window.HORARIOS)) {
            HORARIOS.splice(0, HORARIOS.length, ...horarios.map(mapHorario));
        }

        repopularSelect(document.getElementById('b-vinicola'), window.VINICOLAS || [], 'id',
            v => `${v.nome} — ${v.cidade}`, 'Selecione uma vinícola…');
        repopularSelect(document.getElementById('exp-vinicola'), window.VINICOLAS || [], 'id',
            v => v.nome, 'Todas as vinícolas');
        repopularSelect(document.getElementById('m-vinicola'), window.VINICOLAS || [], 'id',
            v => v.nome, 'Selecione…');

        // Re-renderiza tudo que depende dos arrays substituidos pelos splices.
        window.populateVinicolaSelects?.();
        window.renderBoutique?.();
        window.renderSugestoes?.();
        window.renderManageVinList?.();
        window.renderAvaliacoes?.();
        window.renderExperiencias?.();
        window.renderManageTable?.();

        console.info(`[Uva&Via] API carregada: ${(window.VINICOLAS||[]).length} vinicolas, ${(window.EXPERIENCIAS||[]).length} experiencias, ${(window.HORARIOS||[]).length} horarios. user=${authState.user ? authState.user.email : 'anon'}`);
    } catch (err) {
        console.warn('[Uva&Via] Falha ao carregar catalogo da API, usando dados embutidos.', err);
    }
}

// Reserva agora e responsabilidade de script.js (await na API). Aqui apenas
// avisamos quem precisa quando o estado de auth muda — script.js refetcha
// reservas/roteiros ao logar via 'uvaevia:auth-change'.
UvaViaApi.onAuthChange((user) => {
    document.dispatchEvent(new CustomEvent('uvaevia:auth-change', { detail: { user } }));
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
