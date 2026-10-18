CREATE DATABASE IF NOT EXISTS stellar_dominion
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stellar_dominion;

CREATE TABLE IF NOT EXISTS players (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  empire_name VARCHAR(128) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_players_username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS api_config (
  config_key VARCHAR(128) NOT NULL,
  config_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (config_key)
) ENGINE=InnoDB;

INSERT INTO api_config (config_key, config_value)
VALUES ('schema_version', '1')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);
