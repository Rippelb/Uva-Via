// Navegacao mobile (drawer, scroll spy, reveal) + Hero search global
// Dividido de script.js - carregado como <script> classico, ordem importa.

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
                     'experiencias', 'reservar', 'minhas-reservas', 'favoritos', 'avaliacoes']
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

