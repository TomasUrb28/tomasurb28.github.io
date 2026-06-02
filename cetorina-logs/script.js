// Boot sequence
(function () {
  document.querySelectorAll('.boot-text p').forEach((el, i) => {
    el.style.visibility = 'hidden';
    setTimeout(() => { el.style.visibility = 'visible'; }, i * 400);
  });
})();

// ── VOICE SYNTH ────────────────────────────────────────────────
let activeBtn = null;

function toggleSpeak(btn) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  // pokud něco hraje — zastav
  if (synth.speaking) {
    synth.cancel();
    if (activeBtn) {
      activeBtn.textContent = '[ ▶ PŘEHRÁT ]';
      activeBtn.classList.remove('speaking');
    }
    if (activeBtn === btn) { activeBtn = null; return; }
  }

  // načti text ze session-log ve stejném article
  const article = btn.closest('article.session');
  const logEl   = article.querySelector('.session-log');
  const text    = logEl ? logEl.innerText.replace(/—/g, '').trim() : '';
  if (!text) return;

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang  = 'cs-CZ';
  utt.rate  = 0.88;
  utt.pitch = 0.6;   // nízký, robotický hlas

  // preferuj český hlas pokud existuje
  const voices = synth.getVoices();
  const czVoice = voices.find(v => v.lang.startsWith('cs'));
  if (czVoice) utt.voice = czVoice;

  utt.onstart = () => {
    btn.textContent = '[ ■ ZASTAVIT ]';
    btn.classList.add('speaking');
    activeBtn = btn;
  };
  utt.onend = utt.onerror = () => {
    btn.textContent = '[ ▶ PŘEHRÁT ]';
    btn.classList.remove('speaking');
    activeBtn = null;
  };

  // Chrome bug: getVoices() je prázdné při prvním volání, je nutné počkat
  if (voices.length === 0) {
    synth.addEventListener('voiceschanged', () => {
      const v = synth.getVoices().find(v => v.lang.startsWith('cs'));
      if (v) utt.voice = v;
      synth.speak(utt);
    }, { once: true });
  } else {
    synth.speak(utt);
  }
}
