CREATE TABLE perfis_viagem (   
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,    
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags_interesse (
  id SERIAL PRIMARY KEY, 
  nome VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categorias_experiencia (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(), 
  atualizado_em TIMESTAMP DEFAULT NOW()
);


CREATE TABLE vinicolas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  foto_url VARCHAR(255),
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  cidade VARCHAR(80),
  duracao_media_min INT NOT NULL,
  preco_min NUMERIC(10,2) NOT NULL,
  preco_max NUMERIC(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experiencias (
  id SERIAL PRIMARY KEY,
  vinicola_id INT NOT NULL REFERENCES vinicolas(id),
  categoria_id INT NOT NULL REFERENCES categorias_experiencia(id),
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  duracao_minutos INT NOT NULL,
  preco_por_pessoa NUMERIC(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experiencias_tags (
  experiencia_id INT NOT NULL REFERENCES experiencias(id),
  tag_id INT NOT NULL REFERENCES tags_interesse(id),
  PRIMARY KEY (experiencia_id, tag_id)
);

CREATE TABLE horarios (
  id SERIAL PRIMARY KEY,
  vinicola_id INT NOT NULL REFERENCES vinicolas(id),
  experiencia_id INT NOT NULL REFERENCES experiencias(id),
  data DATE NOT NULL,
  horario TIME NOT NULL,
  capacidade_maxima INT NOT NULL,
  vagas_disponiveis INT NOT NULL CHECK (vagas_disponiveis >= 0),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visitantes (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  telefone VARCHAR(30),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE preferencias_viagem (
  id SERIAL PRIMARY KEY,
  visitante_id INT NOT NULL REFERENCES visitantes(id),
  perfil_id INT NOT NULL REFERENCES perfis_viagem(id),
  num_dias INT NOT NULL,
  num_pessoas INT NOT NULL,
  orcamento_por_pessoa NUMERIC(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE preferencias_tags (
  preferencia_id INT NOT NULL REFERENCES preferencias_viagem(id),
  tag_id INT NOT NULL REFERENCES tags_interesse(id),
  PRIMARY KEY (preferencia_id, tag_id)
);

CREATE TABLE roteiros (
  id SERIAL PRIMARY KEY,
  visitante_id INT NOT NULL REFERENCES visitantes(id),
  preferencia_id INT REFERENCES preferencias_viagem(id),
  nome VARCHAR(160) NOT NULL,
  total_dias INT NOT NULL,
  custo_estimado NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'rascunho',
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roteiro_dias (
  id SERIAL PRIMARY KEY,
  roteiro_id INT NOT NULL REFERENCES roteiros(id),
  numero_dia INT NOT NULL,
  data_dia DATE,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roteiro_paradas (
  id SERIAL PRIMARY KEY,
  roteiro_dia_id INT NOT NULL REFERENCES roteiro_dias(id),
  vinicola_id INT NOT NULL REFERENCES vinicolas(id),
  experiencia_id INT REFERENCES experiencias(id),
  ordem INT NOT NULL,
  horario_sugerido TIME NOT NULL,
  tempo_deslocamento_min INT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  visitante_id INT NOT NULL REFERENCES visitantes(id),
  vinicola_id INT NOT NULL REFERENCES vinicolas(id),
  experiencia_id INT NOT NULL REFERENCES experiencias(id),
  horario_id INT NOT NULL REFERENCES horarios(id),
  data_reserva DATE NOT NULL,
  horario TIME NOT NULL,
  num_pessoas INT NOT NULL,
  preco_total NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
