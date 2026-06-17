// Lembrete da próxima visita — banner discreto quando há reserva para hoje ou
// amanhã. CellarPass/GetYourGuide mandam e-mail de lembrete; sem backend de
// e-mail, fazemos o lembrete no próprio app (e o .ics cobre o calendário).

function renderLembrete() {
    if (typeof loadReservas !== 'function') return;
    const existente = document.getElementById('lembrete-banner');

    const hoje = getTodayISO();
    const futuras = loadReservas()
        .filter(r => !r.cancelada && r.data >= hoje)
        .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
    const prox = futuras[0];

    // Sem visita próxima (≤ amanhã) → remove o banner se existir.
    const d = prox ? diasAte(prox.data) : 99;
    if (!prox || d > 1) { existente?.remove(); return; }

    // Não insistir na mesma sessão depois de dispensado.
    let dismissed = '';
    try { dismissed = sessionStorage.getItem('uvaevia.lembrete.dismissed') || ''; } catch { /* ignore */ }
    if (dismissed === prox.id) { existente?.remove(); return; }

    const quando = d === 0 ? 'hoje' : 'amanhã';
    const el = existente || document.createElement('div');
    el.id = 'lembrete-banner';
    el.className = 'lembrete-banner';
    el.innerHTML = `
        <div class="lembrete-inner">
            <span class="lembrete-icone" aria-hidden="true"><i class="fa-regular fa-bell"></i></span>
            <p>Sua visita a <strong>${prox.vinicola}</strong> é <strong>${quando}</strong> às <strong>${prox.horario}</strong>.</p>
            <button type="button" class="lembrete-ver">Ver comprovante</button>
            <button type="button" class="lembrete-fechar" aria-label="Dispensar lembrete"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
    `;
    if (!existente) document.body.appendChild(el);

    el.querySelector('.lembrete-ver')?.addEventListener('click', () => {
        if (typeof openComprovante === 'function') openComprovante(prox.id);
    });
    el.querySelector('.lembrete-fechar')?.addEventListener('click', () => {
        try { sessionStorage.setItem('uvaevia.lembrete.dismissed', prox.id); } catch { /* ignore */ }
        el.remove();
    });
}
window.renderLembrete = renderLembrete;
