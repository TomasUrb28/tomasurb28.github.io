// Boot sequence
(function () {
  document.querySelectorAll('.boot-text p').forEach((el, i) => {
    el.style.visibility = 'hidden';
    setTimeout(() => { el.style.visibility = 'visible'; }, i * 400);
  });
})();

const SESSIONS_URL = '/sessions.json';

function parseBody(text) {
  return text.split(/\n\n+/).map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^—.+—$/.test(block)) {
      return `<p><strong>${block}</strong></p>`;
    }
    return `<p>${block.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`;
  }).join('\n');
}

function statusClass(s) {
  return s === 'active' ? 'status-active' : s === 'pending' ? 'status-pending' : 'status-closed';
}

function statusLabel(s) {
  return s === 'active' ? 'STATUS: AKTIVNÍ' : s === 'pending' ? 'STATUS: ČEKÁ' : 'STATUS: UZAVŘENO';
}

function renderSession(s) {
  return `
  <article class="session" id="session-${s.id}">
    <div class="session-header">
      <span class="session-id">${s.title}</span>
      <span class="session-date">${s.subtitle}</span>
      <span class="session-status ${statusClass(s.status)}">${statusLabel(s.status)}</span>
    </div>
    <div class="session-body">
      <p class="session-location">&gt; LOKACE: ${s.location}</p>
      <p class="session-crew">&gt; POSÁDKA: ${s.crew}</p>
      <div class="session-divider">──────────────────────────────────────────────────────────</div>
      <div class="session-log">${parseBody(s.body)}</div>
      <div class="session-divider">──────────────────────────────────────────────────────────</div>
      <p class="session-footer">&gt; ZÁZNAM UZAVŘEN — OPERÁTOR: MU/TH/UR 6000</p>
    </div>
  </article>`;
}

async function loadSessions() {
  const container = document.getElementById('sessions');
  try {
    const res = await fetch(SESSIONS_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error(res.status);
    const sessions = await res.json();
    if (!sessions.length) {
      container.innerHTML = '<p class="loading-msg">&gt; DATABÁZE PRÁZDNÁ. ŽÁDNÉ ZÁZNAMY.</p>';
      return;
    }
    container.innerHTML = sessions.map(renderSession).join('');
  } catch (e) {
    container.innerHTML = `<p class="loading-msg">&gt; CHYBA NAČÍTÁNÍ DAT: ${e.message}</p>`;
  }
}

loadSessions();
