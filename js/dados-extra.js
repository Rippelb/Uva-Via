// Dados derivados de confiança: comodidades, "o que está incluído", "o que
// levar" e política de cancelamento. Centraliza o que os concorrentes
// (GetYourGuide, Wine Locals) mostram antes da reserva e que faltava aqui.
// Carregado logo após data.js - escopo de <script> clássico é compartilhado.

// =================== Comodidades (filtráveis) ===================
const COMODIDADE_LABEL = {
    estacionamento: { icon: 'fa-square-parking',   label: 'Estacionamento' },
    restaurante:    { icon: 'fa-utensils',         label: 'Restaurante no local' },
    pet:            { icon: 'fa-paw',               label: 'Pet friendly' },
    criancas:       { icon: 'fa-child-reaching',    label: 'Recebe crianças' },
    acessivel:      { icon: 'fa-wheelchair',        label: 'Acessível (PCD)' },
    vegetariano:    { icon: 'fa-leaf',              label: 'Opções vegetarianas' },
    grupos:         { icon: 'fa-people-group',      label: 'Recebe grupos' },
};

function getComodidades(vin) {
    return Array.isArray(vin?.comodidades) ? vin.comodidades : [];
}

// =================== "O que está incluído" (derivado das tags) ===================
const INCLUSOES_POR_TAG = {
    'degustacao-classica': ['Taça de cristal para a degustação', 'Seleção de rótulos da casa', 'Água e acompanhamentos leves'],
    'degustacao-premium':  ['Taças premium (linha Riedel)', 'Rótulos ícone e safras de guarda', 'Condução técnica detalhada'],
    'harmonizado':         ['Pratos harmonizados pelo chef', 'Vinhos selecionados para cada etapa'],
    'piquenique':          ['Cesta de piquenique entre os vinhedos', 'Taças, utensílios e manta', 'Espumante ou vinho da casa'],
    'visita-tecnica':      ['Tour guiado pela cave e produção', 'Explicação do terroir e da vinificação'],
    'vindima':             ['Participação na colheita da uva', 'Equipamento (tesoura, balde) e orientação', 'Brinde da safra'],
    'por-do-sol':          ['Taça no fim de tarde com vista', 'Lugar reservado para o pôr do sol'],
    'sommelier':           ['Condução por sommelier credenciado'],
    'arquitetura':         ['Visita guiada aos espaços e à arquitetura'],
    'boutique':            ['Atendimento próximo e personalizado'],
    'raros':               ['Degustação de rótulos raros e limitados'],
};

function getInclusoes(exp) {
    if (Array.isArray(exp?.inclui) && exp.inclui.length) return exp.inclui;
    const tags = exp?.tags || [];
    const itens = [];
    tags.forEach(t => (INCLUSOES_POR_TAG[t] || []).forEach(i => { if (!itens.includes(i)) itens.push(i); }));
    if (itens.length === 0) return ['Recepção e boas-vindas', 'Experiência assistida por um anfitrião'];
    return itens.slice(0, 5);
}

// =================== "O que levar / saber" ===================
function getLevar(exp) {
    const tags = exp?.tags || [];
    const itens = ['Documento com foto', 'Chegar 10 minutos antes do horário'];
    if (tags.includes('piquenique') || tags.includes('por-do-sol')) itens.push('Agasalho leve para o fim de tarde');
    if (tags.includes('vindima')) { itens.push('Roupa e calçado que possam sujar'); itens.push('Protetor solar e boné'); }
    if (tags.includes('visita-tecnica')) itens.push('Calçado fechado e confortável');
    if (tags.includes('harmonizado')) itens.push('Disposição para uma refeição completa');
    return itens;
}

// =================== Política de cancelamento ===================
// Ataca a reclamação nº1 do Reclame Aqui (cancelamento opaco/assimétrico):
// a política fica VISÍVEL antes de reservar e no comprovante.
const CANCELAMENTO = {
    flex: {
        key: 'flex', cls: 'flex', prazoHoras: 24,
        label: 'Cancelamento grátis até 24h',
        curto: 'Grátis até 24h antes',
        desc: 'Cancele até 24 horas antes da visita e receba reembolso integral. Após esse prazo, a reserva não é reembolsável.',
    },
    moderada: {
        key: 'moderada', cls: 'moderada', prazoHoras: 48,
        label: 'Cancelamento grátis até 48h',
        curto: 'Grátis até 48h antes',
        desc: 'Experiência com preparo antecipado: cancele até 48h antes para reembolso integral. Entre 48h e 24h, reembolso de 50%. Com menos de 24h, não reembolsável.',
    },
};
// Experiências com preparo (jantares, almoços, verticais, vindima, masterclass)
// pedem antecedência maior - política moderada.
const CANCELAMENTO_MODERADA_IDS = new Set([2, 8, 10, 13, 14, 16, 24]);

function getCancelamento(exp) {
    if (exp?.cancelamento && CANCELAMENTO[exp.cancelamento]) return CANCELAMENTO[exp.cancelamento];
    if (exp && CANCELAMENTO_MODERADA_IDS.has(exp.id)) return CANCELAMENTO.moderada;
    return CANCELAMENTO.flex;
}

// Expõe no window: usado por módulos carregados depois e pelo api-client.
window.getComodidades = getComodidades;
window.getInclusoes = getInclusoes;
window.getLevar = getLevar;
window.getCancelamento = getCancelamento;
window.COMODIDADE_LABEL = COMODIDADE_LABEL;
