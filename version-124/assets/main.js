(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  const slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-dot'));
    const next = slider.querySelector('[data-hero-next]');
    const prev = slider.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    show(0);
    start();
  }

  const searchInput = document.querySelector('[data-search-input]');
  const cards = Array.from(document.querySelectorAll('[data-title]'));
  const yearButtons = Array.from(document.querySelectorAll('[data-year]'));
  let activeYear = 'all';

  function applyFilters() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';

    cards.forEach(function (card) {
      const content = [
        card.dataset.title || '',
        card.dataset.region || '',
        card.dataset.genre || '',
        card.dataset.tags || '',
        card.dataset.year || ''
      ].join(' ').toLowerCase();

      const matchesKeyword = !keyword || content.indexOf(keyword) !== -1;
      const matchesYear = activeYear === 'all' || card.dataset.year === activeYear;
      card.classList.toggle('hide-card', !(matchesKeyword && matchesYear));
    });
  }

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', applyFilters);
  }

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeYear = button.dataset.year || 'all';
      yearButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      applyFilters();
    });
  });
})();
