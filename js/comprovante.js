// Comprovante / voucher de reserva — combate a reclamação nº1 de plataformas de
// passeio ("desencontro de informações, perdi o passeio"). Mostra código,
// endereço, contato, o que está incluído, o que levar e a política de
// cancelamento num único lugar, no celular. Inspirado no voucher mobile do
// GetYourGuide. Carregado antes de disponibilidade.js (usa gerarCodigoReserva).

function gerarCodigoReserva() {
    const base = (Date.now().toString(36) + Math.random().toString(36).slice(2)).toUpperCase();
    return 'UV-' + base.replace(/[^A-Z0-9]/g, '').slice(0, 6);
}
window.gerarCodigoReserva = gerarCodigoReserva;

function fecharModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.remove(), 200);
    document.body.classList.remove('modal-open');
}

function abrirModal(innerHTML, { labelledby } = {}) {
    document.querySelectorAll('.uv-modal-overlay').forEach(o => o.remove());
    const overlay = document.createElement('div');
    overlay.className = 'uv-modal-overlay';
    overlay.innerHTML = `<div class="uv-modal" role="dialog" aria-modal="true" ${labelledby ? `aria-labelledby="${labelledby}"` : ''}>${innerHTML}</div>`;
    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => overlay.classList.add('is-open'));

    overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(overlay); });
    overlay.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', () => fecharModal(overlay)));
    const onEsc = (e) => { if (e.key === 'Escape') { fecharModal(overlay); document.removeEventListener('keydown', onEsc); } };
    document.addEventListener('keydown', onEsc);
    overlay.querySelector('.uv-modal')?.focus?.();
    return overlay;
}
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;

function openComprovante(reservaId) {
    const reservas = loadReservas();
    const r = reservas.find(x => x.id === reservaId);
    if (!r) return;

    // Backfill de código para reservas antigas.
    if (!r.codigo) {
        r.codigo = gerarCodigoReserva();
        saveReservas(reservas);
    }

    const vin = getAllVinicolas().find(v => v.id === r.vinicola_id) || getAllVinicolas().find(v => v.nome === r.vinicola);
    const exp = EXPERIENCIAS.find(e => e.id === r.experiencia_id) || EXPERIENCIAS.find(e => e.nome === r.experiencia);
    const endereco = r.endereco || vin?.endereco || '';
    const telefone = r.telefone || vin?.telefone || '';
    const inclui = exp ? getInclusoes(exp) : [];
    const levar = exp ? getLevar(exp) : [];
    const policy = (r.cancelamento && CANCELAMENTO[r.cancelamento]) || (exp ? getCancelamento(exp) : CANCELAMENTO.flex);
    const status = typeof getReservaStatus === 'function' ? getReservaStatus(r) : { label: 'Confirmada', cls: 'is-confirmada' };

    const telLink = telefone ? telefone.replace(/[^\d+]/g, '') : '';

    const html = `
        <button type="button" class="uv-modal-close" data-modal-close aria-label="Fechar comprovante"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <div class="comprovante">
            <div class="comprovante-head">
                <span class="comprovante-marca"><i class="fa-solid fa-wine-glass" aria-hidden="true"></i> Uva &amp; Via</span>
                <span class="reserva-status ${status.cls}">${status.label}</span>
            </div>
            <h2 id="comprovante-title" class="comprovante-titulo">${r.experiencia}</h2>
            <p class="comprovante-vin">${r.vinicola} · ${r.cidade || ''}</p>
            ${status.cls === 'is-pendente' ? '<p class="comprovante-aguardando"><i class="fa-regular fa-clock" aria-hidden="true"></i> Solicitação recebida — aguardando confirmação da vinícola. Avisaremos no seu contato.</p>' : ''}

            <div class="comprovante-codigo">
                <span>Código da reserva</span>
                <strong>${r.codigo}</strong>
                <button type="button" class="btn btn-ghost btn-sm" id="copiar-codigo"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copiar</button>
            </div>

            <div class="comprovante-grid">
                <div><span>Data</span><strong>${fmtData(r.data)}</strong></div>
                <div><span>Horário</span><strong>${r.horario}</strong></div>
                <div><span>Pessoas</span><strong>${r.pessoas}</strong></div>
                <div><span>Total</span><strong>${fmtBRL(r.total)}</strong></div>
                <div><span>Responsável</span><strong>${r.nome}</strong></div>
            </div>

            ${endereco ? `<div class="comprovante-linha"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> <div><span>Endereço</span><p>${endereco}</p></div></div>` : ''}
            ${telefone ? `<div class="comprovante-linha"><i class="fa-solid fa-phone" aria-hidden="true"></i> <div><span>Contato da vinícola</span><p><a href="tel:${telLink}">${telefone}</a></p></div></div>` : ''}
            ${r.contato ? `<div class="comprovante-linha"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> <div><span>Seu contato para confirmação</span><p>${r.contato}</p></div></div>` : ''}

            ${inclui.length ? `<div class="comprovante-sec"><h4><i class="fa-solid fa-circle-check" aria-hidden="true"></i> O que está incluído</h4><ul>${inclui.map(i => `<li>${i}</li>`).join('')}</ul></div>` : ''}
            ${levar.length ? `<div class="comprovante-sec"><h4><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Leve com você / saiba antes</h4><ul>${levar.map(i => `<li>${i}</li>`).join('')}</ul></div>` : ''}

            <div class="comprovante-cancel pol-${policy.cls}">
                <strong><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ${policy.label}</strong>
                <p>${policy.desc}</p>
            </div>

            <div class="comprovante-actions">
                <button type="button" class="btn btn-ghost" id="comprovante-ics"><i class="fa-regular fa-calendar-plus" aria-hidden="true"></i> Adicionar à agenda</button>
                <button type="button" class="btn btn-primary" data-modal-close>Pronto</button>
            </div>
            <p class="comprovante-rodape">Apresente este código na recepção da vinícola. Beba com moderação. 🍇</p>
        </div>
    `;

    abrirModal(html, { labelledby: 'comprovante-title' });

    document.getElementById('comprovante-ics')?.addEventListener('click', () => {
        if (typeof downloadICS === 'function') downloadICS(r);
    });
    document.getElementById('copiar-codigo')?.addEventListener('click', () => {
        const txt = r.codigo;
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(txt).then(
                () => showToast('Código copiado.'),
                () => showToast('Código: ' + txt)
            );
        } else {
            showToast('Código: ' + txt);
        }
    });
}
window.openComprovante = openComprovante;
