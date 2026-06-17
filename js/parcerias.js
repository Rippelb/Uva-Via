// Parcerias (B2B) + newsletter — mitigações dos riscos de negócio nº2 (receita)
// e nº4/5 (retenção/distribuição). Sem backend de e-mail, os leads ficam em
// localStorage (demo); o que importa aqui é tornar o MODELO visível e capturar
// intenção. Carregado antes do init.js; os forms são estáticos no HTML.

const STORAGE_LEADS = 'uvaevia.leads.vinicolas';
const STORAGE_NEWS = 'uvaevia.newsletter';

function pushLocalList(key, item) {
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(key)) || []; } catch { arr = []; }
    arr.push(item);
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch { /* ignore */ }
    return arr.length;
}

function contatoValido(v) {
    v = (v || '').trim();
    if (v.length < 6) return false;
    const email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
    const fone = (v.replace(/\D/g, '').length >= 10);
    return email || fone;
}

// --- Lead de vinícola (Seja parceiro)
const parceirosForm = document.getElementById('parceiros-form');
parceirosForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('p-nome');
    const cidade = document.getElementById('p-cidade');
    const contato = document.getElementById('p-contato');
    const err = document.getElementById('p-error');
    let invalid = false;
    if (!nome.value.trim() || nome.value.trim().length < 2) { setFieldError(nome, 'Informe o nome da vinícola.'); invalid = true; }
    else clearFieldError(nome);
    if (!contatoValido(contato.value)) { setFieldError(contato, 'Informe um e-mail ou telefone válido.'); invalid = true; }
    else clearFieldError(contato);
    if (err) err.textContent = invalid ? 'Revise os campos destacados.' : '';
    if (invalid) return;

    pushLocalList(STORAGE_LEADS, {
        nome: nome.value.trim(),
        cidade: cidade?.value.trim() || '',
        contato: contato.value.trim(),
        data: new Date().toISOString(),
    });
    parceirosForm.reset();
    showToast('Recebemos seu interesse! Nossa equipe retorna em até 2 dias úteis.');
});

// --- Newsletter (retenção)
const newsForm = document.getElementById('news-form');
newsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('news-email');
    const msg = document.getElementById('news-msg');
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((email.value || '').trim());
    if (!ok) {
        email.classList.add('is-invalid');
        if (msg) { msg.hidden = false; msg.textContent = 'Digite um e-mail válido.'; msg.className = 'news-msg is-error'; }
        return;
    }
    email.classList.remove('is-invalid');
    pushLocalList(STORAGE_NEWS, { email: email.value.trim(), data: new Date().toISOString() });
    newsForm.reset();
    if (msg) { msg.hidden = false; msg.textContent = 'Pronto! Você vai receber nossos melhores roteiros. 🍇'; msg.className = 'news-msg is-ok'; }
});
