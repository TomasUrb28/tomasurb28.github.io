// ── KONFIGURACE — vyplň po vytvoření Supabase projektu ──────────
// Obě hodnoty najdeš v Supabase: Settings → API
const SUPABASE_URL = 'TVUJ_SUPABASE_URL';   // např. https://abcxyz.supabase.co
const SUPABASE_KEY = 'TVUJ_ANON_KEY';        // začíná "eyJ..."
// ────────────────────────────────────────────────────────────────

const DB = `${SUPABASE_URL}/rest/v1/sessions`;
const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

// Boot sequence
(function () {
  document.querySelectorAll('.boot-text p').forEach((el, i) => {
    el.style.visibility = 'hidden';
    setTimeout(() => { el.style.visibility = 'visible'; }, i * 400);
  });
})();

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
    const res = await fetch(`${DB}?order=created_at.asc`, { headers: HEADERS });
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
