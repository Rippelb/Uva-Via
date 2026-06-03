-- =============================================================================
-- Uva & Via — Instalador completo do banco em arquivo unico
-- =============================================================================
-- Como usar:
--   1. Abra http://localhost/phpmyadmin
--   2. NAO selecione nenhum banco (clique em "phpMyAdmin" no canto esquerdo)
--   3. Aba "Importar" -> selecione este arquivo -> "Executar"
--
-- O que faz:
--   - Cria o banco `uva&via` (apaga o anterior se existir)
--   - Cria todas as 13 tabelas com FKs corretas
--   - Popula com 10 vinicolas, 26 experiencias, tags, perfis, horarios
--   - Cria o adm supremo padrao: admin@uvaevia.local / trocar123
--
-- ATENCAO: a linha DROP DATABASE apaga TUDO do banco existente.
--          Para um instalacao em maquina nova isso e o desejado.
-- =============================================================================

DROP DATABASE IF EXISTS `uva&via`;
CREATE DATABASE `uva&via` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `uva&via`;

-- =============================================================================
-- SCHEMA
-- =============================================================================

CREATE TABLE perfis_viagem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tags_interesse (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categorias_experiencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE vinicolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  foto_url VARCHAR(255),
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  cidade VARCHAR(80),
  duracao_media_min INT NOT NULL,
  preco_min DECIMAL(10,2) NOT NULL,
  preco_max DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE experiencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vinicola_id INT NOT NULL,
  categoria_id INT NOT NULL,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  duracao_minutos INT NOT NULL,
  preco_por_pessoa DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vinicola_id)  REFERENCES vinicolas(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias_experiencia(id)
) ENGINE=InnoDB;

CREATE TABLE experiencias_tags (
  experiencia_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (experiencia_id, tag_id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id),
  FOREIGN KEY (tag_id)         REFERENCES tags_interesse(id)
) ENGINE=InnoDB;

CREATE TABLE horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vinicola_id INT NOT NULL,
  experiencia_id INT NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  capacidade_maxima INT NOT NULL,
  vagas_disponiveis INT NOT NULL CHECK (vagas_disponiveis >= 0),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vinicola_id)    REFERENCES vinicolas(id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id)
) ENGINE=InnoDB;

-- usuarios ja nasce com colunas de auth (sem migracao posterior).
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  telefone VARCHAR(30),
  senha_hash VARCHAR(255) NULL,
  role ENUM('adm_supremo','adm_vinicola','usuario') NOT NULL DEFAULT 'usuario',
  vinicola_id INT NULL,
  must_change_password TINYINT(1) NOT NULL DEFAULT 0,
  ultimo_login TIMESTAMP NULL DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_vinicola FOREIGN KEY (vinicola_id) REFERENCES vinicolas(id)
) ENGINE=InnoDB;

-- Tokens de recuperacao de senha (TTL curto + uso unico). token_hash guarda
-- SHA-256 do token raw enviado ao usuario; nunca o token em claro.
CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expira_em TIMESTAMP NOT NULL,
  usado_em TIMESTAMP NULL DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pwreset_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_pwreset_token (token_hash),
  INDEX idx_pwreset_usuario_status (usuario_id, usado_em)
) ENGINE=InnoDB;

CREATE TABLE preferencias_viagem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  perfil_id INT NOT NULL,
  num_dias INT NOT NULL,
  num_pessoas INT NOT NULL,
  orcamento_por_pessoa DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (perfil_id)  REFERENCES perfis_viagem(id)
) ENGINE=InnoDB;

CREATE TABLE preferencias_tags (
  preferencia_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (preferencia_id, tag_id),
  FOREIGN KEY (preferencia_id) REFERENCES preferencias_viagem(id),
  FOREIGN KEY (tag_id)         REFERENCES tags_interesse(id)
) ENGINE=InnoDB;

CREATE TABLE roteiros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  preferencia_id INT,
  nome VARCHAR(160) NOT NULL,
  total_dias INT NOT NULL,
  custo_estimado DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'rascunho',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)    REFERENCES usuarios(id),
  FOREIGN KEY (preferencia_id) REFERENCES preferencias_viagem(id)
) ENGINE=InnoDB;

CREATE TABLE roteiro_dias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roteiro_id INT NOT NULL,
  numero_dia INT NOT NULL,
  data_dia DATE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roteiro_id) REFERENCES roteiros(id)
) ENGINE=InnoDB;

CREATE TABLE roteiro_paradas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roteiro_dia_id INT NOT NULL,
  vinicola_id INT NOT NULL,
  experiencia_id INT,
  ordem INT NOT NULL,
  horario_sugerido TIME NOT NULL,
  tempo_deslocamento_min INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roteiro_dia_id) REFERENCES roteiro_dias(id),
  FOREIGN KEY (vinicola_id)    REFERENCES vinicolas(id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id)
) ENGINE=InnoDB;

CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  vinicola_id INT NOT NULL,
  experiencia_id INT NOT NULL,
  horario_id INT NOT NULL,
  data_reserva DATE NOT NULL,
  horario TIME NOT NULL,
  num_pessoas INT NOT NULL,
  preco_total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)     REFERENCES usuarios(id),
  FOREIGN KEY (vinicola_id)    REFERENCES vinicolas(id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id),
  FOREIGN KEY (horario_id)     REFERENCES horarios(id)
) ENGINE=InnoDB;

-- =============================================================================
-- SEED — dados base do Vale dos Vinhedos
-- =============================================================================

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
  ('Vinicola Pizzato',  'Vinicola familiar em Faria Lemos, reconhecida pelos Merlots.',     'https://exemplo.com/pizzato.jpg',     -29.264500, -51.528500, 'Bento Goncalves',     90,  60.00, 320.00),
  ('Vinicola Torcello', 'Pequena vinicola em Monte Belo do Sul com vista panoramica.',      'https://exemplo.com/torcello.jpg',    -29.162800, -51.634200, 'Monte Belo do Sul',   75,  45.00, 180.00),
  ('Vinicola Larentis', 'Vinicola familiar com quatro geracoes em Monte Belo do Sul.',      'https://exemplo.com/larentis.jpg',    -29.155000, -51.627000, 'Monte Belo do Sul',   90,  40.00, 220.00),
  ('Lidio Carraro',     'Uma das vinicolas mais premiadas do Brasil.',                       'https://exemplo.com/lidio.jpg',       -29.185000, -51.522000, 'Bento Goncalves',     90,  70.00, 380.00),
  ('Miolo Wine Group',  'Grande vinicola com tour completo e restaurante.',                  'https://exemplo.com/miolo.jpg',       -29.183300, -51.535000, 'Bento Goncalves',    120,  50.00, 450.00),
  ('Casa Valduga',      'Vinicola e pousada historica no Vale dos Vinhedos.',                'https://exemplo.com/valduga.jpg',     -29.189100, -51.539600, 'Bento Goncalves',    120,  55.00, 420.00),
  ('Cave Geisse',       'Referencia em espumantes metodo tradicional.',                       'https://exemplo.com/geisse.jpg',      -29.196000, -51.515000, 'Pinto Bandeira',     105,  80.00, 350.00),
  ('Vinicola Salton',   'Fundada em 1910, a mais antiga em atividade do Brasil.',            'https://exemplo.com/salton.jpg',      -29.255000, -51.497000, 'Bento Goncalves',     90,  40.00, 260.00),
  ('Don Giovanni',      'Vinicola de estilo toscano no Vale dos Vinhedos.',                  'https://exemplo.com/dongiovanni.jpg', -29.175000, -51.520000, 'Bento Goncalves',     75,  50.00, 260.00),
  ('Dom Candido',       'Vinicola familiar com cave subterranea.',                            'https://exemplo.com/domcandido.jpg',  -29.216000, -51.462000, 'Garibaldi',           75,  35.00, 180.00);

INSERT INTO experiencias (vinicola_id, categoria_id, nome, descricao, duracao_minutos, preco_por_pessoa) VALUES
  (1, 1, 'Degustacao de Merlots Pizzato',         'Degustacao guiada da linha Merlot.',                75, 120.00),
  (1, 6, 'Masterclass DNA 99',                    'Vertical do icone DNA 99.',                        120, 320.00),
  (1, 2, 'Tour pelas caves Pizzato',              'Visita as caves de barricas.',                      60,  60.00),
  (2, 1, 'Degustacao de espumantes Torcello',     'Flight de 4 espumantes.',                           60,  90.00),
  (2, 4, 'Piquenique entre vinhedos Torcello',    'Cesta com espumante entre parreirais.',            120, 180.00),
  (3, 1, 'Degustacao do Tributo Larentis',        'Degustacao harmonizada com charcutaria.',           90, 150.00),
  (3, 2, 'Tour historia da familia Larentis',     'Tour conduzido pela familia.',                      60,  40.00),
  (3, 5, 'Vindima Larentis',                      'Colheita e pisa da uva.',                          180, 220.00),
  (4, 1, 'Degustacao Agnus e Quorum',             'Flight das linhas sem madeira.',                    60, 130.00),
  (4, 6, 'Vertical Dadivas',                      'Vertical do icone Dadivas.',                       120, 380.00),
  (4, 2, 'Tour Lidio Carraro',                    'Visita a cantina.',                                 75,  70.00),
  (5, 2, 'Tour Miolo completo',                   'Visita a cantina e caves.',                         90,  80.00),
  (5, 1, 'Experiencia Lote 43',                   'Degustacao do icone Lote 43.',                      90, 280.00),
  (5, 3, 'Almoco harmonizado Miolo',              'Almoco de 4 tempos harmonizado.',                  150, 450.00),
  (6, 2, 'Tour Casa Valduga',                     'Visita a cave historica.',                          75,  70.00),
  (6, 3, 'Jantar Maria Valduga',                  'Jantar de 5 tempos harmonizado.',                  180, 420.00),
  (6, 5, 'Por do sol Valduga',                    'Taca de espumante ao por do sol.',                  90, 120.00),
  (7, 2, 'Caves na rocha Geisse',                 'Tour pelas caves cavadas na rocha.',                75, 120.00),
  (7, 4, 'Piquenique Geisse',                     'Piquenique com espumantes.',                       120, 250.00),
  (7, 1, 'Degustacao terroir Geisse',             'Flight dos espumantes de parcela unica.',           60, 180.00),
  (8, 2, 'Tour Salton historico',                 'Visita a mais antiga vinicola do Brasil.',          75,  45.00),
  (8, 1, 'Degustacao Intenso Salton',             'Flight de tintos Intenso.',                         60,  90.00),
  (9, 1, 'Degustacao classica Don Giovanni',      'Degustacao de 4 rotulos.',                          60,  70.00),
  (9, 3, 'Almoco toscano Don Giovanni',           'Almoco em ambiente toscano.',                      120, 260.00),
  (10, 2, 'Cave subterranea Dom Candido',         'Tour pela cave subterranea.',                       60,  45.00),
  (10, 1, 'Flight de moscateis Dom Candido',      'Flight dos moscateis premiados.',                   45,  55.00);

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
  (1,  1,  '2026-05-01', '10:00', 12, 12),
  (1,  1,  '2026-05-01', '14:00', 12, 10),
  (1,  2,  '2026-05-02', '15:00',  8,  8),
  (2,  4,  '2026-05-01', '10:00', 12,  4),
  (2,  5,  '2026-05-01', '16:00', 10, 10),
  (3,  6,  '2026-05-02', '11:00', 12, 12),
  (3,  8,  '2026-05-03', '09:00', 15, 15),
  (4,  9,  '2026-05-01', '10:00', 10, 10),
  (4, 10,  '2026-05-02', '14:00',  6,  6),
  (5, 12,  '2026-05-01', '10:00', 40, 30),
  (5, 14,  '2026-05-01', '12:30', 30, 20),
  (6, 15,  '2026-05-02', '10:00', 30, 30),
  (6, 17,  '2026-05-02', '17:30', 20, 15),
  (7, 18,  '2026-05-03', '10:00', 15, 15),
  (7, 19,  '2026-05-03', '12:00', 10,  8),
  (8, 21,  '2026-05-01', '10:00', 40, 40),
  (9, 23,  '2026-05-02', '14:00', 12, 12),
  (10, 25, '2026-05-03', '10:00', 20, 20);

-- =============================================================================
-- ADMIN SUPREMO PADRAO
-- =============================================================================
-- Credenciais: admin@uvaevia.local / trocar123
-- O sistema FORCA troca de senha no primeiro login (must_change_password=1).
-- Hash gerado com password_hash('trocar123', PASSWORD_BCRYPT) em PHP.

INSERT INTO usuarios (nome_completo, email, telefone, senha_hash, role, must_change_password)
VALUES (
  'Administrador Supremo',
  'admin@uvaevia.local',
  NULL,
  '$2y$10$Fft131QMHFXYMDxHzmDA2OA5HWEGQ0JuK6IPkugYFle/gtPLmB2Oy',
  'adm_supremo',
  1
);

-- =============================================================================
-- FIM. Banco pronto para uso.
-- =============================================================================
