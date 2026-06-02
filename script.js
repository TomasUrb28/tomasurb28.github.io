// Typewriter boot sequence — runs once on load
(function () {
  const lines = document.querySelectorAll('.boot-text p');
  lines.forEach((el, i) => {
    el.style.visibility = 'hidden';
    setTimeout(() => { el.style.visibility = 'visible'; }, i * 400);
  });
})();
