// Gestao: subtabs, Horarios e Vinicolas (CRUD)
// Dividido de script.js — carregado como <script> classico, ordem importa.

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

