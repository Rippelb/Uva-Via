// Mapa / Rota + compartilhamento + ICS do roteiro
// Dividido de script.js - carregado como <script> classico, ordem importa.

// =================== Mapa / Rota ===================
let mapaActiveDay = 0;

// Ponto navegável de uma vinícola: usa coordenadas quando há, senão cai no
// nome+cidade. Usado para abrir a rota real no Google Maps / Waze - funcionalidade
// que o Wanderlog tem e que faltava aqui.
function pontoMaps(v) {
    if (!v) return '';
    if (v.latitude != null && v.longitude != null) return `${v.latitude},${v.longitude}`;
    return encodeURIComponent(`${v.nome}, ${v.cidade || ''}, RS`);
}
function gmapsDirUrl(vins) {
    const pts = (vins || []).map(pontoMaps).filter(Boolean);
    if (pts.length === 0) return null;
    if (pts.length === 1) return `https://www.google.com/maps/search/?api=1&query=${pts[0]}`;
    const origin = pts[0];
    const destination = pts[pts.length - 1];
    const waypoints = pts.slice(1, -1).join('%7C');
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    if (waypoints) url += `&waypoints=${waypoints}`;
    return url;
}
function gmapsStopUrl(v) {
    const p = pontoMaps(v);
    return p ? `https://www.google.com/maps/search/?api=1&query=${p}` : '#';
}

// Detecta se uma parada deve ser precedida por sugestao de almoco -
// quando o gap (chegada da proxima vs saida da atual) cruza 12h-14h
// e nenhuma das duas paradas eh harmonizada.
function sugerirAlmoco(stopAtual, stopProx) {
    if (!stopAtual.saida || !stopProx.chegada) return null;
    const fim = timeToMin(stopAtual.saida);
    const inicio = timeToMin(stopProx.chegada);
    if (fim >= 12 * 60 && fim <= 14 * 60 && (inicio - fim) >= 30) {
        const jaHarmonizada = (stopAtual.exp?.tags || []).includes('harmonizado')
            || (stopProx.exp?.tags || []).includes('harmonizado');
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

    // Resumo enriquecido - inclui distancia total quando disponivel
    const totalParadas = plano.chosen.length;
    const partida = plano.dias[0]?.[0]?.vin?.cidade || 'Vale dos Vinhedos';
    const horarioPartida = plano.dias[0]?.[0]?.horario_sugerido || '-';
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

    // Barra de acoes - imprimir + compartilhar + .ics (novo)
    let actionsEl = document.getElementById('mapa-actions');
    if (!actionsEl) {
        actionsEl = document.createElement('div');
        actionsEl.id = 'mapa-actions';
        actionsEl.className = 'mapa-actions';
        const resumo = document.getElementById('mapa-resumo');
        resumo.parentNode.insertBefore(actionsEl, resumo.nextSibling);
    }
    const vinsDoDia = (plano.dias[mapaActiveDay] || plano.dias[0] || []).filter(s => s && s.vin).map(s => s.vin);
    const rotaUrl = gmapsDirUrl(vinsDoDia);
    actionsEl.innerHTML = `
        ${rotaUrl ? `<a class="btn btn-primary btn-sm" id="btn-mapa-rota" href="${rotaUrl}" target="_blank" rel="noopener">
            <i class="fa-solid fa-diamond-turn-right btn-icon" aria-hidden="true"></i> Abrir rota no Maps
        </a>` : ''}
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

    // Cabecalho do dia ativo - km do dia, paradas do dia, primeiro e ultimo horario.
    // Filtra paradas malformadas (defesa contra plano antigo/corrompido no storage).
    const dia = (plano.dias[mapaActiveDay] || plano.dias[0] || []).filter(s => s && s.vin && s.exp);
    const kmDia = dia.reduce((s, x) => s + (x.distanciaKm || 0), 0);
    const tempoDia = dia.reduce((s, x) => s + x.exp.duracao + (x.deslocamentoMin || 0), 0);
    const inicioDia = dia[0]?.chegada || dia[0]?.horario_sugerido || '-';
    const fimDia = dia[dia.length - 1]?.saida || '-';

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
                            <strong>Pausa sugerida: almoço</strong>
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
                    <a class="mapa-stop-nav" href="${gmapsStopUrl(stop.vin)}" target="_blank" rel="noopener"><i class="fa-solid fa-location-arrow" aria-hidden="true"></i> Como chegar</a>
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
        // Compacta apenas o input do plano - quem abrir regenera o roteiro.
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
            () => showToast('Link copiado! Cole onde quiser compartilhar.'),
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
            linhas.push(`SUMMARY:${escapeICS(stop.exp.nome)} - ${escapeICS(stop.vin.nome)}`);
            linhas.push(`LOCATION:${escapeICS(stop.vin.nome)}, ${escapeICS(stop.vin.cidade || '')}`);
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

