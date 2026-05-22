-- Migracao IDEMPOTENTE: adiciona autenticacao e papeis ao sistema.
-- Pode rodar varias vezes sem erro. Detecta automaticamente o estado atual:
--   * Renomeia visitantes -> usuarios se ainda nao foi feito
--   * Adiciona colunas de auth (senha_hash, role, vinicola_id, etc) se faltarem
--   * Renomeia visitante_id -> usuario_id nas tabelas dependentes
--   * Insere o adm supremo padrao se nao existir
--
-- Aplicar em:  phpMyAdmin -> banco `uva&via` -> Importar -> este arquivo

SET FOREIGN_KEY_CHECKS = 0;

-- 1) Renomeia visitantes -> usuarios (so se visitantes existe e usuarios nao)
SET @sql := IF(
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'visitantes')
    AND NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'usuarios'),
    'RENAME TABLE visitantes TO usuarios',
    'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Adiciona colunas de auth (idempotente via IF NOT EXISTS)
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(255) NULL AFTER telefone,
  ADD COLUMN IF NOT EXISTS role ENUM('adm_supremo','adm_vinicola','usuario') NOT NULL DEFAULT 'usuario' AFTER senha_hash,
  ADD COLUMN IF NOT EXISTS vinicola_id INT NULL AFTER role,
  ADD COLUMN IF NOT EXISTS must_change_password TINYINT(1) NOT NULL DEFAULT 0 AFTER vinicola_id,
  ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP NULL DEFAULT NULL AFTER must_change_password;

-- 3) FK opcional - omitida na migracao automatica para evitar erro 1005 quando
-- vinicolas.id e usuarios.vinicola_id tem tipos divergentes (ex.: UNSIGNED vs
-- SIGNED) em instalacoes pre-existentes. A validacao do vinicola_id e feita na
-- camada de aplicacao (api/usuarios.php). Pra adicionar manualmente depois:
--   ALTER TABLE usuarios MODIFY vinicola_id INT UNSIGNED NULL;
--   ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_vinicola
--     FOREIGN KEY (vinicola_id) REFERENCES vinicolas(id);

-- 4) Renomeia visitante_id -> usuario_id nas tabelas dependentes (idempotente)
SET @sql := IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'reservas' AND column_name = 'visitante_id'),
    'ALTER TABLE reservas CHANGE COLUMN visitante_id usuario_id INT NOT NULL',
    'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'preferencias_viagem' AND column_name = 'visitante_id'),
    'ALTER TABLE preferencias_viagem CHANGE COLUMN visitante_id usuario_id INT NOT NULL',
    'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(
    EXISTS(SELECT 1 FROM information_schema.columns
           WHERE table_schema = DATABASE() AND table_name = 'roteiros' AND column_name = 'visitante_id'),
    'ALTER TABLE roteiros CHANGE COLUMN visitante_id usuario_id INT NOT NULL',
    'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 5) Seed do adm supremo (senha 'trocar123', forcado a trocar no 1o login)
INSERT INTO usuarios (nome_completo, email, telefone, senha_hash, role, must_change_password)
SELECT 'Administrador Supremo', 'admin@uvaevia.local', NULL,
       '$2y$10$Fft131QMHFXYMDxHzmDA2OA5HWEGQ0JuK6IPkugYFle/gtPLmB2Oy',
       'adm_supremo', 1
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@uvaevia.local');

SET FOREIGN_KEY_CHECKS = 1;
