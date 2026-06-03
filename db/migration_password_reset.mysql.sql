-- Migracao idempotente: adiciona suporte a recuperacao de senha (token + TTL).
-- Aplicar em:  phpMyAdmin -> banco `uva&via` -> Importar -> este arquivo

USE `uva&via`;

-- FK usuario_id -> usuarios(id) omitida para evitar erro 1005 quando os tipos
-- divergem (UNSIGNED vs SIGNED) em instalacoes pre-existentes. A validacao
-- e feita na camada de aplicacao (api/auth/forgot-password.php).
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expira_em TIMESTAMP NOT NULL,
  usado_em TIMESTAMP NULL DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pwreset_token (token_hash),
  INDEX idx_pwreset_usuario_status (usuario_id, usado_em)
) ENGINE=InnoDB;
