// Sugestoes do dia + Vinicolas boutique + Perfil da Vinicola
// Dividido de script.js — carregado como <script> classico, ordem importa.

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
                ${window.favBtnHTML ? favBtnHTML('exp', s.exp.id) : ''}
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
        const comodHtml = (window.getComodidades ? getComodidades(v) : []).slice(0, 4).map(c => {
            const meta = COMODIDADE_LABEL[c];
            return meta ? `<span class="bout-comodidade" title="${meta.label}"><i class="fa-solid ${meta.icon}" aria-hidden="true"></i></span>` : '';
        }).join('');
        return `
            <div class="bout-card-wrap">
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
                        ${comodHtml ? `<div class="bout-comodidades">${comodHtml}</div>` : ''}
                        <span class="btn btn-ghost">Ver perfil</span>
                    </div>
                </button>
                ${window.favBtnHTML ? favBtnHTML('vin', v.id) : ''}
            </div>
        `;
    }).join('');

    grid.querySelectorAll('button.bout-card[data-vin]').forEach(btn => {
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
                ${window.favBtnHTML ? favBtnHTML('vin', vin.id) : ''}
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
                                    ${window.favBtnHTML ? favBtnHTML('exp', e.id) : ''}
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

