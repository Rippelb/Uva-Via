INSERT INTO perfis_viagem (nome) VALUES
  ('Casal'),
  ('Grupo de amigos'),
  ('Familia adulta'),
  ('Viajante solo');

INSERT INTO tags_interesse (nome) VALUES
  ('Degustacao classica'),
  ('Degustacao premium'),
  ('Gastronomia harmonizada'),
  ('Piquenique entre vinhedos'),
  ('Tour pelas caves'),
  ('Experiencia boutique'),
  ('Vinhos raros'),
  ('Experiencia com sommelier'),
  ('Por do sol'),
  ('Vindima'),
  ('Vinicolas familiares'),
  ('Arquitetura e paisagens'),
  ('Experiencia rapida'),
  ('Experiencia completa');

INSERT INTO categorias_experiencia (nome) VALUES
  ('Degustacao'),
  ('Tour'),
  ('Gastronomia'),
  ('Piquenique'),
  ('Evento especial'),
  ('Masterclass');

INSERT INTO vinicolas (nome, descricao, foto_url, latitude, longitude, cidade, duracao_media_min, preco_min, preco_max) VALUES
  ('Vinicola Pizzato', 'Vinicola familiar em Faria Lemos, reconhecida pelos Merlots.', 'https://exemplo.com/pizzato.jpg', -29.264500, -51.528500, 'Bento Goncalves', 90, 60.00, 320.00),
  ('Vinicola Torcello', 'Pequena vinicola em Monte Belo do Sul com vista panoramica.', 'https://exemplo.com/torcello.jpg', -29.162800, -51.634200, 'Monte Belo do Sul', 75, 45.00, 180.00),
  ('Vinicola Larentis', 'Vinicola familiar com quatro geracoes em Monte Belo do Sul.', 'https://exemplo.com/larentis.jpg', -29.155000, -51.627000, 'Monte Belo do Sul', 90, 40.00, 220.00),
  ('Lidio Carraro', 'Uma das vinicolas mais premiadas do Brasil.', 'https://exemplo.com/lidio.jpg', -29.185000, -51.522000, 'Bento Goncalves', 90, 70.00, 380.00),
  ('Miolo Wine Group', 'Grande vinicola com tour completo e restaurante.', 'https://exemplo.com/miolo.jpg', -29.183300, -51.535000, 'Bento Goncalves', 120, 50.00, 450.00),
  ('Casa Valduga', 'Vinicola e pousada historica no Vale dos Vinhedos.', 'https://exemplo.com/valduga.jpg', -29.189100, -51.539600, 'Bento Goncalves', 120, 55.00, 420.00),
  ('Cave Geisse', 'Referencia em espumantes metodo tradicional.', 'https://exemplo.com/geisse.jpg', -29.196000, -51.515000, 'Pinto Bandeira', 105, 80.00, 350.00),
  ('Vinicola Salton', 'Fundada em 1910, a mais antiga em atividade do Brasil.', 'https://exemplo.com/salton.jpg', -29.255000, -51.497000, 'Bento Goncalves', 90, 40.00, 260.00),
  ('Don Giovanni', 'Vinicola de estilo toscano no Vale dos Vinhedos.', 'https://exemplo.com/dongiovanni.jpg', -29.175000, -51.520000, 'Bento Goncalves', 75, 50.00, 260.00),
  ('Dom Candido', 'Vinicola familiar com cave subterranea.', 'https://exemplo.com/domcandido.jpg', -29.216000, -51.462000, 'Garibaldi', 75, 35.00, 180.00);

INSERT INTO experiencias (vinicola_id, categoria_id, nome, descricao, duracao_minutos, preco_por_pessoa) VALUES
  (1, 1, 'Degustacao de Merlots Pizzato', 'Degustacao guiada da linha Merlot.', 75, 120.00),
  (1, 6, 'Masterclass DNA 99', 'Vertical do icone DNA 99.', 120, 320.00),
  (1, 2, 'Tour pelas caves Pizzato', 'Visita as caves de barricas.', 60, 60.00),
  (2, 1, 'Degustacao de espumantes Torcello', 'Flight de 4 espumantes.', 60, 90.00),
  (2, 4, 'Piquenique entre vinhedos Torcello', 'Cesta com espumante entre parreirais.', 120, 180.00),
  (3, 1, 'Degustacao do Tributo Larentis', 'Degustacao harmonizada com charcutaria.', 90, 150.00),
  (3, 2, 'Tour historia da familia Larentis', 'Tour conduzido pela familia.', 60, 40.00),
  (3, 5, 'Vindima Larentis', 'Colheita e pisa da uva.', 180, 220.00),
  (4, 1, 'Degustacao Agnus e Quorum', 'Flight das linhas sem madeira.', 60, 130.00),
  (4, 6, 'Vertical Dadivas', 'Vertical do icone Dadivas.', 120, 380.00),
  (4, 2, 'Tour Lidio Carraro', 'Visita a cantina.', 75, 70.00),
  (5, 2, 'Tour Miolo completo', 'Visita a cantina e caves.', 90, 80.00),
  (5, 1, 'Experiencia Lote 43', 'Degustacao do icone Lote 43.', 90, 280.00),
  (5, 3, 'Almoco harmonizado Miolo', 'Almoco de 4 tempos harmonizado.', 150, 450.00),
  (6, 2, 'Tour Casa Valduga', 'Visita a cave historica.', 75, 70.00),
  (6, 3, 'Jantar Maria Valduga', 'Jantar de 5 tempos harmonizado.', 180, 420.00),
  (6, 5, 'Por do sol Valduga', 'Taca de espumante ao por do sol.', 90, 120.00),
  (7, 2, 'Caves na rocha Geisse', 'Tour pelas caves cavadas na rocha.', 75, 120.00),
  (7, 4, 'Piquenique Geisse', 'Piquenique com espumantes.', 120, 250.00),
  (7, 1, 'Degustacao terroir Geisse', 'Flight dos espumantes de parcela unica.', 60, 180.00),
  (8, 2, 'Tour Salton historico', 'Visita a mais antiga vinicola do Brasil.', 75, 45.00),
  (8, 1, 'Degustacao Intenso Salton', 'Flight de tintos Intenso.', 60, 90.00),
  (9, 1, 'Degustacao classica Don Giovanni', 'Degustacao de 4 rotulos.', 60, 70.00),
  (9, 3, 'Almoco toscano Don Giovanni', 'Almoco em ambiente toscano.', 120, 260.00),
  (10, 2, 'Cave subterranea Dom Candido', 'Tour pela cave subterranea.', 60, 45.00),
  (10, 1, 'Flight de moscateis Dom Candido', 'Flight dos moscateis premiados.', 45, 55.00);

INSERT INTO experiencias_tags (experiencia_id, tag_id) VALUES
  (1, 1), (1, 11), (1, 14),
  (2, 2), (2, 7), (2, 8),
  (3, 5), (3, 13),
  (4, 1), (4, 6),
  (5, 4), (5, 9),
  (6, 3), (6, 11),
  (7, 11), (7, 13),
  (8, 10), (8, 14),
  (9, 1), (9, 8),
  (10, 2), (10, 7), (10, 8),
  (11, 5), (11, 12),
  (12, 5), (12, 12),
  (13, 2), (13, 7),
  (14, 3), (14, 14),
  (15, 5), (15, 12),
  (16, 3), (16, 8),
  (17, 9),
  (18, 5), (18, 12),
  (19, 4), (19, 9),
  (20, 2), (20, 7),
  (21, 5), (21, 11),
  (22, 1),
  (23, 1), (23, 13),
  (24, 3), (24, 12),
  (25, 5), (25, 11),
  (26, 1), (26, 13);

INSERT INTO horarios (vinicola_id, experiencia_id, data, horario, capacidade_maxima, vagas_disponiveis) VALUES
  (1, 1, '2026-05-01', '10:00', 12, 12),
  (1, 1, '2026-05-01', '14:00', 12, 10),
  (1, 2, '2026-05-02', '15:00',  8,  8),
  (2, 4, '2026-05-01', '10:00', 12,  4),
  (2, 5, '2026-05-01', '16:00', 10, 10),
  (3, 6, '2026-05-02', '11:00', 12, 12),
  (3, 8, '2026-05-03', '09:00', 15, 15),
  (4, 9, '2026-05-01', '10:00', 10, 10),
  (4, 10,'2026-05-02', '14:00',  6,  6),
  (5, 12,'2026-05-01', '10:00', 40, 30),
  (5, 14,'2026-05-01', '12:30', 30, 20),
  (6, 15,'2026-05-02', '10:00', 30, 30),
  (6, 17,'2026-05-02', '17:30', 20, 15),
  (7, 18,'2026-05-03', '10:00', 15, 15),
  (7, 19,'2026-05-03', '12:00', 10,  8),
  (8, 21,'2026-05-01', '10:00', 40, 40),
  (9, 23,'2026-05-02', '14:00', 12, 12),
  (10,25,'2026-05-03', '10:00', 20, 20);

INSERT INTO visitantes (nome_completo, email, telefone) VALUES
  ('Maria de Exemplo', 'maria@exemplo.com', '+55 54 99999-0001');

INSERT INTO preferencias_viagem (visitante_id, perfil_id, num_dias, num_pessoas, orcamento_por_pessoa) VALUES
  (1, 1, 2, 2, 500.00);

INSERT INTO preferencias_tags (preferencia_id, tag_id) VALUES
  (1, 2),
  (1, 3),
  (1, 9),
  (1, 6);
