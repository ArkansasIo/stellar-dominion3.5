const API_BASE_URL = window.STELLAR_API_BASE_URL || 'http://localhost:8080';

const statusEl = document.querySelector('#status');
const playersEl = document.querySelector('#players');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

async function checkHealth() {
  statusEl.textContent = 'Checking API…';
  try {
    const data = await request('/api/health');
    statusEl.textContent = `API online • MySQL: ${data.database} • ${data.timestamp}`;
  } catch (error) {
    statusEl.textContent = `API error: ${error.message}`;
  }
}

async function loadPlayers() {
  playersEl.textContent = 'Loading…';
  try {
    const players = await request('/api/players');
    if (!players.length) {
      playersEl.textContent = 'No players found.';
      return;
    }
    playersEl.innerHTML = players.map((player) => `
      <article class="player">
        <strong>${escapeHtml(player.username)}</strong>
        <span>${escapeHtml(player.empire_name)}</span>
        <small>${escapeHtml(player.created_at)}</small>
      </article>
    `).join('');
  } catch (error) {
    playersEl.textContent = `Load error: ${error.message}`;
  }
}

document.querySelector('#health').addEventListener('click', checkHealth);
document.querySelector('#load').addEventListener('click', loadPlayers);
document.querySelector('#player-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.querySelector('#username').value.trim();
  const empireName = document.querySelector('#empire').value.trim();
  try {
    await request('/api/players', {
      method: 'POST',
      body: JSON.stringify({ username, empireName }),
    });
    event.target.reset();
    await loadPlayers();
  } catch (error) {
    statusEl.textContent = `Create error: ${error.message}`;
  }
});

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
