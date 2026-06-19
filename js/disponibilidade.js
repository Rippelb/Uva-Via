// Disponibilidade em tempo real — tick simulado
// Dividido de script.js — carregado como <script> classico, ordem importa.

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

document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const exp = getExperiencia();
    const hor = getHorario();
    const vin = VINICOLAS.find(v => v.id === Number(selVinicola.value));
    const pessoas = Math.max(1, Number(inpPessoas.value) || 0);
    const nome = inpNome.value.trim();
    const contato = (document.getElementById('b-contato')?.value || '').trim();
    if (!exp || !hor || !vin || !nome) {
        showToast('Preencha todos os campos antes de reservar.', 'error');
        return;
    }
    // Defesa contra "overbooking": o tick em tempo real pode ter reduzido as
    // vagas abaixo do nº de pessoas entre a selecao e o envio.
    if (hor.vagas < pessoas) {
        showToast('Não há vagas suficientes nesse horário para essa quantidade. Escolha outro.', 'error');
        refreshSlots({ preserveSelection: true });
        return;
    }
    const reserva = {
        id: 'r_' + Date.now(),
        codigo: (typeof gerarCodigoReserva === 'function' ? gerarCodigoReserva() : 'UV-' + Date.now().toString(36).toUpperCase().slice(-6)),
        vinicola: vin.nome,
        vinicola_id: vin.id,
        cidade: vin.cidade,
        endereco: vin.endereco || '',
        telefone: vin.telefone || '',
        experiencia: exp.nome,
        experiencia_id: exp.id,
        data: hor.data,
        horario: hor.horario,
        pessoas,
        nome,
        contato,
        total: exp.preco * pessoas,
        cancelamento: (typeof getCancelamento === 'function' ? getCancelamento(exp).key : 'flex'),
        criadaEm: Date.now(),
        cancelada: false,
    };
    const reservas = loadReservas();
    reservas.push(reserva);
    saveReservas(reservas);

    const seedH = HORARIOS.find(x => x.id === hor.id);
    if (seedH) seedH.vagas = Math.max(0, seedH.vagas - pessoas);
    const customH = customHorarios.find(x => x.id === hor.id);
    if (customH) {
        customH.vagas = Math.max(0, customH.vagas - pessoas);
        saveCustomHorarios(customHorarios);
    }

    btnReservar.classList.add('is-success');
    setTimeout(() => btnReservar.classList.remove('is-success'), 900);

    showToast(`Solicitação enviada para ${vin.nome}! Você recebe a confirmação em breve.`);
    renderReservas();
    renderSugestoes();
    renderExperiencias();

    selectedHorarioId = null;
    refreshSlots();
    inpNome.value = '';
    const contatoEl = document.getElementById('b-contato');
    if (contatoEl) contatoEl.value = '';
    refreshSummary();

    document.getElementById('minhas-reservas').scrollIntoView({ behavior: 'smooth' });
    renderManageTable();

    // Confirmação imediata: abre o comprovante/voucher com código e instruções.
    if (typeof openComprovante === 'function') openComprovante(reserva.id);
});

