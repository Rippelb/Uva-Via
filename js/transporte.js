// Logística & transporte — o diferencial nascido da pesquisa de campo: no Vale
// dos Vinhedos as vinícolas ficam a 3–8 km umas das outras e DIRIGIR APÓS
// DEGUSTAR é o maior problema do passeio. Nenhum concorrente trata isso.
// Renderizado dentro do roteiro, abaixo do orçamento.

const STORAGE_TRANSPORTE = 'uvaevia.transporte.modo';
const TRANSPORTE_MODOS = {
    carro:    { icon: 'fa-car-side',   label: 'Carro próprio' },
    app:      { icon: 'fa-taxi',       label: 'Motorista por app' },
    transfer: { icon: 'fa-van-shuttle', label: 'Transfer / agência' },
};

function getModoTransporte() {
    try { return localStorage.getItem(STORAGE_TRANSPORTE) || 'carro'; }
    catch { return 'carro'; }
}
function setModoTransporte(m) {
    try { localStorage.setItem(STORAGE_TRANSPORTE, m); } catch { /* ignore */ }
}

// Estimativa de custo por app (Uber/99) — heurística simples e transparente:
// bandeirada + R$/km, multiplicada pelo número de trechos (paradas).
// Devolvido como faixa para deixar claro que é estimativa.
function estimativaApp(km, paradas) {
    const trechos = Math.max(2, (paradas || 1) + 1); // hospedagem -> paradas -> volta
    const baixa = trechos * 6 + km * 2.0;
    const alta = trechos * 9 + km * 3.2;
    return { baixa, alta };
}

function renderTransporte(plano) {
    if (!plano) return;
    const section = document.getElementById('roteiro');
    if (!section) return;

    let bloco = document.getElementById('roteiro-transporte');
    if (!bloco) {
        bloco = document.createElement('div');
        bloco.id = 'roteiro-transporte';
        bloco.className = 'transporte-bloco';
        const ref = document.getElementById('roteiro-budget') || document.getElementById('roteiro-meta');
        if (ref && ref.parentNode) ref.parentNode.insertBefore(bloco, ref.nextSibling);
        else section.querySelector('.roteiro-inner')?.appendChild(bloco);
    }

    const km = Math.round(plano.distanciaTotalKm || 0);
    const paradas = plano.chosen?.length || 0;
    const pessoas = plano.pessoas || 1;
    const dias = plano.days || 1;
    const modo = getModoTransporte();
    const desloc = typeof minutosParaHHMM === 'function' ? minutosParaHHMM(plano.tempoDesloc || 0) : (plano.tempoDesloc || 0) + 'min';

    const toggle = Object.entries(TRANSPORTE_MODOS).map(([key, m]) => `
        <button type="button" class="transporte-modo${key === modo ? ' is-active' : ''}" data-modo="${key}" aria-pressed="${key === modo}">
            <i class="fa-solid ${m.icon}" aria-hidden="true"></i> ${m.label}
        </button>
    `).join('');

    let painel = '';
    if (modo === 'carro') {
        const rodizio = (dias > 1 && pessoas > 1)
            ? `<li><i class="fa-solid fa-rotate" aria-hidden="true"></i> <strong>Rodízio sugerido:</strong> revezem o motorista a cada dia (${dias} dias) para todos aproveitarem as degustações.</li>`
            : '';
        const motoristaCheck = pessoas > 1
            ? `<label class="transporte-check"><input type="checkbox" id="check-motorista"> Já temos um <strong>motorista da rodada</strong> definido (quem dirige não degusta).</label>`
            : `<p class="transporte-aviso"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Viajando só? Se for degustar, considere <button type="button" class="link-modo" data-modo="app">motorista por app</button> ou <button type="button" class="link-modo" data-modo="transfer">transfer</button> — Lei Seca é tolerância zero.</p>`;
        painel = `
            <p class="transporte-lead">As vinícolas ficam a <strong>3–8 km</strong> umas das outras. São <strong>${km} km</strong> e cerca de <strong>${desloc}</strong> ao volante neste roteiro.</p>
            <ul class="transporte-dicas">
                <li><i class="fa-solid fa-user-shield" aria-hidden="true"></i> <strong>Motorista da rodada:</strong> defina quem não vai beber. Quase toda vinícola oferece suco/água e cospideiras na degustação.</li>
                ${rodizio}
                <li><i class="fa-solid fa-square-parking" aria-hidden="true"></i> Todas as paradas têm estacionamento próprio — chegue com folga nos fins de semana.</li>
            </ul>
            ${motoristaCheck}
        `;
    } else if (modo === 'app') {
        const est = estimativaApp(km, paradas);
        painel = `
            <p class="transporte-lead">Ideal quando <strong>todos querem degustar</strong>. Estimativa de <strong>Uber/99</strong> para os ${paradas} trechos:</p>
            <div class="transporte-custo">
                <span>Custo aproximado (ida, paradas e volta)</span>
                <strong>${fmtBRL(est.baixa)} – ${fmtBRL(est.alta)}</strong>
                <small>por dia · estimativa, não cobrança</small>
            </div>
            <ul class="transporte-dicas">
                <li><i class="fa-solid fa-signal" aria-hidden="true"></i> Algumas vinícolas têm <strong>sinal fraco</strong> — peça o carro com antecedência ou combine retorno com o anfitrião.</li>
                <li><i class="fa-solid fa-clock" aria-hidden="true"></i> Em horário de pico pode faltar carro na zona rural; tenha um plano B.</li>
            </ul>
        `;
    } else {
        painel = `
            <p class="transporte-lead">Transfer/agência <strong>leva e busca com motorista</strong> — beba sem preocupação e sem perder tempo dirigindo.</p>
            <div class="transporte-custo">
                <span>Faixa de mercado (motorista o dia todo)</span>
                <strong>${fmtBRL(150)} – ${fmtBRL(350)}</strong>
                <small>por pessoa/dia · varia com o grupo e o roteiro</small>
            </div>
            <ul class="transporte-dicas">
                <li><i class="fa-solid fa-people-group" aria-hidden="true"></i> Compensa mais em <strong>grupos</strong> — o custo se dilui entre os participantes.</li>
                <li><i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Reserve com antecedência na alta temporada (vindima, feriados).</li>
            </ul>
        `;
    }

    bloco.innerHTML = `
        <div class="transporte-head">
            <h3><i class="fa-solid fa-route" aria-hidden="true"></i> Como vão se locomover?</h3>
            <p>O ponto mais subestimado de um dia de vinhos. Escolha e veja as recomendações.</p>
        </div>
        <div class="transporte-modos" role="group" aria-label="Modo de transporte">${toggle}</div>
        <div class="transporte-painel">${painel}</div>
    `;

    bloco.querySelectorAll('.transporte-modo, .link-modo').forEach(btn => {
        btn.addEventListener('click', () => {
            setModoTransporte(btn.dataset.modo);
            renderTransporte(plano);
        });
    });
    const check = bloco.querySelector('#check-motorista');
    if (check) {
        check.addEventListener('change', () => {
            if (check.checked && typeof showToast === 'function') {
                showToast('Boa! Motorista da rodada é o segredo de um dia de vinhos tranquilo. 🍇');
            }
        });
    }
}
window.renderTransporte = renderTransporte;
