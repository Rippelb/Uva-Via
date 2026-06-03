/* =============================================================
   Uva & Via - Front-end (vanilla)
   - Dados embutidos como fallback (substituidos pelo api-client)
   - SPA com secoes ancoradas, navegacao mobile-first
   - Algoritmo de roteiro, mapa/rota timeline, perfil de vinicola
   ============================================================= */

// =================== DADOS (fallback) ===================
// O api-client.js substitui esses arrays via splice() quando a API responde.
// Mantemos campos extras para a UI funcionar mesmo offline.

let VINICOLAS = [
    { id: 1, nome: 'Vinícola Pizzato',  cidade: 'Bento Gonçalves',     tipo: 'boutique', tone: 'a', latitude: -29.226, longitude: -51.535, descricao: 'Pioneira em Merlot no Brasil, produção autoral em pequenas safras.', duracao_media_min: 75, preco_min: 60,  preco_max: 320 },
    { id: 2, nome: 'Vinícola Torcello', cidade: 'Monte Belo do Sul',   tipo: 'boutique', tone: 'b', latitude: -29.156, longitude: -51.626, descricao: 'Espumantes premiados entre vinhedos com vista privilegiada.', duracao_media_min: 70, preco_min: 90,  preco_max: 180 },
    { id: 3, nome: 'Vinícola Larentis', cidade: 'Monte Belo do Sul',   tipo: 'boutique', tone: 'c', latitude: -29.163, longitude: -51.635, descricao: 'Família italiana com tradição em vinhos de guarda e vindima participativa.', duracao_media_min: 90, preco_min: 40,  preco_max: 220 },
    { id: 4, nome: 'Lídio Carraro',     cidade: 'Bento Gonçalves',     tipo: 'boutique', tone: 'd', latitude: -29.249, longitude: -51.553, descricao: 'Boutique de vinhos ícone, sem usar barricas de carvalho.', duracao_media_min: 80, preco_min: 70,  preco_max: 380 },
    { id: 5, nome: 'Miolo Wine Group',  cidade: 'Bento Gonçalves',     tipo: 'grande',   tone: 'a', latitude: -29.255, longitude: -51.518, descricao: 'Maior vinícola brasileira, tour completo e gastronomia harmonizada.', duracao_media_min: 110, preco_min: 80, preco_max: 450 },
    { id: 6, nome: 'Casa Valduga',      cidade: 'Bento Gonçalves',     tipo: 'grande',   tone: 'd', latitude: -29.234, longitude: -51.501, descricao: 'Tradição com pousada, restaurante Maria e jantares assinados.', duracao_media_min: 120, preco_min: 70, preco_max: 420 },
    { id: 7, nome: 'Cave Geisse',       cidade: 'Pinto Bandeira',      tipo: 'boutique', tone: 'e', latitude: -29.103, longitude: -51.426, descricao: 'Espumantes méthode champenoise envelhecidos em caves na rocha.', duracao_media_min: 85, preco_min: 120, preco_max: 250 },
    { id: 8, nome: 'Vinícola Salton',   cidade: 'Bento Gonçalves',     tipo: 'grande',   tone: 'a', latitude: -29.182, longitude: -51.518, descricao: 'Centenária, com museu e tour histórico do vinho gaúcho.', duracao_media_min: 75, preco_min: 45,  preco_max: 90 },
    { id: 9, nome: 'Don Giovanni',      cidade: 'Bento Gonçalves',     tipo: 'boutique', tone: 'b', latitude: -29.207, longitude: -51.541, descricao: 'Castelo italiano com almoço toscano entre os vinhedos.', duracao_media_min: 95, preco_min: 70,  preco_max: 260 },
    { id: 10, nome: 'Dom Cândido',      cidade: 'Garibaldi',           tipo: 'boutique', tone: 'c', latitude: -29.255, longitude: -51.532, descricao: 'Especializada em moscatéis e vinhos de mesa, com cave subterrânea.', duracao_media_min: 55, preco_min: 45,  preco_max: 55 },
];

let EXPERIENCIAS = [
    { id: 1,  vinicola_id: 1,  nome: 'Degustação de Merlots Pizzato',           preco: 120, duracao: 75,  tags: ['degustacao-classica', 'boutique', 'familiar'] },
    { id: 2,  vinicola_id: 1,  nome: 'Masterclass DNA 99',                       preco: 320, duracao: 120, tags: ['degustacao-premium', 'sommelier', 'raros', 'completa'] },
    { id: 3,  vinicola_id: 1,  nome: 'Tour pelas caves Pizzato',                 preco: 60,  duracao: 60,  tags: ['visita-tecnica', 'rapida'] },
    { id: 4,  vinicola_id: 2,  nome: 'Degustação de espumantes Torcello',        preco: 90,  duracao: 60,  tags: ['degustacao-classica', 'rapida'] },
    { id: 5,  vinicola_id: 2,  nome: 'Piquenique entre vinhedos Torcello',       preco: 180, duracao: 120, tags: ['piquenique', 'por-do-sol', 'completa', 'arquitetura'] },
    { id: 6,  vinicola_id: 3,  nome: 'Degustação do Tributo Larentis',           preco: 150, duracao: 90,  tags: ['degustacao-premium', 'familiar'] },
    { id: 7,  vinicola_id: 3,  nome: 'Tour história da família Larentis',        preco: 40,  duracao: 60,  tags: ['familiar', 'visita-tecnica', 'rapida'] },
    { id: 8,  vinicola_id: 3,  nome: 'Vindima Larentis',                         preco: 220, duracao: 180, tags: ['vindima', 'completa', 'familiar'] },
    { id: 9,  vinicola_id: 4,  nome: 'Degustação Agnus e Quorum',                preco: 130, duracao: 60,  tags: ['degustacao-premium', 'boutique', 'rapida'] },
    { id: 10, vinicola_id: 4,  nome: 'Vertical Dádivas',                         preco: 380, duracao: 120, tags: ['degustacao-premium', 'raros', 'sommelier', 'completa'] },
    { id: 11, vinicola_id: 4,  nome: 'Tour Lídio Carraro',                       preco: 70,  duracao: 75,  tags: ['visita-tecnica', 'boutique'] },
    { id: 12, vinicola_id: 5,  nome: 'Tour Miolo completo',                      preco: 80,  duracao: 90,  tags: ['visita-tecnica', 'arquitetura'] },
    { id: 13, vinicola_id: 5,  nome: 'Experiência Lote 43',                      preco: 280, duracao: 90,  tags: ['degustacao-premium', 'raros', 'sommelier'] },
    { id: 14, vinicola_id: 5,  nome: 'Almoço harmonizado Miolo',                 preco: 450, duracao: 150, tags: ['harmonizado', 'completa'] },
    { id: 15, vinicola_id: 6,  nome: 'Tour Casa Valduga',                        preco: 70,  duracao: 75,  tags: ['visita-tecnica'] },
    { id: 16, vinicola_id: 6,  nome: 'Jantar Maria Valduga',                     preco: 420, duracao: 180, tags: ['harmonizado', 'sommelier', 'completa'] },
    { id: 17, vinicola_id: 6,  nome: 'Pôr do sol Valduga',                       preco: 120, duracao: 90,  tags: ['por-do-sol', 'arquitetura'] },
    { id: 18, vinicola_id: 7,  nome: 'Caves na rocha Geisse',                    preco: 120, duracao: 75,  tags: ['visita-tecnica', 'arquitetura', 'boutique'] },
    { id: 19, vinicola_id: 7,  nome: 'Piquenique Geisse',                        preco: 250, duracao: 120, tags: ['piquenique', 'por-do-sol', 'completa'] },
    { id: 20, vinicola_id: 7,  nome: 'Degustação terroir Geisse',                preco: 180, duracao: 60,  tags: ['degustacao-premium', 'boutique', 'rapida'] },
    { id: 21, vinicola_id: 8,  nome: 'Tour Salton histórico',                    preco: 45,  duracao: 75,  tags: ['visita-tecnica', 'arquitetura', 'familiar'] },
    { id: 22, vinicola_id: 8,  nome: 'Degustação Intenso Salton',                preco: 90,  duracao: 60,  tags: ['degustacao-classica', 'rapida'] },
    { id: 23, vinicola_id: 9,  nome: 'Degustação clássica Don Giovanni',         preco: 70,  duracao: 60,  tags: ['degustacao-classica', 'familiar', 'rapida'] },
    { id: 24, vinicola_id: 9,  nome: 'Almoço toscano Don Giovanni',              preco: 260, duracao: 120, tags: ['harmonizado', 'completa', 'arquitetura'] },
    { id: 25, vinicola_id: 10, nome: 'Cave subterrânea Dom Cândido',             preco: 45,  duracao: 60,  tags: ['visita-tecnica', 'familiar', 'rapida'] },
    { id: 26, vinicola_id: 10, nome: 'Flight de moscatéis Dom Cândido',          preco: 55,  duracao: 45,  tags: ['degustacao-classica', 'rapida'] },
];

// Vinicolas customizadas (criadas via Gestao, persistidas em localStorage).
// Declarado com var para hoisting — getAllVinicolas() pode ser chamada antes do load.
var customVinicolas = [];

let HORARIOS = [
    { id: 1,  experiencia_id: 1,  data: '2026-05-08', horario: '10:00', vagas: 12 },
    { id: 2,  experiencia_id: 1,  data: '2026-05-08', horario: '14:00', vagas: 10 },
    { id: 3,  experiencia_id: 1,  data: '2026-05-09', horario: '11:00', vagas: 8 },
    { id: 4,  experiencia_id: 2,  data: '2026-05-09', horario: '15:00', vagas: 8 },
    { id: 5,  experiencia_id: 3,  data: '2026-05-10', horario: '09:30', vagas: 15 },
    { id: 6,  experiencia_id: 4,  data: '2026-05-08', horario: '10:00', vagas: 4 },
    { id: 7,  experiencia_id: 4,  data: '2026-05-08', horario: '16:00', vagas: 12 },
    { id: 8,  experiencia_id: 5,  data: '2026-05-09', horario: '16:00', vagas: 10 },
    { id: 9,  experiencia_id: 6,  data: '2026-05-09', horario: '11:00', vagas: 12 },
    { id: 10, experiencia_id: 7,  data: '2026-05-10', horario: '14:00', vagas: 15 },
    { id: 11, experiencia_id: 8,  data: '2026-05-10', horario: '09:00', vagas: 15 },
    { id: 12, experiencia_id: 9,  data: '2026-05-08', horario: '10:00', vagas: 10 },
    { id: 13, experiencia_id: 10, data: '2026-05-09', horario: '14:00', vagas: 6  },
    { id: 14, experiencia_id: 11, data: '2026-05-08', horario: '15:30', vagas: 10 },
    { id: 15, experiencia_id: 12, data: '2026-05-08', horario: '10:00', vagas: 30 },
    { id: 16, experiencia_id: 13, data: '2026-05-09', horario: '11:00', vagas: 20 },
    { id: 17, experiencia_id: 14, data: '2026-05-08', horario: '12:30', vagas: 20 },
    { id: 18, experiencia_id: 15, data: '2026-05-09', horario: '10:00', vagas: 30 },
    { id: 19, experiencia_id: 16, data: '2026-05-10', horario: '20:00', vagas: 12 },
    { id: 20, experiencia_id: 17, data: '2026-05-09', horario: '17:30', vagas: 15 },
    { id: 21, experiencia_id: 18, data: '2026-05-10', horario: '10:00', vagas: 15 },
    { id: 22, experiencia_id: 19, data: '2026-05-10', horario: '12:00', vagas: 8  },
    { id: 23, experiencia_id: 20, data: '2026-05-08', horario: '11:00', vagas: 12 },
    { id: 24, experiencia_id: 21, data: '2026-05-08', horario: '10:00', vagas: 40 },
    { id: 25, experiencia_id: 22, data: '2026-05-09', horario: '15:00', vagas: 18 },
    { id: 26, experiencia_id: 23, data: '2026-05-09', horario: '14:00', vagas: 12 },
    { id: 27, experiencia_id: 24, data: '2026-05-10', horario: '12:30', vagas: 10 },
    { id: 28, experiencia_id: 25, data: '2026-05-10', horario: '10:00', vagas: 20 },
    { id: 29, experiencia_id: 26, data: '2026-05-09', horario: '11:30', vagas: 20 },
];

// Avaliacoes (seed) - reviews iniciais para a comunidade nao parecer vazia.
// Usuarias podem adicionar novas pela tela "Minhas reservas" apos a data passar.
const AVALIACOES_SEED = [
    { id: 'av_seed_1',  vinicola_id: 1,  experiencia_id: 1,  nota: 5, autor: 'Helena M.',     perfil: 'Casal',           comentario: 'Atendimento impecável e a degustação de Merlot foi memorável. Voltaremos!',                            data: '2026-04-12' },
    { id: 'av_seed_2',  vinicola_id: 2,  experiencia_id: 5,  nota: 5, autor: 'Lucas e Ana',   perfil: 'Casal',           comentario: 'Piquenique entre os vinhedos no fim de tarde — luz mágica, espumante perfeito.',                       data: '2026-04-20' },
    { id: 'av_seed_3',  vinicola_id: 3,  experiencia_id: 8,  nota: 4, autor: 'Família Souza', perfil: 'Família adulta',  comentario: 'Participar da vindima com as crianças adultas foi inesquecível. Só achei que faltou um pouco de sombra.', data: '2026-03-05' },
    { id: 'av_seed_4',  vinicola_id: 4,  experiencia_id: 10, nota: 5, autor: 'Ricardo P.',    perfil: 'Grupo de amigos', comentario: 'Vertical do Dádivas é uma experiência sensorial sem igual. O sommelier conduziu com maestria.',         data: '2026-04-28' },
    { id: 'av_seed_5',  vinicola_id: 6,  experiencia_id: 16, nota: 5, autor: 'Marina C.',     perfil: 'Casal',           comentario: 'Jantar Maria Valduga foi um dos melhores que já fizemos. Harmonização de outro nível.',                  data: '2026-05-01' },
    { id: 'av_seed_6',  vinicola_id: 7,  experiencia_id: 18, nota: 5, autor: 'Patrícia L.',   perfil: 'Casal',           comentario: 'A cave na rocha é um espetáculo. Espumante envelhecido vale cada centavo.',                              data: '2026-04-15' },
    { id: 'av_seed_7',  vinicola_id: 9,  experiencia_id: 24, nota: 4, autor: 'Carlos R.',     perfil: 'Família adulta',  comentario: 'Almoço toscano divino, ambiente lindo. A espera entre os pratos foi um pouco longa.',                    data: '2026-04-03' },
    { id: 'av_seed_8',  vinicola_id: 5,  experiencia_id: 13, nota: 5, autor: 'Bruna T.',      perfil: 'Grupo de amigos', comentario: 'Lote 43 é uma referência nacional — degustá-lo com explicação técnica foi muito enriquecedor.',         data: '2026-03-22' },
    { id: 'av_seed_9',  vinicola_id: 10, experiencia_id: 26, nota: 4, autor: 'Júlia F.',      perfil: 'Viajante solo',   comentario: 'Flight de moscatéis surpreendente, ótimo custo-benefício. Atendimento simpático e familiar.',           data: '2026-04-09' },
    { id: 'av_seed_10', vinicola_id: 1,  experiencia_id: 3,  nota: 4, autor: 'Eduardo M.',    perfil: 'Grupo de amigos', comentario: 'Tour pelas caves bem informativo, gostei da estrutura. Senti falta de uma degustação inclusa.',          data: '2026-03-15' },
    { id: 'av_seed_11', vinicola_id: 8,  experiencia_id: 21, nota: 4, autor: 'Sofia D.',      perfil: 'Família adulta',  comentario: 'Tour histórico Salton é uma aula de enologia gaúcha. Recomendo para quem ama história.',                data: '2026-04-25' },
    { id: 'av_seed_12', vinicola_id: 2,  experiencia_id: 4,  nota: 5, autor: 'Rafael G.',     perfil: 'Casal',           comentario: 'Espumantes Torcello: sabor, brilho e uma vista de tirar o fôlego. Top!',                                 data: '2026-05-08' },
];

// =================== Utils ===================
const fmtBRL = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtData = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
};
const fmtDataCurta = (iso) => {
    if (!iso) return '';
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
};
const getTodayISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
const isPastDate = (iso) => {
    if (!iso) return false;
    return iso < getTodayISO();
};
function setFieldError(input, msg) {
    if (!input) return;
    input.classList.toggle('is-invalid', !!msg);
    const errEl = document.getElementById(input.id + '-error');
    if (errEl) errEl.textContent = msg || '';
}
function clearFieldError(input) { setFieldError(input, ''); }
const addDays = (isoDate, days) => {
    const d = new Date(isoDate + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};
const minutosParaHHMM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h${m.toString().padStart(2, '0')}`;
};
// Distancia aproximada (km) por haversine.
const distanciaKm = (a, b) => {
    if (!a || !b) return 0;
    const toRad = (g) => g * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
};
const tempoDeslocamentoMin = (vinA, vinB) => {
    if (!vinA || !vinB || vinA.id === vinB.id) return 0;
    const km = distanciaKm(vinA, vinB);
    const min = Math.max(5, Math.round((km / 45) * 60));
    return min;
};

// =================== Toast ===================
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg, type = 'success') {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast is-visible ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

// =================== Navegacao mobile (drawer lateral) ===================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navBackdrop = document.getElementById('nav-backdrop');
const navLinks = document.querySelectorAll('.nav-link');

function openNav() {
    navMenu.classList.add('is-open');
    navBackdrop?.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
}
function closeNav() {
    navMenu.classList.remove('is-open');
    navBackdrop?.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
}
function toggleNav() {
    if (navMenu.classList.contains('is-open')) closeNav();
    else openNav();
}

navToggle?.addEventListener('click', toggleNav);
navBackdrop?.addEventListener('click', closeNav);

// Escape fecha o drawer
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) closeNav();
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        closeNav();
    });
});

// Fecha o drawer se redimensionar para desktop
const desktopMQ = window.matchMedia('(min-width: 860px)');
desktopMQ.addEventListener('change', (e) => {
    if (e.matches) closeNav();
});

// Active link no scroll
const spySections = ['home', 'planejar', 'roteiro', 'vinicola', 'mapa',
                     'experiencias', 'reservar', 'minhas-reservas', 'avaliacoes']
    .map(id => document.getElementById(id))
    .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
    });
}, { rootMargin: '-45% 0px -45% 0px' });
spySections.forEach(s => spy.observe(s));

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

// =================== Hero search global ===================
const heroSearchInput = document.getElementById('hero-search-input');
const heroSearchResults = document.getElementById('hero-search-results');
const heroSearchForm = document.getElementById('hero-search-form');

function runGlobalSearch(term) {
    const q = term.trim().toLowerCase();
    if (q.length < 2) {
        heroSearchResults.hidden = true;
        heroSearchResults.innerHTML = '';
        return;
    }
    const hitsVin = VINICOLAS.filter(v =>
        v.nome.toLowerCase().includes(q) || (v.cidade || '').toLowerCase().includes(q)
    ).slice(0, 4);
    const hitsExp = EXPERIENCIAS.filter(e =>
        e.nome.toLowerCase().includes(q)
    ).slice(0, 5);

    if (hitsVin.length === 0 && hitsExp.length === 0) {
        heroSearchResults.innerHTML = `<li class="res-empty"><span class="res-title">Nada encontrado</span><span class="res-meta">Tente outro termo</span></li>`;
        heroSearchResults.hidden = false;
        return;
    }
    const html = [];
    hitsVin.forEach(v => {
        html.push(`<li data-type="vin" data-id="${v.id}">
            <span class="res-title"><i class="fa-solid fa-wine-bottle" aria-hidden="true"></i> ${v.nome}</span>
            <span class="res-meta">${v.cidade} · ${v.tipo === 'boutique' ? 'Boutique' : 'Vinícola'}</span>
        </li>`);
    });
    hitsExp.forEach(e => {
        const vin = getAllVinicolas().find(v => v.id === e.vinicola_id);
        html.push(`<li data-type="exp" data-id="${e.id}">
            <span class="res-title"><i class="fa-solid fa-wine-glass" aria-hidden="true"></i> ${e.nome}</span>
            <span class="res-meta">${vin ? vin.nome : ''} · ${fmtBRL(e.preco)}</span>
        </li>`);
    });
    heroSearchResults.innerHTML = html.join('');
    heroSearchResults.hidden = false;

    heroSearchResults.querySelectorAll('li[data-type]').forEach(li => {
        li.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            const type = li.dataset.type;
            const id = Number(li.dataset.id);
            heroSearchResults.hidden = true;
            heroSearchInput.value = '';
            if (type === 'vin') {
                openVinicola(id);
            } else if (type === 'exp') {
                const exp = EXPERIENCIAS.find(e => e.id === id);
                if (exp) openVinicola(exp.vinicola_id, exp.id);
            }
        });
    });
}

let heroSearchTimer;
heroSearchInput?.addEventListener('input', (ev) => {
    clearTimeout(heroSearchTimer);
    heroSearchTimer = setTimeout(() => runGlobalSearch(ev.target.value), 150);
});
heroSearchInput?.addEventListener('focus', () => {
    if (heroSearchInput.value.trim().length >= 2) runGlobalSearch(heroSearchInput.value);
});
heroSearchInput?.addEventListener('blur', () => {
    setTimeout(() => { heroSearchResults.hidden = true; }, 180);
});
heroSearchForm?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = heroSearchInput.value.trim();
    if (!q) return;
    document.getElementById('exp-search').value = q;
    renderExperiencias();
    document.getElementById('experiencias').scrollIntoView({ behavior: 'smooth' });
});

// =================== Sugestoes do dia ===================
function getDisponibilidadeStatus(vagas, capacidade) {
    const cap = capacidade || vagas;
    if (vagas === 0) return { label: 'Lotado', cls: 'cheio' };
    if (cap > 0 && vagas / cap <= 0.3) return { label: 'Quase cheio', cls: 'quase' };
    return { label: 'Vagas disponíveis', cls: 'livre' };
}
function countHorariosDisponiveis(expId) {
    return getAllHorarios()
        .filter(h => h.experiencia_id === expId && h.vagas > 0)
        .reduce((sum, h) => sum + h.vagas, 0);
}
function getProximoHorario(expId) {
    return getAllHorarios()
        .filter(h => h.experiencia_id === expId && h.vagas > 0)
        .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario))[0];
}

// Filtro temporal das sugestoes — alimenta os chips "Hoje | Amanhã | Fim de semana | Todas".
let sugFiltro = 'hoje';

function dataMatchesFiltro(iso, filtro) {
    if (!iso) return false;
    if (filtro === 'todas') return true;
    const hoje = getTodayISO();
    if (filtro === 'hoje')   return iso === hoje;
    if (filtro === 'amanha') return iso === addDays(hoje, 1);
    if (filtro === 'fimsemana') {
        const d = new Date(iso + 'T00:00:00');
        if (isNaN(d.getTime())) return false;
        const dow = d.getDay(); // 0=domingo, 6=sabado
        // proximos 7 dias E (sex/sab/dom)
        const ate = new Date();
        ate.setHours(0,0,0,0);
        ate.setDate(ate.getDate() + 14);
        return d <= ate && (dow === 0 || dow === 5 || dow === 6);
    }
    return true;
}

function getProximoHorarioComFiltro(expId, filtro) {
    return getAllHorarios()
        .filter(h => h.experiencia_id === expId && h.vagas > 0)
        .filter(h => dataMatchesFiltro(h.data, filtro))
        .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario))[0];
}

// Motivo personalizado por tag — explica "porque essa sugestao".
const SUG_MOTIVO = {
    'piquenique':         'Para curtir os vinhedos ao ar livre, com tempo de respirar.',
    'degustacao-premium': 'Vinhos ícones conduzidos por sommelier — para quem quer profundidade.',
    'visita-tecnica':     'Entenda o terroir e o processo direto na cave.',
    'harmonizado':        'Cada vinho casado com um prato pensado pelo chef.',
    'por-do-sol':         'A luz dourada cai sobre os vinhedos — momento icônico.',
    'boutique':           'Cantina intimista, atendimento próximo, produção limitada.',
};

function renderSugestoes() {
    const grid = document.getElementById('sugestoes-grid');
    if (!grid) return;
    const curatedTags = ['piquenique', 'degustacao-premium', 'visita-tecnica',
                          'harmonizado', 'por-do-sol', 'boutique'];
    const usedVin = new Set();
    const sugestoes = [];

    for (const tag of curatedTags) {
        const candidatos = EXPERIENCIAS
            .filter(e => (e.tags || []).includes(tag))
            .map(e => ({ e, prox: getProximoHorarioComFiltro(e.id, sugFiltro) }))
            .filter(x => x.prox)
            .filter(x => !usedVin.has(x.e.vinicola_id));
        if (candidatos.length) {
            const pick = candidatos[0];
            sugestoes.push({ exp: pick.e, hor: pick.prox, tag });
            usedVin.add(pick.e.vinicola_id);
        }
        if (sugestoes.length >= 6) break;
    }

    // Fallback: se filtro estrito nao trouxe nada, mostra "todas" mas avisa.
    if (sugestoes.length === 0 && sugFiltro !== 'todas') {
        grid.innerHTML = `<p class="exp-empty">Sem sugestões com vagas para esse período — <button type="button" class="btn btn-ghost" id="sug-fallback" style="display:inline-flex;margin-left:.5rem;padding:.5rem .9rem;font-size:.75rem;min-height:36px">Ver todas</button></p>`;
        document.getElementById('sug-fallback')?.addEventListener('click', () => {
            sugFiltro = 'todas';
            document.querySelectorAll('.sug-filter').forEach(b => {
                const on = b.dataset.sugFilter === 'todas';
                b.classList.toggle('is-active', on);
                b.setAttribute('aria-selected', String(on));
            });
            renderSugestoes();
        });
        return;
    }
    if (sugestoes.length === 0) {
        grid.innerHTML = `<p class="exp-empty">Sem sugestões disponíveis no momento.</p>`;
        return;
    }

    const tagLabel = {
        'piquenique':         'Piquenique',
        'degustacao-premium': 'Degustação premium',
        'visita-tecnica':     'Tour caves',
        'harmonizado':        'Harmonizado',
        'por-do-sol':         'Pôr do sol',
        'boutique':           'Intimista',
    };
    grid.innerHTML = sugestoes.map(s => {
        const vin = getAllVinicolas().find(v => v.id === s.exp.vinicola_id);
        const vagas = countHorariosDisponiveis(s.exp.id);
        const motivo = SUG_MOTIVO[s.tag] || '';
        const rating = getMediaAvaliacoes(s.exp.vinicola_id);
        const ratingBadge = rating.total > 0
            ? `<span class="card-rating"><i class="fa-solid fa-star" aria-hidden="true" style="color:var(--status-quase)"></i> <strong>${rating.media.toFixed(1)}</strong> (${rating.total})</span>`
            : '';
        return `
            <article class="sug-card">
                <span class="sug-badge">${tagLabel[s.tag] || s.tag}</span>
                <h3>${s.exp.nome}</h3>
                <span class="sug-vin">${vin?.nome ?? ''} · ${vin?.cidade ?? ''}</span>
                ${motivo ? `<p class="sug-motivo">${motivo}</p>` : ''}
                <div class="sug-meta">
                    <span><i class="fa-regular fa-clock" aria-hidden="true"></i> <strong>${s.exp.duracao} min</strong></span>
                    <span><i class="fa-solid fa-tag" aria-hidden="true"></i> <strong>${fmtBRL(s.exp.preco)}</strong>/pessoa</span>
                    <span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${fmtDataCurta(s.hor.data)} · ${s.hor.horario}</span>
                    <span><span class="av-badge ${getDisponibilidadeStatus(vagas, 50).cls}">${vagas} vagas</span></span>
                    ${ratingBadge}
                </div>
                <button class="btn btn-primary" type="button" data-vin="${s.exp.vinicola_id}" data-exp="${s.exp.id}">
                    Reservar
                </button>
            </article>
        `;
    }).join('');

    grid.querySelectorAll('button[data-vin]').forEach(btn => {
        btn.addEventListener('click', () => {
            openVinicola(Number(btn.dataset.vin), Number(btn.dataset.exp));
        });
    });
}

// Bind dos chips de filtro de sugestoes
document.querySelectorAll('.sug-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        sugFiltro = btn.dataset.sugFilter;
        document.querySelectorAll('.sug-filter').forEach(b => {
            const on = b.dataset.sugFilter === sugFiltro;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-selected', String(on));
        });
        renderSugestoes();
    });
});

// =================== Vinicolas boutique em destaque ===================
function renderBoutique() {
    const grid = document.getElementById('boutique-grid');
    if (!grid) return;
    const boutiques = getAllVinicolas().filter(v => v.tipo === 'boutique').slice(0, 6);
    if (boutiques.length === 0) {
        grid.innerHTML = `<p class="exp-empty">Nenhuma vinícola boutique cadastrada.</p>`;
        return;
    }
    grid.innerHTML = boutiques.map(v => {
        const expCount = EXPERIENCIAS.filter(e => e.vinicola_id === v.id).length;
        const initial = (v.nome || '?').replace(/^Vin[íi]cola\s+/i, '').charAt(0).toUpperCase();
        const preco = v.preco_min && v.preco_max
            ? `${fmtBRL(v.preco_min)}–${fmtBRL(v.preco_max)}`
            : '—';
        const rating = getMediaAvaliacoes(v.id);
        const ratingTag = rating.total > 0
            ? `<span><i class="fa-solid fa-star" aria-hidden="true" style="color:var(--status-quase)"></i> <strong>${rating.media.toFixed(1)}</strong> (${rating.total})</span>`
            : '';
        return `
            <button class="bout-card" type="button" data-vin="${v.id}" aria-label="Abrir ${v.nome}">
                <div class="bout-cover tone-${v.tone || 'a'}" aria-hidden="true">${initial}</div>
                <div class="bout-body">
                    <span class="bout-eyebrow">Boutique · ${v.cidade}</span>
                    <h3>${v.nome.replace(/^Vin[íi]cola\s+/i, '')}</h3>
                    <p>${v.descricao || 'Experiência intimista entre os vinhedos.'}</p>
                    <div class="bout-meta">
                        <span><i class="fa-solid fa-wine-glass" aria-hidden="true"></i> <strong>${expCount}</strong> experiências</span>
                        <span><i class="fa-regular fa-clock" aria-hidden="true"></i> <strong>${v.duracao_media_min || 75}</strong> min</span>
                        <span><i class="fa-solid fa-tag" aria-hidden="true"></i> ${preco}</span>
                        ${ratingTag}
                    </div>
                    <span class="btn btn-ghost">Ver perfil</span>
                </div>
            </button>
        `;
    }).join('');

    grid.querySelectorAll('button[data-vin]').forEach(btn => {
        btn.addEventListener('click', () => openVinicola(Number(btn.dataset.vin)));
    });
}

// =================== Perfil da Vinicola ===================
function openVinicola(vinId, focusExpId) {
    const vin = getAllVinicolas().find(v => v.id === vinId);
    if (!vin) return;
    renderVinicolaPerfil(vin, focusExpId);
    const section = document.getElementById('vinicola');
    section.hidden = false;
    document.querySelector('[data-vinicola-link]')?.removeAttribute('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Bloco de avaliacoes embutido no perfil da vinicola (usado em renderVinicolaPerfil).
// Funcao definida em modulo separado abaixo, mas referenciada aqui — chamada gera HTML.
function renderVinAvaliacoes(vin) {
    // Funcao acessa getAllAvaliacoes/avalCardHTML definidos mais abaixo no arquivo;
    // funciona porque `function` declarations sao hoisted.
    if (typeof getAllAvaliacoes !== 'function') return '';
    const lista = getAllAvaliacoes()
        .filter(a => a.vinicola_id === vin.id)
        .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
        .slice(0, 4);
    const { media, total } = getMediaAvaliacoes(vin.id);
    if (total === 0) {
        return `
            <section class="vin-aval-section">
                <div class="vin-aval-head">
                    <h3>Avaliações</h3>
                </div>
                <p class="aval-empty">Ainda não há avaliações para essa vinícola. Seja o primeiro a contar como foi.</p>
            </section>
        `;
    }
    return `
        <section class="vin-aval-section">
            <div class="vin-aval-head">
                <h3>Avaliações</h3>
                <div class="vin-aval-summary">
                    ${renderEstrelas(media, 'sm')}
                    <strong>${media.toFixed(1)}</strong>
                    <span>· ${total} avaliaç${total === 1 ? 'ão' : 'ões'}</span>
                </div>
            </div>
            <ul class="vin-aval-list">
                ${lista.map(a => avalCardHTML(a, { showVin: false })).join('')}
            </ul>
        </section>
    `;
}

function renderVinicolaPerfil(vin, focusExpId) {
    const container = document.getElementById('vinicola-content');
    const exps = EXPERIENCIAS.filter(e => e.vinicola_id === vin.id);
    const { media, total } = getMediaAvaliacoes(vin.id);

    container.innerHTML = `
        <article class="vin-profile">
            <header class="vin-cover tone-${vin.tone || 'a'}" style="font-size:5rem">
                <div class="vin-cover-inner">
                    <span class="vin-cidade">${vin.cidade}${vin.tipo === 'boutique' ? ' · Boutique' : ''}</span>
                    <h2>${vin.nome}</h2>
                </div>
            </header>
            <div class="vin-body">
                <p class="vin-desc">${vin.descricao || 'Vinícola do Vale dos Vinhedos.'}</p>

                <div class="vin-meta">
                    <div class="vin-meta-item">
                        <span>Duração média</span>
                        <strong>${vin.duracao_media_min || 75} min</strong>
                    </div>
                    <div class="vin-meta-item">
                        <span>Faixa de preço/pessoa</span>
                        <strong>${vin.preco_min && vin.preco_max ? fmtBRL(vin.preco_min) + ' – ' + fmtBRL(vin.preco_max) : '—'}</strong>
                    </div>
                    <div class="vin-meta-item">
                        <span>Experiências disponíveis</span>
                        <strong>${exps.length}</strong>
                    </div>
                    <div class="vin-meta-item">
                        <span>Avaliação dos visitantes</span>
                        <strong>${total > 0 ? media.toFixed(1) + ' / 5' : '—'}</strong>
                    </div>
                </div>

                <div>
                    <h3 class="vin-section-title">Experiências</h3>
                    <ul class="vin-exp-list" id="vin-exp-list">
                        ${exps.map(e => {
                            const vagas = countHorariosDisponiveis(e.id);
                            const status = getDisponibilidadeStatus(vagas, 50);
                            const horarios = getAllHorarios()
                                .filter(h => h.experiencia_id === e.id && h.vagas > 0)
                                .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario))
                                .slice(0, 6);
                            return `
                                <li class="vin-exp-card" data-exp="${e.id}">
                                    <h4>${e.nome}</h4>
                                    <div class="vin-exp-meta">
                                        <span><i class="fa-regular fa-clock" aria-hidden="true"></i> <strong>${e.duracao} min</strong></span>
                                        <span><i class="fa-solid fa-tag" aria-hidden="true"></i> <strong>${fmtBRL(e.preco)}</strong>/pessoa</span>
                                        <span><span class="av-badge ${status.cls}">${status.label}</span></span>
                                    </div>
                                    <div class="vin-horarios">
                                        ${horarios.length > 0
                                            ? horarios.map(h => `<button type="button" class="vin-horario" data-hor="${h.id}">${h.horario}<br><small style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;opacity:.7">${fmtDataCurta(h.data)}</small></button>`).join('')
                                            : '<small style="opacity:.55;font-style:italic">Sem horários disponíveis</small>'
                                        }
                                    </div>
                                    <div class="vin-reservar-actions">
                                        <button type="button" class="btn btn-primary vin-go-reservar" data-vin="${vin.id}" data-exp="${e.id}">Reservar esta experiência</button>
                                    </div>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>

                ${renderVinAvaliacoes(vin)}
            </div>
        </article>
    `;

    // Bind: horario buttons
    container.querySelectorAll('.vin-horario').forEach(btn => {
        btn.addEventListener('click', () => {
            const horId = Number(btn.dataset.hor);
            const hor = getAllHorarios().find(h => h.id === horId);
            const expId = Number(btn.closest('[data-exp]').dataset.exp);
            if (!hor) return;
            // Preenche o formulario de reserva e rola
            document.getElementById('b-vinicola').value = vin.id;
            refreshExperiencias();
            document.getElementById('b-experiencia').value = expId;
            refreshSlots();
            selectedHorarioId = hor.id;
            refreshSlots({ preserveSelection: true });
            document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
            showToast(`Horário ${hor.horario} selecionado.`);
        });
    });
    // Bind: reservar experiencia
    container.querySelectorAll('.vin-go-reservar').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('b-vinicola').value = btn.dataset.vin;
            refreshExperiencias();
            document.getElementById('b-experiencia').value = btn.dataset.exp;
            refreshSlots();
            document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        });
    });

    if (focusExpId) {
        const el = container.querySelector(`[data-exp="${focusExpId}"]`);
        if (el) {
            el.style.outline = '2px solid var(--vinho)';
            el.style.outlineOffset = '4px';
            setTimeout(() => { el.style.outline = ''; }, 1800);
        }
    }
}

// =================== Form de planejamento + gerador de roteiro ===================
const INTEREST_KEYWORDS = {
    'degustacao-classica': ['degustaç', 'flight', 'intenso', 'clássica'],
    'degustacao-premium':  ['premium', 'masterclass', 'vertical', 'lote 43', 'dádivas', 'dadivas', 'dna 99', 'ícone', 'icone', 'agnus'],
    'harmonizado':         ['harmoniz', 'almoço', 'almoco', 'jantar'],
    'piquenique':          ['piquenique'],
    'visita-tecnica':      ['tour', 'cave', 'caves', 'história', 'historia', 'subterrânea', 'subterranea'],
    'boutique':            ['pizzato', 'torcello', 'larentis', 'don giovanni', 'dom cândido', 'dom candido', 'geisse', 'lídio', 'lidio'],
    'raros':               ['raros', 'lote 43', 'dádivas', 'dadivas', 'vertical', 'dna 99'],
    'sommelier':           ['masterclass', 'sommelier', 'vertical', 'jantar', 'lote 43'],
    'por-do-sol':          ['pôr do sol', 'por do sol', 'sol valduga', 'piquenique geisse'],
    'vindima':             ['vindima'],
    'familiar':            ['cristofoli', 'larentis', 'salton', 'pizzato', 'família', 'familia'],
    'arquitetura':         ['caves na rocha', 'castelo', 'toscano', 'arquitetura', 'piquenique'],
    'rapida':              [],
    'completa':            [],
};

const STORAGE_PLAN = 'uvaevia.plano.atual';
function savePlan(plano) {
    try { localStorage.setItem(STORAGE_PLAN, JSON.stringify(plano)); }
    catch (e) { /* ignore */ }
}
function loadPlan() {
    try { return JSON.parse(localStorage.getItem(STORAGE_PLAN)) || null; }
    catch { return null; }
}
function clearPlan() {
    localStorage.removeItem(STORAGE_PLAN);
}

function getAllHorarios() {
    return [...HORARIOS, ...customHorarios];
}
function getAllVinicolas() {
    return [...VINICOLAS, ...customVinicolas];
}

// Algoritmo v2 — scoring com 7 fatores + rationale por escolha.
// Fatores: tags diretas, keywords no nome, perfil de viagem, vagas atuais,
// preco vs orcamento, avaliacao media da vinicola, e variedade (anti-mesma-cidade-seguida).
// Aceita `seed` opcional para gerar variacoes do mesmo input ("regenerar").
function generateRoteiro(input) {
    const expsPerDay = { tranquilo: 2, equilibrado: 3, explorador: 4 }[input.pace] || 3;
    const totalExps = input.days * expsPerDay;
    const budgetPerExp = input.budget > 0 ? input.budget / totalExps / input.pessoas : Infinity;
    const seed = Number(input.seed || 0);

    // PRNG simples com seed — Mulberry32. Permite reproduzir / variar o roteiro
    // sem alterar o input.
    function makeRand(s) {
        let a = s >>> 0;
        return function () {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            let t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    const rand = makeRand(seed || Date.now());

    const scored = EXPERIENCIAS.map(e => {
        const vin = VINICOLAS.find(v => v.id === e.vinicola_id);
        const txt = (e.nome + ' ' + (vin ? vin.nome + ' ' + (vin.cidade || '') : '')).toLowerCase();
        const expTags = e.tags || [];
        const motivos = [];
        let score = 0;

        // Fator 1: interesses do visitante (tags + keywords)
        const tagsBateu = [];
        input.interests.forEach(tag => {
            if (expTags.includes(tag)) {
                score += 6;
                tagsBateu.push(tag);
            }
            const kws = INTEREST_KEYWORDS[tag] || [];
            if (kws.some(k => txt.includes(k))) score += 3;
        });
        if (tagsBateu.length) {
            const nomes = tagsBateu.map(t => TAG_LABEL[t] || t).join(', ').toLowerCase();
            motivos.push(`combina com ${nomes}`);
        }

        // Fator 2: perfil de viagem
        let bonusPerfil = 0;
        if (input.profile === 'familia' && expTags.includes('familiar')) { bonusPerfil = 2; motivos.push('ideal para família adulta'); }
        if (input.profile === 'solo'    && expTags.includes('rapida'))   { bonusPerfil = 2; motivos.push('ritmo enxuto para solo'); }
        if (input.profile === 'amigos'  && (expTags.includes('completa') || expTags.includes('harmonizado'))) { bonusPerfil = 2; motivos.push('experiência completa para grupos'); }
        if (input.profile === 'casal'   && (expTags.includes('por-do-sol') || expTags.includes('boutique')))  { bonusPerfil = 2; motivos.push('clima a dois'); }
        score += bonusPerfil;

        // Fator 3: vagas / disponibilidade
        const vagas = countHorariosDisponiveis(e.id);
        if (vagas > 0) score += 1;
        if (vagas > 5) score += 1;
        if (vagas > 10) { score += 1; motivos.push('vagas abertas'); }

        // Fator 4: preco vs orcamento
        if (e.preco <= budgetPerExp) { score += 2; motivos.push('dentro do orçamento'); }
        else if (input.budget > 0 && e.preco > budgetPerExp * 1.5) score -= 1;

        // Fator 5 (novo): avaliacoes da vinicola — bem avaliada pesa mais.
        if (typeof getMediaAvaliacoes === 'function' && vin) {
            const rating = getMediaAvaliacoes(vin.id);
            if (rating.total >= 3) {
                if (rating.media >= 4.5) { score += 3; motivos.push(`nota ${rating.media.toFixed(1)} entre visitantes`); }
                else if (rating.media >= 4.0) { score += 2; motivos.push(`nota ${rating.media.toFixed(1)}`); }
                else if (rating.media >= 3.5) { score += 1; }
            }
        }

        // Fator 6 (novo): aleatoriedade leve com seed — permite variacao real ao regenerar.
        score += rand() * 1.5;

        return { exp: e, vin, score, vagas, motivos };
    });

    scored.sort((a, b) => b.score - a.score || a.exp.preco - b.exp.preco);

    // Selecao: prioriza variedade (uma experiencia por vinicola), depois preenche.
    const chosen = [];
    const usedVin = new Set();
    for (const item of scored) {
        if (chosen.length >= totalExps) break;
        if (usedVin.has(item.exp.vinicola_id) && usedVin.size < VINICOLAS.length) continue;
        chosen.push(item);
        usedVin.add(item.exp.vinicola_id);
    }
    for (const item of scored) {
        if (chosen.length >= totalExps) break;
        if (!chosen.includes(item)) chosen.push(item);
    }

    // Distribuicao por dia + horarios sugeridos (com janelas calculadas).
    const startTimes = ['10:00', '12:30', '15:00', '17:30'];
    const dias = [];
    for (let i = 0; i < input.days; i++) {
        const fatia = chosen.slice(i * expsPerDay, (i + 1) * expsPerDay);
        // Otimiza ordem dentro do dia por proximidade geografica
        // (primeira eh ancora, demais sao escolhidas pela menor distancia ate a anterior).
        const ordenado = [];
        const sobra = fatia.slice();
        if (sobra.length) ordenado.push(sobra.shift());
        while (sobra.length) {
            const ultima = ordenado[ordenado.length - 1];
            sobra.sort((a, b) => distanciaKm(ultima.vin, a.vin) - distanciaKm(ultima.vin, b.vin));
            ordenado.push(sobra.shift());
        }
        const dia = ordenado.map((item, idx) => {
            const status = getDisponibilidadeStatus(item.vagas, 50);
            return {
                exp: item.exp,
                vin: item.vin,
                vagas: item.vagas,
                disponibilidade: status,
                horario_sugerido: startTimes[idx] || '17:30',
                motivos: item.motivos || [],
            };
        });
        if (dia.length > 0) dias.push(dia);
    }

    // Calcula tempo total + deslocamentos + horarios reais de chegada/saida por parada.
    let tempoTotal = 0;
    let tempoDesloc = 0;
    let distanciaTotalKm = 0;
    dias.forEach(dia => {
        let prev = null;
        let cursorMin = 0;
        dia.forEach((stop, idx) => {
            if (idx === 0) {
                cursorMin = timeToMin(stop.horario_sugerido);
                stop.chegada = stop.horario_sugerido;
                stop.deslocamentoMin = 0;
                stop.distanciaKm = 0;
            } else {
                const desloc = tempoDeslocamentoMin(prev.vin, stop.vin);
                const km = distanciaKm(prev.vin, stop.vin);
                stop.deslocamentoMin = desloc;
                stop.distanciaKm = km;
                cursorMin += prev.exp.duracao + desloc;
                stop.chegada = minToTime(cursorMin);
                stop.horario_sugerido = stop.chegada;
                tempoDesloc += desloc;
                distanciaTotalKm += km;
            }
            stop.saida = minToTime(cursorMin + stop.exp.duracao);
            tempoTotal += stop.exp.duracao;
            tempoTotal += stop.deslocamentoMin;
            prev = stop;
        });
    });

    const total = chosen.reduce((sum, it) => sum + it.exp.preco * input.pessoas, 0);
    const tagsPresentes = [...new Set(chosen.flatMap(it => it.exp.tags || []))];

    // Narrativa do roteiro — destaque as 2 caracteristicas mais fortes do conjunto.
    const sumario = construirSumarioRoteiro({ chosen, days: input.days, distanciaTotalKm });

    return {
        dias,
        total,
        chosen: chosen.map(c => ({ exp: c.exp, vin: c.vin, vagas: c.vagas, motivos: c.motivos })),
        tempoTotal,
        tempoDesloc,
        distanciaTotalKm,
        tagsPresentes,
        sumario,
        seed: input.seed || Date.now(),
        ...input,
    };
}

// Texto narrativo "porque esse roteiro" — frase curta exibida acima do roteiro.
function construirSumarioRoteiro({ chosen, days, distanciaTotalKm }) {
    const cidades = [...new Set(chosen.map(c => c.vin?.cidade).filter(Boolean))];
    const temPiq = chosen.some(c => (c.exp.tags || []).includes('piquenique'));
    const temPremium = chosen.some(c => (c.exp.tags || []).includes('degustacao-premium'));
    const temHarmoniza = chosen.some(c => (c.exp.tags || []).includes('harmonizado'));
    const temPorSol = chosen.some(c => (c.exp.tags || []).includes('por-do-sol'));
    const temBoutique = chosen.filter(c => c.vin?.tipo === 'boutique').length;

    const traços = [];
    if (temPremium)   traços.push('degustações premium');
    if (temHarmoniza) traços.push('harmonização gastronômica');
    if (temPiq)       traços.push('piquenique entre vinhedos');
    if (temPorSol)    traços.push('pôr do sol nas serras');
    if (temBoutique >= 2) traços.push('vinícolas boutique intimistas');

    const trecho = traços.slice(0, 2).join(' e ') || 'experiências variadas';
    const cidStr = cidades.length === 1
        ? cidades[0]
        : (cidades.slice(0, -1).join(', ') + ' e ' + cidades[cidades.length - 1]);

    return `Roteiro de ${days} ${days === 1 ? 'dia' : 'dias'} pelo Vale dos Vinhedos com foco em ${trecho}. ` +
           `Passa por ${cidStr}, com ~${Math.round(distanciaTotalKm)} km de deslocamento total — equilibrando ritmo e descobertas.`;
}

// =================== Renderiza Roteiro Sugerido ===================
const TAG_LABEL = {
    'degustacao-classica': 'Degustação clássica',
    'degustacao-premium':  'Degustação premium',
    'harmonizado':         'Gastronomia harmonizada',
    'piquenique':          'Piquenique',
    'visita-tecnica':      'Tour pelas caves',
    'boutique':            'Boutique',
    'raros':               'Vinhos raros',
    'sommelier':           'Com sommelier',
    'por-do-sol':          'Pôr do sol',
    'vindima':             'Vindima',
    'familiar':            'Familiar',
    'arquitetura':         'Arquitetura',
    'rapida':              'Experiência rápida',
    'completa':            'Experiência completa',
};

function renderRoteiro(plano) {
    const section = document.getElementById('roteiro');
    section.hidden = false;
    document.querySelector('[data-roteiro-link]')?.removeAttribute('hidden');
    document.querySelector('[data-mapa-link]')?.removeAttribute('hidden');

    const overBudget = plano.total > plano.budget && plano.budget > 0;
    const budgetPct = plano.budget > 0
        ? Math.min(100, Math.round((plano.total / plano.budget) * 100))
        : 0;
    const profileLabel = {
        casal: 'casal', solo: 'viajante solo', amigos: 'grupo de amigos', familia: 'família adulta'
    }[plano.profile] || 'viajante';

    document.getElementById('roteiro-subtitle').textContent =
        `${plano.chosen.length} experiências para ${profileLabel} (${plano.pessoas} ${plano.pessoas === 1 ? 'pessoa' : 'pessoas'}) · ritmo ${plano.pace}.`;

    // Sumario narrativo (novo) + barra de acoes do algoritmo
    let sumarioEl = document.getElementById('roteiro-sumario');
    if (!sumarioEl) {
        sumarioEl = document.createElement('div');
        sumarioEl.id = 'roteiro-sumario';
        sumarioEl.className = 'roteiro-sumario';
        const meta = document.getElementById('roteiro-meta');
        meta.parentNode.insertBefore(sumarioEl, meta);
    }
    sumarioEl.innerHTML = `
        <p class="roteiro-narrativa"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> ${plano.sumario || ''}</p>
        <div class="roteiro-algoritmo-actions">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-regenerar">
                <i class="fa-solid fa-shuffle btn-icon" aria-hidden="true"></i>
                Gerar nova variação
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-toggle-motivos">
                <i class="fa-regular fa-lightbulb btn-icon" aria-hidden="true"></i>
                <span>Mostrar critérios</span>
            </button>
        </div>
    `;

    const kmEl = plano.distanciaTotalKm > 0
        ? `<div class="meta-stat"><span>Distância</span><strong>${Math.round(plano.distanciaTotalKm)} km</strong></div>`
        : '';
    document.getElementById('roteiro-meta').innerHTML = `
        <div class="meta-stat"><span>Dias</span><strong>${plano.days}</strong></div>
        <div class="meta-stat"><span>Paradas</span><strong>${plano.chosen.length}</strong></div>
        <div class="meta-stat"><span>Tempo total</span><strong>${minutosParaHHMM(plano.tempoTotal)}</strong></div>
        <div class="meta-stat"><span>Deslocamento</span><strong>${minutosParaHHMM(plano.tempoDesloc)}</strong></div>
        ${kmEl}
        <div class="meta-stat"><span>Custo total</span><strong>${fmtBRL(plano.total)}</strong></div>
    `;

    // Tags
    document.getElementById('roteiro-tags').innerHTML = plano.tagsPresentes
        .filter(t => TAG_LABEL[t])
        .slice(0, 10)
        .map(t => `<span class="roteiro-tag">${TAG_LABEL[t]}</span>`)
        .join('');

    // Budget gauge
    document.getElementById('roteiro-budget').className = 'budget-gauge' + (overBudget ? ' over' : '');
    document.getElementById('roteiro-budget').innerHTML = `
        <span class="bar"><span style="width:${budgetPct}%"></span></span>
        <p>${overBudget
            ? `<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ${Math.round((plano.total / plano.budget) * 100 - 100)}% acima do orçamento`
            : (plano.budget > 0 ? `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Dentro do orçamento (${budgetPct}% utilizado)` : 'Orçamento não informado')}</p>
    `;

    // Dias
    document.getElementById('roteiro-days').innerHTML = plano.dias.map((dia, i) => `
        <article class="roteiro-day">
            <h4>Dia ${i + 1}${plano.startDate ? ' · ' + fmtDataCurta(addDays(plano.startDate, i)) : ''}</h4>
            <ol>
                ${dia.map(stop => {
                    const motivos = (stop.motivos || []).slice(0, 3);
                    const motivosHtml = motivos.length
                        ? `<div class="stop-motivos" hidden><i class="fa-regular fa-lightbulb" aria-hidden="true"></i> Escolhida porque: <em>${motivos.join(' · ')}</em></div>`
                        : '';
                    const chegadaSaida = stop.chegada && stop.saida
                        ? `<small class="stop-window">${stop.chegada} → ${stop.saida}</small>`
                        : '';
                    return `
                    <li class="roteiro-stop">
                        <div class="stop-when">
                            <span class="stop-time">${stop.horario_sugerido}</span>
                            <span class="stop-duracao">${stop.exp.duracao} min</span>
                            ${chegadaSaida}
                        </div>
                        <div class="stop-main">
                            <strong>${stop.exp.nome}</strong>
                            <span class="stop-place">
                                ${stop.vin.nome} · ${stop.vin.cidade || ''}
                                <span class="av-badge ${stop.disponibilidade.cls}">${stop.disponibilidade.label}</span>
                            </span>
                            ${motivosHtml}
                        </div>
                        <div class="stop-actions">
                            <span class="stop-price">${fmtBRL(stop.exp.preco * plano.pessoas)}</span>
                            <button type="button" class="btn btn-ghost" data-action="ver-vinicola" data-vin="${stop.vin.id}">Ver vinícola</button>
                            <button type="button" class="btn btn-primary" data-action="reservar" data-vin="${stop.vin.id}" data-exp="${stop.exp.id}">Reservar</button>
                        </div>
                    </li>
                `;}).join('')}
            </ol>
        </article>
    `).join('');

    // Bind: toggle motivos
    section.querySelector('#btn-toggle-motivos')?.addEventListener('click', () => {
        const btn = section.querySelector('#btn-toggle-motivos');
        const todos = section.querySelectorAll('.stop-motivos');
        const todosVisiveis = [...todos].every(m => !m.hidden);
        todos.forEach(m => { m.hidden = todosVisiveis; });
        btn.querySelector('span').textContent = todosVisiveis ? 'Mostrar critérios' : 'Ocultar critérios';
    });

    // Bind: regenerar — gera variacao com novo seed
    section.querySelector('#btn-regenerar')?.addEventListener('click', () => {
        const novoInput = { ...plano, seed: Date.now() };
        const novoPlano = generateRoteiro(novoInput);
        renderRoteiro(novoPlano);
        showToast('Variação gerada com base nos mesmos critérios.');
    });

    // Bind acoes
    section.querySelectorAll('[data-action="ver-vinicola"]').forEach(btn => {
        btn.addEventListener('click', () => openVinicola(Number(btn.dataset.vin)));
    });
    section.querySelectorAll('[data-action="reservar"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const vinId = Number(btn.dataset.vin);
            const expId = Number(btn.dataset.exp);
            document.getElementById('b-vinicola').value = vinId;
            refreshExperiencias();
            document.getElementById('b-experiencia').value = expId;
            refreshSlots();
            document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        });
    });

    savePlan(plano);
    renderMapa(plano);

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('travel-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const startDate = fd.get('start-date') || '';
    const days      = Math.max(1, Number(fd.get('days')) || 1);
    const pessoas   = Math.max(1, Number(fd.get('people')) || 1);
    const budget    = Math.max(0, Number(fd.get('budget')) || 0);
    const profile   = fd.get('profile') || '';

    // Validacao
    const startDateInput = document.getElementById('start-date');
    const profileInput = document.getElementById('profile');
    let invalid = false;

    if (!startDate) {
        setFieldError(startDateInput, 'Informe a data de início da viagem.');
        invalid = true;
    } else if (isPastDate(startDate)) {
        setFieldError(startDateInput, 'A data de início não pode estar no passado.');
        invalid = true;
    } else {
        clearFieldError(startDateInput);
    }
    if (!profile) {
        setFieldError(profileInput, 'Selecione o perfil da viagem.');
        invalid = true;
    } else {
        clearFieldError(profileInput);
    }
    if (invalid) {
        showToast('Revise os campos destacados antes de gerar o roteiro.', 'error');
        return;
    }

    const input = {
        startDate, days, pessoas, budget, profile,
        pace:      fd.get('pace') || 'equilibrado',
        notes:     fd.get('notes') || '',
        interests: [...e.target.querySelectorAll('input[name="interests"]:checked')].map(i => i.value),
    };
    const plano = generateRoteiro(input);
    renderRoteiro(plano);
    showToast('Roteiro gerado com base nas suas preferências!');
    persistirRoteiroNoBackend(input);
});

// Limpa erros em tempo real
['start-date', 'profile', 'days', 'people', 'budget'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearFieldError(el));
    if (el && el.tagName === 'SELECT') el.addEventListener('change', () => clearFieldError(el));
});

document.getElementById('roteiro-edit')?.addEventListener('click', () => {
    document.getElementById('planejar').scrollIntoView({ behavior: 'smooth' });
});

// =================== Mapa / Rota ===================
let mapaActiveDay = 0;

// Detecta se uma parada deve ser precedida por sugestao de almoco —
// quando o gap (chegada da proxima vs saida da atual) cruza 12h-14h
// e nenhuma das duas paradas eh harmonizada.
function sugerirAlmoco(stopAtual, stopProx) {
    if (!stopAtual.saida || !stopProx.chegada) return null;
    const fim = timeToMin(stopAtual.saida);
    const inicio = timeToMin(stopProx.chegada);
    if (fim >= 12 * 60 && fim <= 14 * 60 && (inicio - fim) >= 30) {
        const jaHarmonizada = (stopAtual.exp.tags || []).includes('harmonizado')
            || (stopProx.exp.tags || []).includes('harmonizado');
        if (jaHarmonizada) return null;
        return {
            tipo: 'almoço',
            inicio: stopAtual.saida,
            fim: stopProx.chegada,
            duracaoMin: inicio - fim,
        };
    }
    return null;
}

function renderMapa(plano) {
    const empty = document.getElementById('mapa-empty');
    const content = document.getElementById('mapa-content');
    if (!plano || !plano.dias || plano.dias.length === 0) {
        empty.hidden = false;
        content.hidden = true;
        return;
    }
    empty.hidden = true;
    content.hidden = false;
    if (mapaActiveDay >= plano.dias.length) mapaActiveDay = 0;

    // Resumo enriquecido — inclui distancia total quando disponivel
    const totalParadas = plano.chosen.length;
    const partida = plano.dias[0]?.[0]?.vin?.cidade || 'Vale dos Vinhedos';
    const horarioPartida = plano.dias[0]?.[0]?.horario_sugerido || '—';
    const kmCard = plano.distanciaTotalKm > 0
        ? `<div class="mapa-resumo-item"><span>Distância</span><strong>${Math.round(plano.distanciaTotalKm)} km</strong></div>`
        : '';
    document.getElementById('mapa-resumo').innerHTML = `
        <div class="mapa-resumo-item">
            <span>Tempo total</span>
            <strong>${minutosParaHHMM(plano.tempoTotal)}</strong>
        </div>
        <div class="mapa-resumo-item">
            <span>Deslocamento</span>
            <strong>${minutosParaHHMM(plano.tempoDesloc)}</strong>
        </div>
        ${kmCard}
        <div class="mapa-resumo-item">
            <span>Paradas</span>
            <strong>${totalParadas}</strong>
        </div>
        <div class="mapa-resumo-item">
            <span>Saída sugerida</span>
            <strong>${horarioPartida}<br><small style="font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;opacity:.7;font-style:normal;font-family:var(--font-sans);font-weight:600">${partida}</small></strong>
        </div>
    `;

    // Barra de acoes — imprimir + compartilhar + .ics (novo)
    let actionsEl = document.getElementById('mapa-actions');
    if (!actionsEl) {
        actionsEl = document.createElement('div');
        actionsEl.id = 'mapa-actions';
        actionsEl.className = 'mapa-actions';
        const resumo = document.getElementById('mapa-resumo');
        resumo.parentNode.insertBefore(actionsEl, resumo.nextSibling);
    }
    actionsEl.innerHTML = `
        <button type="button" class="btn btn-ghost btn-sm" id="btn-mapa-print">
            <i class="fa-solid fa-print btn-icon" aria-hidden="true"></i> Imprimir
        </button>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-mapa-share">
            <i class="fa-solid fa-share-nodes btn-icon" aria-hidden="true"></i> Compartilhar
        </button>
        <button type="button" class="btn btn-ghost btn-sm" id="btn-mapa-ics">
            <i class="fa-regular fa-calendar-plus btn-icon" aria-hidden="true"></i> Exportar agenda
        </button>
    `;
    document.getElementById('btn-mapa-print')?.addEventListener('click', () => window.print());
    document.getElementById('btn-mapa-share')?.addEventListener('click', () => sharePlano(plano));
    document.getElementById('btn-mapa-ics')?.addEventListener('click', () => downloadICSRoteiro(plano));

    // Tabs
    const tabsEl = document.getElementById('mapa-tabs');
    tabsEl.innerHTML = plano.dias.map((_, i) => `
        <button type="button" class="mapa-tab ${i === mapaActiveDay ? 'is-active' : ''}" role="tab"
                data-day="${i}" aria-selected="${i === mapaActiveDay}">
            Dia ${i + 1}${plano.startDate ? ' · ' + fmtDataCurta(addDays(plano.startDate, i)) : ''}
        </button>
    `).join('');
    tabsEl.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => {
            mapaActiveDay = Number(b.dataset.day);
            renderMapa(plano);
        });
    });

    // Cabecalho do dia ativo — km do dia, paradas do dia, primeiro e ultimo horario
    const dia = plano.dias[mapaActiveDay] || plano.dias[0];
    const kmDia = dia.reduce((s, x) => s + (x.distanciaKm || 0), 0);
    const tempoDia = dia.reduce((s, x) => s + x.exp.duracao + (x.deslocamentoMin || 0), 0);
    const inicioDia = dia[0]?.chegada || dia[0]?.horario_sugerido || '—';
    const fimDia = dia[dia.length - 1]?.saida || '—';

    // Timeline do dia ativo com chegada/saida + sugestao de almoco + distancia
    const timeline = document.getElementById('mapa-timeline');
    const partes = [];
    partes.push(`
        <div class="mapa-dia-header">
            <div><span>Janela do dia</span><strong>${inicioDia} → ${fimDia}</strong></div>
            <div><span>Paradas</span><strong>${dia.length}</strong></div>
            <div><span>Duração do dia</span><strong>${minutosParaHHMM(tempoDia)}</strong></div>
            ${kmDia > 0 ? `<div><span>Distância</span><strong>${Math.round(kmDia)} km</strong></div>` : ''}
        </div>
    `);

    dia.forEach((stop, idx) => {
        // Conector entre paradas: deslocamento + km + eventual sugestao de almoco
        if (idx > 0) {
            const prev = dia[idx - 1];
            const km = stop.distanciaKm > 0 ? ` · ${stop.distanciaKm.toFixed(1)} km` : '';
            partes.push(`
                <div class="mapa-deslocamento">
                    <i class="fa-solid fa-car-side" aria-hidden="true"></i>
                    ${minutosParaHHMM(stop.deslocamentoMin)} de deslocamento até ${stop.vin.nome}${km}
                </div>
            `);
            const almoco = sugerirAlmoco(prev, stop);
            if (almoco) {
                partes.push(`
                    <div class="mapa-pausa">
                        <span class="mapa-pausa-icon" aria-hidden="true"><i class="fa-solid fa-utensils"></i></span>
                        <div class="mapa-pausa-body">
                            <strong>Pausa sugerida — almoço</strong>
                            <small>${almoco.inicio} → ${almoco.fim} · ${minutosParaHHMM(almoco.duracaoMin)} livres entre as paradas</small>
                        </div>
                    </div>
                `);
            }
        }

        const chegada = stop.chegada || stop.horario_sugerido;
        const saida = stop.saida || '';
        const motivos = (stop.motivos || []).slice(0, 2);
        partes.push(`
            <div class="mapa-stop">
                <div class="mapa-marker">${idx + 1}</div>
                <div class="mapa-stop-body">
                    <div class="mapa-stop-when">
                        <span class="mapa-stop-time">${chegada}${saida ? ' → ' + saida : ''}</span>
                        <span class="mapa-stop-duracao">${stop.exp.duracao} min · ${minutosParaHHMM(stop.exp.duracao)}</span>
                        <span class="av-badge ${stop.disponibilidade.cls}">${stop.disponibilidade.label}</span>
                    </div>
                    <span class="mapa-stop-vin">${stop.vin.nome} · ${stop.vin.cidade || ''}</span>
                    <span class="mapa-stop-exp">${stop.exp.nome}</span>
                    ${motivos.length ? `<span class="mapa-stop-motivo"><i class="fa-regular fa-lightbulb" aria-hidden="true"></i> ${motivos.join(' · ')}</span>` : ''}
                </div>
            </div>
        `);
    });

    timeline.innerHTML = partes.join('');
}

// Compartilha o plano via URL com hash codificado em base64.
// O destinatario abre o link e o plano eh restaurado automaticamente.
function sharePlano(plano) {
    try {
        // Compacta apenas o input do plano — quem abrir regenera o roteiro.
        const payload = {
            startDate: plano.startDate,
            days: plano.days,
            pessoas: plano.pessoas,
            budget: plano.budget,
            profile: plano.profile,
            pace: plano.pace,
            interests: plano.interests || [],
            notes: plano.notes || '',
            seed: plano.seed,
        };
        const bytes = new TextEncoder().encode(JSON.stringify(payload));
        const hash = '#roteiro=' + btoa(String.fromCharCode(...bytes));
        const url = location.origin + location.pathname + hash;
        if (navigator.share) {
            navigator.share({ title: 'Meu roteiro Uva & Via', url })
                .catch(() => copiarUrl(url));
        } else {
            copiarUrl(url);
        }
    } catch (e) {
        showToast('Não foi possível gerar o link.', 'error');
    }
}
function copiarUrl(url) {
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(
            () => showToast('Link copiado — cole onde quiser compartilhar.'),
            () => fallbackPromptUrl(url)
        );
    } else {
        fallbackPromptUrl(url);
    }
}
function fallbackPromptUrl(url) {
    window.prompt('Copie o link do roteiro:', url);
}

// Tenta restaurar um plano vindo do hash da URL (#roteiro=...)
function tryRestorePlanoFromHash() {
    const m = (location.hash || '').match(/^#roteiro=(.+)$/);
    if (!m) return false;
    try {
        const bytes = Uint8Array.from(atob(m[1]), c => c.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder().decode(bytes));
        const plano = generateRoteiro(payload);
        renderRoteiro(plano);
        showToast('Roteiro compartilhado restaurado.');
        // Limpa o hash para nao re-disparar em refresh acidental
        history.replaceState(null, '', location.pathname);
        return true;
    } catch (e) {
        console.warn('Falha ao restaurar plano:', e);
        return false;
    }
}

// Gera um .ics multi-evento com todas as paradas do roteiro.
function downloadICSRoteiro(plano) {
    if (!plano || !plano.dias || plano.dias.length === 0) return;
    const toICS = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const linhas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UvaVia//Roteiro//PT'];
    plano.dias.forEach((dia, i) => {
        const dataDia = plano.startDate ? addDays(plano.startDate, i) : getTodayISO();
        dia.forEach((stop, idx) => {
            const horario = stop.chegada || stop.horario_sugerido || '10:00';
            const dt = new Date(dataDia + 'T' + horario + ':00');
            if (isNaN(dt.getTime())) return;
            const dtEnd = new Date(dt.getTime() + (stop.exp.duracao * 60 * 1000));
            linhas.push('BEGIN:VEVENT');
            linhas.push(`UID:roteiro-${plano.seed || Date.now()}-${i}-${idx}@uvaevia`);
            linhas.push(`DTSTAMP:${toICS(new Date())}`);
            linhas.push(`DTSTART:${toICS(dt)}`);
            linhas.push(`DTEND:${toICS(dtEnd)}`);
            linhas.push(`SUMMARY:${stop.exp.nome} — ${stop.vin.nome}`);
            linhas.push(`LOCATION:${stop.vin.nome}, ${stop.vin.cidade || ''}`);
            linhas.push(`DESCRIPTION:Parada ${idx + 1} do dia ${i + 1} no roteiro Uva & Via.`);
            linhas.push('END:VEVENT');
        });
    });
    linhas.push('END:VCALENDAR');
    const blob = new Blob([linhas.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roteiro-uvaevia-${plano.startDate || getTodayISO()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
    showToast('Roteiro exportado para sua agenda.');
}

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
    slotsBlock.hidden = false;
    updateSlotsTimestamp();
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
    btnReservar.disabled = !inpNome.value.trim();
}

selVinicola.addEventListener('change', refreshExperiencias);
selExperiencia.addEventListener('change', refreshSlots);
inpPessoas.addEventListener('input', refreshSummary);
inpNome.addEventListener('input', refreshSummary);

// =================== Reservas confirmadas ===================
// Persistencia no backend via UvaViaApi (era localStorage). Cache em memoria
// pra evitar refetch a cada render; sincronizado no login e apos cada mutacao.
const STORAGE_KEY = 'uvaevia.reservas';        // mantido so para limpeza one-time
const listEl = document.getElementById('reservations-list');
const emptyEl = document.getElementById('reservations-empty');
const actionsEl = document.getElementById('reservations-actions');

let reservasCache = [];

// Mapeia campo da API -> formato esperado pelo render (vinicola_nome -> vinicola, etc).
function mapReservaApi(r) {
    const horario = typeof r.horario === 'string' ? r.horario.slice(0, 5) : r.horario;
    return {
        id: String(r.id),
        vinicola: r.vinicola_nome,
        cidade: r.cidade,
        experiencia: r.experiencia_nome,
        data: r.data_reserva,
        horario,
        pessoas: Number(r.num_pessoas),
        nome: r.nome_completo || (window.UvaViaApi?.user?.nome_completo) || '—',
        total: Number(r.preco_total),
        criadaEm: r.criado_em ? new Date(r.criado_em).getTime() : Date.now(),
        cancelada: r.status === 'cancelada',
    };
}

async function fetchReservasFromAPI() {
    if (!window.UvaViaApi?.user) { reservasCache = []; renderReservas(); return; }
    try {
        const lista = await UvaViaApi.minhasReservas();
        reservasCache = lista.map(mapReservaApi);
        renderReservas();
    } catch (err) {
        console.warn('[Uva&Via] Falha ao buscar reservas:', err);
    }
}

function loadReservas() { return reservasCache; }

// Limpa restos antigos de localStorage (versao pre-API). One-shot.
try { localStorage.removeItem(STORAGE_KEY); } catch {}

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

    listEl.querySelectorAll('[data-action="cancelar"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm('Cancelar esta reserva? A vaga será liberada para outros visitantes.')) return;
            btn.disabled = true;
            try {
                await UvaViaApi.cancelarReserva(id);
                // Backend marcou como cancelada e devolveu vagas. Atualiza cache local.
                const r = reservasCache.find(x => x.id === id);
                if (r) r.cancelada = true;
                renderReservas();
                showToast('Reserva cancelada.');
                // Refresca catalogo + slots pra refletir as vagas devolvidas.
                if (typeof refreshSlots === 'function') refreshSlots({ preserveSelection: true });
                if (typeof renderExperiencias === 'function') renderExperiencias();
            } catch (err) {
                btn.disabled = false;
                showToast(err.message || 'Não foi possível cancelar a reserva.', 'error');
            }
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

// =================== AVALIACOES (reviews) ===================
const STORAGE_AVAL = 'uvaevia.avaliacoes';
let avalFilter = 'todas';

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
    return `
        <article class="aval-card" data-id="${a.id}">
            <div class="aval-card-header">
                <div class="aval-author">
                    <span class="aval-avatar" aria-hidden="true">${initial}</span>
                    <div class="aval-author-info">
                        <strong>${a.autor}</strong>
                        <small>${a.perfil || 'Visitante'}</small>
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
    if (mediaEl) mediaEl.textContent = total > 0 ? media.toFixed(1) : '—';
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
    // ordenacao padrao: recentes primeiro
    lista.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
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

// Formulario inline de avaliacao numa reserva passada
function buildAvalForm(reserva) {
    const form = document.createElement('div');
    form.className = 'aval-form';
    form.innerHTML = `
        <span class="aval-form-head">Avaliar sua visita a ${reserva.vinicola}</span>
        <div class="aval-rating-picker" role="radiogroup" aria-label="Sua nota de 1 a 5 estrelas">
            ${[1,2,3,4,5].map(n => `<button type="button" data-n="${n}" aria-label="${n} estrela${n>1?'s':''}"><i class="fa-regular fa-star" aria-hidden="true"></i></button>`).join('')}
        </div>
        <textarea placeholder="Conte como foi a experiência — atendimento, vinhos, ambiente, harmonização…" maxlength="320" rows="3"></textarea>
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
        showToast('Avaliação enviada — obrigada por compartilhar!');
        form.remove();
        renderAvaliacoes();
        renderReservas();
        renderBoutique();
        renderSugestoes();
        renderExperiencias();
    });
    return form;
}

// =================== Disponibilidade em tempo real — tick simulado ===================
const STORAGE_LAST_TICK = 'uvaevia.lastTick';
let liveTickHandle = null;
let liveTickTimestamp = Date.now();

function fmtRelativoCurto(ms) {
    const seg = Math.max(0, Math.floor((Date.now() - ms) / 1000));
    if (seg < 5)   return 'agora';
    if (seg < 60)  return `há ${seg}s`;
    const min = Math.floor(seg / 60);
    if (min < 60) return `há ${min}min`;
    const hr = Math.floor(min / 60);
    return `há ${hr}h`;
}

function refreshLiveTimestamps() {
    const txt = fmtRelativoCurto(liveTickTimestamp);
    const sugT = document.getElementById('sug-updated-time');
    if (sugT) sugT.textContent = txt;
    const slotT = document.getElementById('slots-updated-time');
    if (slotT) slotT.textContent = txt;
}

// Tick: simula outros usuarios reservando vagas. Decrementa 1 vaga em 0-2
// horarios futuros aleatorios para a UI dar a sensacao de "real time".
function liveTick() {
    if (document.hidden) return;
    const candidatos = HORARIOS.filter(h => h.vagas > 0 && !isPastDate(h.data));
    if (candidatos.length === 0) return;
    const qtd = Math.random() < 0.4 ? 0 : (Math.random() < 0.7 ? 1 : 2);
    for (let i = 0; i < qtd; i++) {
        const pick = candidatos[Math.floor(Math.random() * candidatos.length)];
        if (pick && pick.vagas > 0) pick.vagas = Math.max(0, pick.vagas - 1);
    }
    liveTickTimestamp = Date.now();
    try { localStorage.setItem(STORAGE_LAST_TICK, String(liveTickTimestamp)); } catch {}

    if (typeof refreshSlots === 'function' && document.getElementById('reservar')) {
        refreshSlots({ preserveSelection: true });
    }
    renderSugestoes();
    renderExperiencias();
    refreshLiveTimestamps();
}

function startLiveTick() {
    if (liveTickHandle) return;
    liveTickHandle = setInterval(liveTick, 45 * 1000);
    setInterval(refreshLiveTimestamps, 5 * 1000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            liveTickTimestamp = Date.now();
            refreshLiveTimestamps();
        }
    });
}

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const exp = getExperiencia();
    const hor = getHorario();
    const vin = VINICOLAS.find(v => v.id === Number(selVinicola.value));
    const pessoas = Math.max(1, Number(inpPessoas.value) || 0);
    const nome = inpNome.value.trim() || window.UvaViaApi?.user?.nome_completo || '';
    if (!exp || !hor || !vin || !nome) {
        showToast('Preencha todos os campos antes de reservar.', 'error');
        return;
    }
    if (!window.UvaViaApi?.user) {
        showToast('Faça login para confirmar sua reserva.', 'error');
        document.dispatchEvent(new CustomEvent('uvaevia:require-login'));
        return;
    }
    // Horarios custom (id >= 1000) sao locais — nao existem no backend.
    const isHorarioLocal = Number(hor.id) >= 1000;

    btnReservar.disabled = true;
    try {
        let reserva;
        if (!isHorarioLocal) {
            // Caminho principal: persiste no backend, recebe a reserva canonica de volta.
            const apiResp = await UvaViaApi.criarReserva({
                horario_id: Number(hor.id),
                num_pessoas: pessoas,
            });
            reserva = mapReservaApi(apiResp);
        } else {
            // Fallback p/ horarios locais (criados via Gestao). Continua so em memoria.
            reserva = {
                id: 'r_' + Date.now(),
                vinicola: vin.nome,
                cidade: vin.cidade,
                experiencia: exp.nome,
                data: hor.data,
                horario: hor.horario,
                pessoas,
                nome,
                total: exp.preco * pessoas,
                criadaEm: Date.now(),
                cancelada: false,
            };
        }
        reservasCache.push(reserva);

        // Decremento otimista de vagas (UI imediata; backend ja decrementou).
        const seedH = HORARIOS.find(x => x.id === hor.id);
        if (seedH) seedH.vagas = Math.max(0, seedH.vagas - pessoas);
        const customH = customHorarios.find(x => x.id === hor.id);
        if (customH) {
            customH.vagas = Math.max(0, customH.vagas - pessoas);
            saveCustomHorarios(customHorarios);
        }

        btnReservar.classList.add('is-success');
        setTimeout(() => btnReservar.classList.remove('is-success'), 900);
        showToast(`Reserva confirmada em ${vin.nome}!`);

        renderReservas();
        if (typeof renderSugestoes === 'function') renderSugestoes();
        renderExperiencias();

        selectedHorarioId = null;
        refreshSlots();
        inpNome.value = '';
        refreshSummary();

        document.getElementById('minhas-reservas').scrollIntoView({ behavior: 'smooth' });
        if (typeof renderManageTable === 'function') renderManageTable();
    } catch (err) {
        showToast(err.message || 'Não foi possível confirmar a reserva.', 'error');
    } finally {
        btnReservar.disabled = false;
    }
});

// =================== Catalogo de Experiencias ===================
const expSearch = document.getElementById('exp-search');
const expVinicolaSel = document.getElementById('exp-vinicola');
const expSort = document.getElementById('exp-sort');
const expGrid = document.getElementById('exp-grid');
const expEmpty = document.getElementById('exp-empty');
const expCount = document.getElementById('exp-count');

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
            <span class="exp-vinicola">${vin?.nome ?? '—'} · ${vin?.cidade ?? ''}</span>
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

// =================== Gestao: subtabs (Horarios | Vinicolas) ===================
document.querySelectorAll('.manage-subtab').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.subtab;
        document.querySelectorAll('.manage-subtab').forEach(b => {
            const on = b.dataset.subtab === target;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-selected', String(on));
        });
        document.querySelectorAll('[data-subtab-panel]').forEach(panel => {
            panel.hidden = panel.dataset.subtabPanel !== target;
        });
    });
});

// =================== Gestao: helpers de selects de vinicola ===================
function populateVinicolaSelects() {
    const all = getAllVinicolas();
    const builders = [
        { el: document.getElementById('b-vinicola'),     label: v => `${v.nome} — ${v.cidade}`, placeholder: 'Selecione uma vinícola…' },
        { el: document.getElementById('exp-vinicola'),   label: v => v.nome,                    placeholder: 'Todas as vinícolas' },
        { el: document.getElementById('m-vinicola'),     label: v => v.nome,                    placeholder: 'Selecione…' },
    ];
    builders.forEach(({ el, label, placeholder }) => {
        if (!el) return;
        const prev = el.value;
        el.innerHTML = '';
        if (placeholder) el.appendChild(new Option(placeholder, ''));
        all.forEach(v => el.appendChild(new Option(label(v), v.id)));
        if (prev && all.some(v => String(v.id) === prev)) el.value = prev;
    });
}

// =================== Gestao: Horarios ===================
const mVinicola = document.getElementById('m-vinicola');
const mExperiencia = document.getElementById('m-experiencia');
const mData = document.getElementById('m-data');
const mDataFim = document.getElementById('m-data-fim');
const mHorario = document.getElementById('m-horario');
const mHoraInicio = document.getElementById('m-hora-inicio');
const mHoraFim = document.getElementById('m-hora-fim');
const mIntervalo = document.getElementById('m-intervalo');
const mCapacidade = document.getElementById('m-capacidade');
const manageTable = document.getElementById('manage-table');
const managePreview = document.getElementById('manage-preview');
const manageSubmitLabel = document.getElementById('manage-submit-label');
const statTotal = document.getElementById('stat-total');
const statVagas = document.getElementById('stat-vagas');
const statOcupacao = document.getElementById('stat-ocupacao');

mVinicola.addEventListener('change', () => {
    mExperiencia.innerHTML = '';
    const vid = Number(mVinicola.value);
    if (!vid) {
        mExperiencia.disabled = true;
        mExperiencia.appendChild(new Option('Escolha uma vinícola primeiro', ''));
        return;
    }
    mExperiencia.disabled = false;
    mExperiencia.appendChild(new Option('Selecione uma experiência…', ''));
    EXPERIENCIAS.filter(e => e.vinicola_id === vid).forEach(e => {
        mExperiencia.appendChild(new Option(e.nome, e.id));
    });
});

// Modo: single | range
function getManageMode() {
    return document.querySelector('input[name="manage-mode"]:checked')?.value || 'single';
}
function applyManageMode() {
    const mode = getManageMode();
    document.querySelectorAll('[data-mode]').forEach(el => {
        const show = el.dataset.mode === mode;
        el.hidden = !show;
        // Disable hidden inputs so required nao bloqueia submit
        el.querySelectorAll('input, select').forEach(i => {
            i.disabled = !show;
            if (!show) i.removeAttribute('required');
            else if (i.id !== 'm-data-fim') i.setAttribute('required', '');
        });
    });
    if (manageSubmitLabel) {
        manageSubmitLabel.textContent = mode === 'range' ? 'Adicionar faixa' : 'Adicionar horário';
    }
    updateManagePreview();
}
document.querySelectorAll('input[name="manage-mode"]').forEach(r => {
    r.addEventListener('change', applyManageMode);
});

function timeToMin(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}
function minToTime(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function generateSlotsForMode() {
    const mode = getManageMode();
    if (mode === 'single') {
        if (!mData.value || !mHorario.value) return [];
        return [{ data: mData.value, horario: mHorario.value }];
    }
    // range
    const dStart = mData.value;
    const dEnd = mDataFim.value || mData.value;
    const hI = timeToMin(mHoraInicio.value || '10:00');
    const hF = timeToMin(mHoraFim.value || '17:00');
    const step = Number(mIntervalo.value) || 60;
    if (!dStart) return [];
    if (hF < hI) return [];

    const slots = [];
    let cursor = dStart;
    let safety = 0;
    while (cursor <= dEnd && safety++ < 60) {
        for (let t = hI; t <= hF; t += step) {
            slots.push({ data: cursor, horario: minToTime(t) });
        }
        cursor = addDays(cursor, 1);
    }
    return slots;
}
function updateManagePreview() {
    if (!managePreview) return;
    const slots = generateSlotsForMode();
    const mode = getManageMode();
    if (mode === 'range' && slots.length > 0) {
        const cap = Number(mCapacidade.value) || 0;
        managePreview.hidden = false;
        managePreview.innerHTML = `
            <strong>${slots.length}</strong> ${slots.length === 1 ? 'horário será criado' : 'horários serão criados'}
            · capacidade total: <strong>${slots.length * cap}</strong> vagas.
            <br>Primeiro: ${fmtData(slots[0].data)} às ${slots[0].horario}
            · Último: ${fmtData(slots[slots.length-1].data)} às ${slots[slots.length-1].horario}.
        `;
    } else {
        managePreview.hidden = true;
    }
}
['m-data','m-data-fim','m-hora-inicio','m-hora-fim','m-intervalo','m-capacidade'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateManagePreview);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', updateManagePreview);
});

function renderManageTable() {
    const todos = getAllHorarios().slice().sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));

    if (todos.length === 0) {
        manageTable.innerHTML = '<p class="manage-empty">Nenhum horário cadastrado.</p>';
        statTotal.textContent = '0';
        statVagas.textContent = '0';
        statOcupacao.textContent = '0%';
        return;
    }

    let totalVagasIniciais = 0;
    let totalVagasRestantes = 0;

    manageTable.innerHTML = '';
    todos.forEach(h => {
        const exp = EXPERIENCIAS.find(e => e.id === h.experiencia_id);
        const vin = exp ? VINICOLAS.find(v => v.id === exp.vinicola_id) : null;
        const capacidade = h.capacidade ?? h.vagas;
        const ocupadas = capacidade - h.vagas;
        const pct = capacidade > 0 ? Math.round((ocupadas / capacidade) * 100) : 0;
        const isCustom = customHorarios.some(c => c.id === h.id);

        totalVagasIniciais += capacidade;
        totalVagasRestantes += h.vagas;

        const barClass = pct >= 100 ? 'full' : (pct >= 70 ? 'low' : '');

        const row = document.createElement('div');
        row.className = 'manage-row' + (isCustom ? ' is-custom' : '');
        row.innerHTML = `
            <div class="manage-when">
                <span class="date">${fmtData(h.data)}</span>
                <span class="time">${h.horario}</span>
            </div>
            <div class="manage-exp">
                <h4>${exp ? exp.nome : '—'}</h4>
                <span class="vin">${vin ? vin.nome : '—'}</span>
            </div>
            <div class="manage-cap">
                <span>${h.vagas}/${capacidade} vagas · ${pct}% ocupado</span>
                <span class="bar ${barClass}"><span style="width:${pct}%"></span></span>
            </div>
            <span class="manage-badge ${isCustom ? 'custom' : ''}">${isCustom ? 'Custom' : 'Catálogo'}</span>
            <button class="manage-delete" type="button" data-id="${h.id}" ${isCustom ? '' : 'disabled title="Horários do catálogo não podem ser removidos"'}>
                Excluir
            </button>
        `;
        manageTable.appendChild(row);
    });

    manageTable.querySelectorAll('.manage-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const id = Number(btn.dataset.id);
            customHorarios = customHorarios.filter(h => h.id !== id);
            saveCustomHorarios(customHorarios);
            renderManageTable();
            renderExperiencias();
            renderSugestoes();
            showToast('Horário removido.');
        });
    });

    statTotal.textContent = todos.length;
    statVagas.textContent = totalVagasRestantes;
    const ocup = totalVagasIniciais > 0
        ? Math.round(((totalVagasIniciais - totalVagasRestantes) / totalVagasIniciais) * 100)
        : 0;
    statOcupacao.textContent = ocup + '%';
}
window.renderManageTable = renderManageTable;
window.renderSugestoes = renderSugestoes;
window.renderBoutique = renderBoutique;

document.getElementById('manage-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const expId = Number(mExperiencia.value);
    const exp = EXPERIENCIAS.find(x => x.id === expId);
    const capacidade = Math.max(1, Number(mCapacidade.value) || 0);
    const mode = getManageMode();

    // Validacao
    let invalid = false;
    if (!exp) {
        showToast('Selecione a vinícola e a experiência.', 'error');
        invalid = true;
    }
    if (capacidade < 1) {
        setFieldError(mCapacidade, 'Capacidade deve ser pelo menos 1.');
        invalid = true;
    } else {
        clearFieldError(mCapacidade);
    }
    if (!mData.value) {
        setFieldError(mData, 'Informe a data.');
        invalid = true;
    } else if (isPastDate(mData.value)) {
        setFieldError(mData, 'Não é possível cadastrar horários em datas passadas.');
        invalid = true;
    } else {
        clearFieldError(mData);
    }
    if (mode === 'range') {
        const dEnd = mDataFim.value;
        if (dEnd && dEnd < mData.value) {
            showToast('A data final deve ser igual ou posterior à inicial.', 'error');
            invalid = true;
        }
        const hI = timeToMin(mHoraInicio.value || '00:00');
        const hF = timeToMin(mHoraFim.value || '00:00');
        if (hF < hI) {
            showToast('Hora final deve ser maior que a inicial.', 'error');
            invalid = true;
        }
    }
    if (invalid) return;

    const slots = generateSlotsForMode();
    if (slots.length === 0) {
        showToast('Não há horários para criar com esses parâmetros.', 'error');
        return;
    }
    let baseId = 1000 + (Date.now() % 100000);
    slots.forEach((s, i) => {
        customHorarios.push({
            id: baseId + i,
            experiencia_id: expId,
            data: s.data,
            horario: s.horario,
            capacidade,
            vagas: capacidade,
        });
    });
    saveCustomHorarios(customHorarios);

    if (slots.length === 1) {
        showToast(`Horário criado: ${fmtData(slots[0].data)} às ${slots[0].horario}.`);
    } else {
        showToast(`${slots.length} horários criados com sucesso.`);
    }

    e.target.reset();
    mExperiencia.disabled = true;
    mExperiencia.innerHTML = '<option value="">Escolha uma vinícola primeiro</option>';
    mCapacidade.value = 12;
    if (mHoraInicio) mHoraInicio.value = '10:00';
    if (mHoraFim) mHoraFim.value = '17:00';
    document.querySelector('input[name="manage-mode"][value="single"]').checked = true;
    applyManageMode();
    setMinDateInputs();
    renderManageTable();
    renderExperiencias();
    renderSugestoes();
    if (selExperiencia.value && Number(selExperiencia.value) === expId) refreshSlots();
});

// =================== Gestao: Vinicolas (CRUD) ===================
const STORAGE_VINICOLAS = 'uvaevia.vinicolas.custom';
function loadCustomVinicolas() {
    try { return JSON.parse(localStorage.getItem(STORAGE_VINICOLAS)) || []; }
    catch { return []; }
}
function saveCustomVinicolas(arr) {
    localStorage.setItem(STORAGE_VINICOLAS, JSON.stringify(arr));
}
customVinicolas = loadCustomVinicolas();

const vinicolaForm = document.getElementById('vinicola-form');
const vNome = document.getElementById('v-nome');
const vCidade = document.getElementById('v-cidade');
const vTipo = document.getElementById('v-tipo');
const vTone = document.getElementById('v-tone');
const vDuracao = document.getElementById('v-duracao');
const vPrecoMin = document.getElementById('v-preco-min');
const vPrecoMax = document.getElementById('v-preco-max');
const vDescricao = document.getElementById('v-descricao');

vinicolaForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let invalid = false;

    const nome = vNome.value.trim();
    const cidade = vCidade.value.trim();
    const precoMin = Number(vPrecoMin.value) || 0;
    const precoMax = Number(vPrecoMax.value) || 0;
    const duracao = Number(vDuracao.value) || 0;

    if (nome.length < 3) {
        setFieldError(vNome, 'Nome muito curto.');
        invalid = true;
    } else if (getAllVinicolas().some(v => v.nome.toLowerCase() === nome.toLowerCase())) {
        setFieldError(vNome, 'Já existe uma vinícola com esse nome.');
        invalid = true;
    } else {
        clearFieldError(vNome);
    }
    if (precoMin < 0 || precoMax < 0) {
        setFieldError(vPrecoMax, 'Preços devem ser positivos.');
        invalid = true;
    } else if (precoMax < precoMin) {
        setFieldError(vPrecoMax, 'O preço máximo precisa ser maior ou igual ao mínimo.');
        invalid = true;
    } else {
        clearFieldError(vPrecoMax);
    }
    if (duracao < 15) {
        setFieldError(vDuracao, 'Duração mínima de 15 minutos.');
        invalid = true;
    } else {
        clearFieldError(vDuracao);
    }
    if (invalid) {
        showToast('Revise os campos destacados.', 'error');
        return;
    }

    const novo = {
        id: 1000 + (Date.now() % 100000),
        nome,
        cidade,
        tipo: vTipo.value || 'boutique',
        tone: vTone.value || 'a',
        descricao: vDescricao.value.trim() || 'Experiência exclusiva entre os vinhedos.',
        duracao_media_min: duracao,
        preco_min: precoMin,
        preco_max: precoMax,
        latitude: null,
        longitude: null,
    };
    customVinicolas.push(novo);
    saveCustomVinicolas(customVinicolas);
    populateVinicolaSelects();
    renderManageVinList();
    renderBoutique();
    renderExperiencias();
    e.target.reset();
    showToast(`Vinícola "${nome}" cadastrada!`);
});

// Limpa erros em tempo real do form de vinicola
['v-nome', 'v-cidade', 'v-duracao', 'v-preco-min', 'v-preco-max'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearFieldError(el));
});

function renderManageVinList() {
    const list = document.getElementById('manage-vin-list');
    const totalEl = document.getElementById('v-stat-total');
    const boutEl = document.getElementById('v-stat-boutique');
    if (!list) return;

    const all = getAllVinicolas();
    totalEl.textContent = all.length;
    boutEl.textContent = all.filter(v => v.tipo === 'boutique').length;

    if (all.length === 0) {
        list.innerHTML = '<p class="manage-empty">Nenhuma vinícola cadastrada.</p>';
        return;
    }
    list.innerHTML = all.map(v => {
        const isCustom = customVinicolas.some(c => c.id === v.id);
        const initial = (v.nome || '?').replace(/^Vin[íi]cola\s+/i, '').charAt(0).toUpperCase();
        const expCount = EXPERIENCIAS.filter(e => e.vinicola_id === v.id).length;
        return `
            <div class="manage-vin-row ${isCustom ? 'is-custom' : 'is-builtin'}" data-id="${v.id}">
                <div class="vin-row-cover tone-${v.tone || 'a'}">${initial}</div>
                <div class="vin-row-info">
                    <h4>${v.nome}</h4>
                    <span class="vin-row-city">${v.cidade}</span>
                </div>
                <div class="vin-row-meta">
                    <span><i class="fa-regular fa-clock" aria-hidden="true"></i> <strong>${v.duracao_media_min || 75}</strong> min</span>
                    <span><i class="fa-solid fa-wine-glass" aria-hidden="true"></i> <strong>${expCount}</strong> exp.</span>
                    <span><i class="fa-solid fa-tag" aria-hidden="true"></i> ${fmtBRL(v.preco_min || 0)}–${fmtBRL(v.preco_max || 0)}</span>
                </div>
                <span class="vin-row-badge ${isCustom ? 'custom' : ''}">${isCustom ? 'Custom' : (v.tipo === 'boutique' ? 'Boutique' : 'Catálogo')}</span>
                <div class="vin-row-actions">
                    <button type="button" class="btn btn-ghost" data-action="ver" data-id="${v.id}" style="padding:.5rem .85rem;font-size:.72rem;min-height:36px">Ver</button>
                    <button type="button" class="manage-delete" data-action="del" data-id="${v.id}" ${isCustom ? '' : 'disabled title="Vinícolas do catálogo não podem ser removidas"'}>Excluir</button>
                </div>
            </div>
        `;
    }).join('');

    list.querySelectorAll('[data-action="ver"]').forEach(btn => {
        btn.addEventListener('click', () => openVinicola(Number(btn.dataset.id)));
    });
    list.querySelectorAll('[data-action="del"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const id = Number(btn.dataset.id);
            customVinicolas = customVinicolas.filter(v => v.id !== id);
            saveCustomVinicolas(customVinicolas);
            populateVinicolaSelects();
            renderManageVinList();
            renderBoutique();
            renderExperiencias();
            showToast('Vinícola removida.');
        });
    });
}
window.renderManageVinList = renderManageVinList;
window.populateVinicolaSelects = populateVinicolaSelects;

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

// =================== Sincronizacao com backend ===================
// Reservas vivem no servidor — sempre que o auth muda, re-busca pra refletir
// o estado canonico (incl. reservas feitas em outro dispositivo).
document.addEventListener('uvaevia:auth-change', (e) => {
    const user = e.detail?.user;
    if (user) {
        fetchReservasFromAPI();
    } else {
        reservasCache = [];
        renderReservas();
    }
});

// Mapeamento perfil/interesse slug -> id (segue ordem do install.mysql.sql).
const PERFIL_SLUG_TO_ID = { casal: 1, amigos: 2, familia: 3, solo: 4 };
const TAG_SLUG_TO_ID = {
    'degustacao-classica': 1, 'degustacao-premium': 2, 'harmonizado': 3,
    'piquenique': 4, 'visita-tecnica': 5, 'boutique': 6, 'raros': 7,
    'sommelier': 8, 'por-do-sol': 9, 'vindima': 10, 'familiar': 11,
    'arquitetura': 12, 'rapida': 13, 'completa': 14,
};

// Persiste o roteiro no backend depois que o client gerou. Fire-and-forget — o
// algoritmo do backend gera a sua propria versao (pode divergir do client);
// aqui o objetivo e historico/auditoria, nao espelhar 1-1 a visualizacao.
async function persistirRoteiroNoBackend(input) {
    if (!window.UvaViaApi?.user) return;
    const tagIds = (input.interests || [])
        .map(slug => TAG_SLUG_TO_ID[slug])
        .filter(Boolean);
    if (!tagIds.length) return;  // backend exige ao menos 1 tag
    const perfilId = PERFIL_SLUG_TO_ID[input.profile];
    if (!perfilId) return;
    try {
        await UvaViaApi.gerarRoteiro({
            num_dias: input.days,
            num_pessoas: input.pessoas,
            orcamento_total: input.budget || 1000,
            perfil_id: perfilId,
            tag_ids: tagIds,
            data_inicio: input.startDate || null,
            nome: `Roteiro ${input.days}d (${input.pessoas}p)`,
        });
    } catch (err) {
        console.warn('[Uva&Via] Roteiro nao persistido no backend:', err.message);
    }
}
