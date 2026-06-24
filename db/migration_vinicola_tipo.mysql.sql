-- Migracao IDEMPOTENTE: adiciona tipo e tone as vinicolas.
-- O front diferencia vinicolas 'boutique' de 'grande' e usa o tone (a..e)
-- para escolher o gradiente do cover; sem essas colunas a API perde a info.
-- Pode rodar varias vezes sem erro (ADD COLUMN IF NOT EXISTS).
--
-- Aplicar em:  phpMyAdmin -> banco `uva&via` -> Importar -> este arquivo

USE `uva&via`;

-- 1) Adiciona colunas (idempotente via IF NOT EXISTS)
ALTER TABLE vinicolas
  ADD COLUMN IF NOT EXISTS tipo ENUM('boutique','grande') NOT NULL DEFAULT 'boutique' AFTER cidade,
  ADD COLUMN IF NOT EXISTS tone CHAR(1) NOT NULL DEFAULT 'a' AFTER tipo;

-- 2) Seta tipo/tone das vinicolas do seed (mesmos valores de js/data.js)
UPDATE vinicolas SET tipo = 'boutique', tone = 'a' WHERE nome = 'Vinicola Pizzato';
UPDATE vinicolas SET tipo = 'boutique', tone = 'b' WHERE nome = 'Vinicola Torcello';
UPDATE vinicolas SET tipo = 'boutique', tone = 'c' WHERE nome = 'Vinicola Larentis';
UPDATE vinicolas SET tipo = 'boutique', tone = 'd' WHERE nome = 'Lidio Carraro';
UPDATE vinicolas SET tipo = 'grande',   tone = 'a' WHERE nome = 'Miolo Wine Group';
UPDATE vinicolas SET tipo = 'grande',   tone = 'd' WHERE nome = 'Casa Valduga';
UPDATE vinicolas SET tipo = 'boutique', tone = 'e' WHERE nome = 'Cave Geisse';
UPDATE vinicolas SET tipo = 'grande',   tone = 'a' WHERE nome = 'Vinicola Salton';
UPDATE vinicolas SET tipo = 'boutique', tone = 'b' WHERE nome = 'Don Giovanni';
UPDATE vinicolas SET tipo = 'boutique', tone = 'c' WHERE nome = 'Dom Candido';
