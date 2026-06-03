// Dados (fallback) — VINICOLAS, EXPERIENCIAS, HORARIOS, AVALIACOES_SEED
// Dividido de script.js — carregado como <script> classico, ordem importa.

/* =============================================================
   Uva & Via - Front-end (vanilla)
   - Dados embutidos como fallback (substituidos pelo api-client)
   - SPA com secoes ancoradas, navegacao mobile-first
   - Algoritmo de roteiro, mapa/rota timeline, perfil de vinicola
   ============================================================= */

// =================== DADOS (fallback) ===================
// O api-client.js substitui esses arrays via splice() quando a API responde.
// Mantemos campos extras para a UI funcionar mesmo offline.

let VINICOLAS = [
    { id: 1, nome: 'Vinícola Pizzato',  cidade: 'Bento Gonçalves',     tipo: 'boutique', tone: 'a', latitude: -29.226, longitude: -51.535, descricao: 'Pioneira em Merlot no Brasil, produção autoral em pequenas safras.', duracao_media_min: 75, preco_min: 60,  preco_max: 320 },
    { id: 2, nome: 'Vinícola Torcello', cidade: 'Monte Belo do Sul',   tipo: 'boutique', tone: 'b', latitude: -29.156, longitude: -51.626, descricao: 'Espumantes premiados entre vinhedos com vista privilegiada.', duracao_media_min: 70, preco_min: 90,  preco_max: 180 },
    { id: 3, nome: 'Vinícola Larentis', cidade: 'Monte Belo do Sul',   tipo: 'boutique', tone: 'c', latitude: -29.163, longitude: -51.635, descricao: 'Família italiana com tradição em vinhos de guarda e vindima participativa.', duracao_media_min: 90, preco_min: 40,  preco_max: 220 },
    { id: 4, nome: 'Lídio Carraro',     cidade: 'Bento Gonçalves',     tipo: 'boutique', tone: 'd', latitude: -29.249, longitude: -51.553, descricao: 'Boutique de vinhos ícone, sem usar barricas de carvalho.', duracao_media_min: 80, preco_min: 70,  preco_max: 380 },
    { id: 5, nome: 'Miolo Wine Group',  cidade: 'Bento Gonçalves',     tipo: 'grande',   tone: 'a', latitude: -29.255, longitude: -51.518, descricao: 'Maior vinícola brasileira, tour completo e gastronomia harmonizada.', duracao_media_min: 110, preco_min: 80, preco_max: 450 },
    { id: 6, nome: 'Casa Valduga',      cidade: 'Bento Gonçalves',     tipo: 'grande',   tone: 'd', latitude: -29.234, longitude: -51.501, descricao: 'Tradição com pousada, restaurante Maria e jantares assinados.', duracao_media_min: 120, preco_min: 70, preco_max: 420 },
    { id: 7, nome: 'Cave Geisse',       cidade: 'Pinto Bandeira',      tipo: 'boutique', tone: 'e', latitude: -29.103, longitude: -51.426, descricao: 'Espumantes méthode champenoise envelhecidos em caves na rocha.', duracao_media_min: 85, preco_min: 120, preco_max: 250 },
    { id: 8, nome: 'Vinícola Salton',   cidade: 'Bento Gonçalves',     tipo: 'grande',   tone: 'a', latitude: -29.182, longitude: -51.518, descricao: 'Centenária, com museu e tour histórico do vinho gaúcho.', duracao_media_min: 75, preco_min: 45,  preco_max: 90 },
    { id: 9, nome: 'Don Giovanni',      cidade: 'Bento Gonçalves',     tipo: 'boutique', tone: 'b', latitude: -29.207, longitude: -51.541, descricao: 'Castelo italiano com almoço toscano entre os vinhedos.', duracao_media_min: 95, preco_min: 70,  preco_max: 260 },
    { id: 10, nome: 'Dom Cândido',      cidade: 'Garibaldi',           tipo: 'boutique', tone: 'c', latitude: -29.255, longitude: -51.532, descricao: 'Especializada em moscatéis e vinhos de mesa, com cave subterrânea.', duracao_media_min: 55, preco_min: 45,  preco_max: 55 },
];

let EXPERIENCIAS = [
    { id: 1,  vinicola_id: 1,  nome: 'Degustação de Merlots Pizzato',           preco: 120, duracao: 75,  tags: ['degustacao-classica', 'boutique', 'familiar'] },
    { id: 2,  vinicola_id: 1,  nome: 'Masterclass DNA 99',                       preco: 320, duracao: 120, tags: ['degustacao-premium', 'sommelier', 'raros', 'completa'] },
    { id: 3,  vinicola_id: 1,  nome: 'Tour pelas caves Pizzato',                 preco: 60,  duracao: 60,  tags: ['visita-tecnica', 'rapida'] },
    { id: 4,  vinicola_id: 2,  nome: 'Degustação de espumantes Torcello',        preco: 90,  duracao: 60,  tags: ['degustacao-classica', 'rapida'] },
    { id: 5,  vinicola_id: 2,  nome: 'Piquenique entre vinhedos Torcello',       preco: 180, duracao: 120, tags: ['piquenique', 'por-do-sol', 'completa', 'arquitetura'] },
    { id: 6,  vinicola_id: 3,  nome: 'Degustação do Tributo Larentis',           preco: 150, duracao: 90,  tags: ['degustacao-premium', 'familiar'] },
    { id: 7,  vinicola_id: 3,  nome: 'Tour história da família Larentis',        preco: 40,  duracao: 60,  tags: ['familiar', 'visita-tecnica', 'rapida'] },
    { id: 8,  vinicola_id: 3,  nome: 'Vindima Larentis',                         preco: 220, duracao: 180, tags: ['vindima', 'completa', 'familiar'] },
    { id: 9,  vinicola_id: 4,  nome: 'Degustação Agnus e Quorum',                preco: 130, duracao: 60,  tags: ['degustacao-premium', 'boutique', 'rapida'] },
    { id: 10, vinicola_id: 4,  nome: 'Vertical Dádivas',                         preco: 380, duracao: 120, tags: ['degustacao-premium', 'raros', 'sommelier', 'completa'] },
    { id: 11, vinicola_id: 4,  nome: 'Tour Lídio Carraro',                       preco: 70,  duracao: 75,  tags: ['visita-tecnica', 'boutique'] },
    { id: 12, vinicola_id: 5,  nome: 'Tour Miolo completo',                      preco: 80,  duracao: 90,  tags: ['visita-tecnica', 'arquitetura'] },
    { id: 13, vinicola_id: 5,  nome: 'Experiência Lote 43',                      preco: 280, duracao: 90,  tags: ['degustacao-premium', 'raros', 'sommelier'] },
    { id: 14, vinicola_id: 5,  nome: 'Almoço harmonizado Miolo',                 preco: 450, duracao: 150, tags: ['harmonizado', 'completa'] },
    { id: 15, vinicola_id: 6,  nome: 'Tour Casa Valduga',                        preco: 70,  duracao: 75,  tags: ['visita-tecnica'] },
    { id: 16, vinicola_id: 6,  nome: 'Jantar Maria Valduga',                     preco: 420, duracao: 180, tags: ['harmonizado', 'sommelier', 'completa'] },
    { id: 17, vinicola_id: 6,  nome: 'Pôr do sol Valduga',                       preco: 120, duracao: 90,  tags: ['por-do-sol', 'arquitetura'] },
    { id: 18, vinicola_id: 7,  nome: 'Caves na rocha Geisse',                    preco: 120, duracao: 75,  tags: ['visita-tecnica', 'arquitetura', 'boutique'] },
    { id: 19, vinicola_id: 7,  nome: 'Piquenique Geisse',                        preco: 250, duracao: 120, tags: ['piquenique', 'por-do-sol', 'completa'] },
    { id: 20, vinicola_id: 7,  nome: 'Degustação terroir Geisse',                preco: 180, duracao: 60,  tags: ['degustacao-premium', 'boutique', 'rapida'] },
    { id: 21, vinicola_id: 8,  nome: 'Tour Salton histórico',                    preco: 45,  duracao: 75,  tags: ['visita-tecnica', 'arquitetura', 'familiar'] },
    { id: 22, vinicola_id: 8,  nome: 'Degustação Intenso Salton',                preco: 90,  duracao: 60,  tags: ['degustacao-classica', 'rapida'] },
    { id: 23, vinicola_id: 9,  nome: 'Degustação clássica Don Giovanni',         preco: 70,  duracao: 60,  tags: ['degustacao-classica', 'familiar', 'rapida'] },
    { id: 24, vinicola_id: 9,  nome: 'Almoço toscano Don Giovanni',              preco: 260, duracao: 120, tags: ['harmonizado', 'completa', 'arquitetura'] },
    { id: 25, vinicola_id: 10, nome: 'Cave subterrânea Dom Cândido',             preco: 45,  duracao: 60,  tags: ['visita-tecnica', 'familiar', 'rapida'] },
    { id: 26, vinicola_id: 10, nome: 'Flight de moscatéis Dom Cândido',          preco: 55,  duracao: 45,  tags: ['degustacao-classica', 'rapida'] },
];

// Vinicolas customizadas (criadas via Gestao, persistidas em localStorage).
// Declarado com var para hoisting — getAllVinicolas() pode ser chamada antes do load.
var customVinicolas = [];

let HORARIOS = [
    { id: 1,  experiencia_id: 1,  data: '2026-05-08', horario: '10:00', vagas: 12 },
    { id: 2,  experiencia_id: 1,  data: '2026-05-08', horario: '14:00', vagas: 10 },
    { id: 3,  experiencia_id: 1,  data: '2026-05-09', horario: '11:00', vagas: 8 },
    { id: 4,  experiencia_id: 2,  data: '2026-05-09', horario: '15:00', vagas: 8 },
    { id: 5,  experiencia_id: 3,  data: '2026-05-10', horario: '09:30', vagas: 15 },
    { id: 6,  experiencia_id: 4,  data: '2026-05-08', horario: '10:00', vagas: 4 },
    { id: 7,  experiencia_id: 4,  data: '2026-05-08', horario: '16:00', vagas: 12 },
    { id: 8,  experiencia_id: 5,  data: '2026-05-09', horario: '16:00', vagas: 10 },
    { id: 9,  experiencia_id: 6,  data: '2026-05-09', horario: '11:00', vagas: 12 },
    { id: 10, experiencia_id: 7,  data: '2026-05-10', horario: '14:00', vagas: 15 },
    { id: 11, experiencia_id: 8,  data: '2026-05-10', horario: '09:00', vagas: 15 },
    { id: 12, experiencia_id: 9,  data: '2026-05-08', horario: '10:00', vagas: 10 },
    { id: 13, experiencia_id: 10, data: '2026-05-09', horario: '14:00', vagas: 6  },
    { id: 14, experiencia_id: 11, data: '2026-05-08', horario: '15:30', vagas: 10 },
    { id: 15, experiencia_id: 12, data: '2026-05-08', horario: '10:00', vagas: 30 },
    { id: 16, experiencia_id: 13, data: '2026-05-09', horario: '11:00', vagas: 20 },
    { id: 17, experiencia_id: 14, data: '2026-05-08', horario: '12:30', vagas: 20 },
    { id: 18, experiencia_id: 15, data: '2026-05-09', horario: '10:00', vagas: 30 },
    { id: 19, experiencia_id: 16, data: '2026-05-10', horario: '20:00', vagas: 12 },
    { id: 20, experiencia_id: 17, data: '2026-05-09', horario: '17:30', vagas: 15 },
    { id: 21, experiencia_id: 18, data: '2026-05-10', horario: '10:00', vagas: 15 },
    { id: 22, experiencia_id: 19, data: '2026-05-10', horario: '12:00', vagas: 8  },
    { id: 23, experiencia_id: 20, data: '2026-05-08', horario: '11:00', vagas: 12 },
    { id: 24, experiencia_id: 21, data: '2026-05-08', horario: '10:00', vagas: 40 },
    { id: 25, experiencia_id: 22, data: '2026-05-09', horario: '15:00', vagas: 18 },
    { id: 26, experiencia_id: 23, data: '2026-05-09', horario: '14:00', vagas: 12 },
    { id: 27, experiencia_id: 24, data: '2026-05-10', horario: '12:30', vagas: 10 },
    { id: 28, experiencia_id: 25, data: '2026-05-10', horario: '10:00', vagas: 20 },
    { id: 29, experiencia_id: 26, data: '2026-05-09', horario: '11:30', vagas: 20 },
];

// Avaliacoes (seed) - reviews iniciais para a comunidade nao parecer vazia.
// Usuarias podem adicionar novas pela tela "Minhas reservas" apos a data passar.
const AVALIACOES_SEED = [
    { id: 'av_seed_1',  vinicola_id: 1,  experiencia_id: 1,  nota: 5, autor: 'Helena M.',     perfil: 'Casal',           comentario: 'Atendimento impecável e a degustação de Merlot foi memorável. Voltaremos!',                            data: '2026-04-12' },
    { id: 'av_seed_2',  vinicola_id: 2,  experiencia_id: 5,  nota: 5, autor: 'Lucas e Ana',   perfil: 'Casal',           comentario: 'Piquenique entre os vinhedos no fim de tarde — luz mágica, espumante perfeito.',                       data: '2026-04-20' },
    { id: 'av_seed_3',  vinicola_id: 3,  experiencia_id: 8,  nota: 4, autor: 'Família Souza', perfil: 'Família adulta',  comentario: 'Participar da vindima com as crianças adultas foi inesquecível. Só achei que faltou um pouco de sombra.', data: '2026-03-05' },
    { id: 'av_seed_4',  vinicola_id: 4,  experiencia_id: 10, nota: 5, autor: 'Ricardo P.',    perfil: 'Grupo de amigos', comentario: 'Vertical do Dádivas é uma experiência sensorial sem igual. O sommelier conduziu com maestria.',         data: '2026-04-28' },
    { id: 'av_seed_5',  vinicola_id: 6,  experiencia_id: 16, nota: 5, autor: 'Marina C.',     perfil: 'Casal',           comentario: 'Jantar Maria Valduga foi um dos melhores que já fizemos. Harmonização de outro nível.',                  data: '2026-05-01' },
    { id: 'av_seed_6',  vinicola_id: 7,  experiencia_id: 18, nota: 5, autor: 'Patrícia L.',   perfil: 'Casal',           comentario: 'A cave na rocha é um espetáculo. Espumante envelhecido vale cada centavo.',                              data: '2026-04-15' },
    { id: 'av_seed_7',  vinicola_id: 9,  experiencia_id: 24, nota: 4, autor: 'Carlos R.',     perfil: 'Família adulta',  comentario: 'Almoço toscano divino, ambiente lindo. A espera entre os pratos foi um pouco longa.',                    data: '2026-04-03' },
    { id: 'av_seed_8',  vinicola_id: 5,  experiencia_id: 13, nota: 5, autor: 'Bruna T.',      perfil: 'Grupo de amigos', comentario: 'Lote 43 é uma referência nacional — degustá-lo com explicação técnica foi muito enriquecedor.',         data: '2026-03-22' },
    { id: 'av_seed_9',  vinicola_id: 10, experiencia_id: 26, nota: 4, autor: 'Júlia F.',      perfil: 'Viajante solo',   comentario: 'Flight de moscatéis surpreendente, ótimo custo-benefício. Atendimento simpático e familiar.',           data: '2026-04-09' },
    { id: 'av_seed_10', vinicola_id: 1,  experiencia_id: 3,  nota: 4, autor: 'Eduardo M.',    perfil: 'Grupo de amigos', comentario: 'Tour pelas caves bem informativo, gostei da estrutura. Senti falta de uma degustação inclusa.',          data: '2026-03-15' },
    { id: 'av_seed_11', vinicola_id: 8,  experiencia_id: 21, nota: 4, autor: 'Sofia D.',      perfil: 'Família adulta',  comentario: 'Tour histórico Salton é uma aula de enologia gaúcha. Recomendo para quem ama história.',                data: '2026-04-25' },
    { id: 'av_seed_12', vinicola_id: 2,  experiencia_id: 4,  nota: 5, autor: 'Rafael G.',     perfil: 'Casal',           comentario: 'Espumantes Torcello: sabor, brilho e uma vista de tirar o fôlego. Top!',                                 data: '2026-05-08' },
];

// Expoe os arrays no window para o api-client.js poder substituir o conteudo
// quando a API responde. `let`/`const` no escopo global de um <script> classico
// NAO viram propriedade de window, por isso a exposicao precisa ser explicita —
// sem isto o override do backend e silenciosamente ignorado e os selects esvaziam.
window.VINICOLAS = VINICOLAS;
window.EXPERIENCIAS = EXPERIENCIAS;
window.HORARIOS = HORARIOS;

