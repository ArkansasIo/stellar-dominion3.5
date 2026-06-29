CREATE TABLE IF NOT EXISTS user_sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON user_sessions(expire);

SELECT 'Table created or already exists' as result;