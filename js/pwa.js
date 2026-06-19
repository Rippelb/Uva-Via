// PWA - registra o service worker e oferece "Instalar app".
// Permite usar o Uva & Via como app na tela inicial, com cache offline.

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.warn('[Uva&Via] Service worker não registrado:', err));
    });
}

let deferredInstallPrompt = null;

function mostrarBotaoInstalar() {
    if (document.getElementById('pwa-install')) return;
    const alvo = document.querySelector('.footer-brand');
    if (!alvo) return;
    const btn = document.createElement('button');
    btn.id = 'pwa-install';
    btn.type = 'button';
    btn.className = 'pwa-install-btn';
    btn.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i> Instalar o app';
    btn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        try { await deferredInstallPrompt.userChoice; } catch { /* ignore */ }
        deferredInstallPrompt = null;
        btn.remove();
    });
    alvo.appendChild(btn);
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    mostrarBotaoInstalar();
});
window.addEventListener('appinstalled', () => {
    document.getElementById('pwa-install')?.remove();
    if (typeof showToast === 'function') showToast('Uva & Via instalado! Abra pela tela inicial. 🍇');
});
