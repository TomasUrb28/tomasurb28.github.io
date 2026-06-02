// Boot sequence
(function () {
  document.querySelectorAll('.boot-text p').forEach((el, i) => {
    el.style.visibility = 'hidden';
    setTimeout(() => { el.style.visibility = 'visible'; }, i * 400);
  });
})();
