-- Schema MySQL/MariaDB (XAMPP). Versao adaptada do schema.sql (PostgreSQL).
-- Crie o database antes:  CREATE DATABASE `uva&via` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- (o nome tem `&`, entao SEMPRE use backticks em comandos SQL referenciando-o)

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
  FOREIGN KEY (vinicola_id) REFERENCES vinicolas(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias_experiencia(id)
) ENGINE=InnoDB;

CREATE TABLE experiencias_tags (
  experiencia_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (experiencia_id, tag_id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id),
  FOREIGN KEY (tag_id) REFERENCES tags_interesse(id)
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
  FOREIGN KEY (vinicola_id) REFERENCES vinicolas(id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id)
) ENGINE=InnoDB;

CREATE TABLE visitantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  telefone VARCHAR(30),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE preferencias_viagem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visitante_id INT NOT NULL,
  perfil_id INT NOT NULL,
  num_dias INT NOT NULL,
  num_pessoas INT NOT NULL,
  orcamento_por_pessoa DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (visitante_id) REFERENCES visitantes(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis_viagem(id)
) ENGINE=InnoDB;

CREATE TABLE preferencias_tags (
  preferencia_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (preferencia_id, tag_id),
  FOREIGN KEY (preferencia_id) REFERENCES preferencias_viagem(id),
  FOREIGN KEY (tag_id) REFERENCES tags_interesse(id)
) ENGINE=InnoDB;

CREATE TABLE roteiros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visitante_id INT NOT NULL,
  preferencia_id INT,
  nome VARCHAR(160) NOT NULL,
  total_dias INT NOT NULL,
  custo_estimado DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'rascunho',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (visitante_id) REFERENCES visitantes(id),
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
  FOREIGN KEY (vinicola_id) REFERENCES vinicolas(id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id)
) ENGINE=InnoDB;

CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visitante_id INT NOT NULL,
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
  FOREIGN KEY (visitante_id) REFERENCES visitantes(id),
  FOREIGN KEY (vinicola_id) REFERENCES vinicolas(id),
  FOREIGN KEY (experiencia_id) REFERENCES experiencias(id),
  FOREIGN KEY (horario_id) REFERENCES horarios(id)
) ENGINE=InnoDB;
