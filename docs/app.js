const saved = localStorage.getItem('stellarApiUrl') || '';
const apiInput = document.querySelector('#apiUrl');
const status = document.querySelector('#status');
const dbStatus = document.querySelector('#dbStatus');
const colonies = document.querySelector('#colonies');
apiInput.value = saved;

function apiBase() {
  return apiInput.value.trim().replace(/\/$/, '');
}

async function api(path, options = {}) {
  const response = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function health() {
  if (!apiBase()) {
    status.textContent = 'API: configure URL';
    dbStatus.textContent = 'No backend URL configured';
    return;
  }
  try {
    const data = await api('/api/health');
    status.textContent = `API: ${data.status}`;
    dbStatus.textContent = `MySQL: ${data.database}`;
  } catch (error) {
    status.textContent = 'API: offline';
    dbStatus.textContent = error.message;
  }
}

async function loadColonies() {
  colonies.textContent = 'Loading…';
  try {
    const data = await api('/api/colonies');
    if (!data.length) {
      colonies.textContent = 'No colonies found.';
      return;
    }
    colonies.innerHTML = `<table><thead><tr><th>ID</th><th>Name</th><th>Owner</th><th>Universe</th><th>Metal</th><th>Crystal</th></tr></thead><tbody>${data.map(c =>
      `<tr><td>${c.id}</td><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.owner)}</td><td>${c.universe_id}</td><td>${c.metal}</td><td>${c.crystal}</td></tr>`
    ).join('')}</tbody></table>`;
  } catch (error) {
    colonies.textContent = `Request failed: ${error.message}`;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
}

document.querySelector('#saveApi').addEventListener('click', () => {
  localStorage.setItem('stellarApiUrl', apiBase());
  health();
});
document.querySelector('#refresh').addEventListener('click', health);
document.querySelector('#loadColonies').addEventListener('click', loadColonies);
health();
