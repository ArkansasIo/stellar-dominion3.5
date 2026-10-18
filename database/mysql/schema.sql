CREATE DATABASE IF NOT EXISTS stellar_dominion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE stellar_dominion;

CREATE TABLE IF NOT EXISTS colonies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  owner VARCHAR(120) NOT NULL,
  universe_id INT UNSIGNED NOT NULL DEFAULT 1,
  metal BIGINT UNSIGNED NOT NULL DEFAULT 0,
  crystal BIGINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_colonies_owner (owner),
  INDEX idx_colonies_universe (universe_id)
) ENGINE=InnoDB;

INSERT INTO colonies (name, owner, universe_id, metal, crystal)
SELECT 'Aether Prime', 'System', 1, 100000, 50000
WHERE NOT EXISTS (SELECT 1 FROM colonies WHERE name = 'Aether Prime');
