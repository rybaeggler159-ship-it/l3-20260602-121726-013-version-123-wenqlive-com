(function () {
  var body = document.body;
  var menuButton = document.querySelector('.menu-toggle');

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.slider-dots button'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var searchInput = document.querySelector('[data-search-input]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var emptyState = document.querySelector('[data-empty-state]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

  if (searchInput && query) {
    searchInput.value = query;
  }

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }
    var q = normalize(searchInput ? searchInput.value : query);
    var region = regionFilter ? regionFilter.value : '';
    var year = yearFilter ? yearFilter.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-year') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags'));
      var ok = true;

      if (q && haystack.indexOf(q) === -1) {
        ok = false;
      }
      if (region && card.getAttribute('data-region') !== region) {
        ok = false;
      }
      if (year && card.getAttribute('data-year') !== year) {
        ok = false;
      }

      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : 'block';
    }
  }

  [searchInput, regionFilter, yearFilter].forEach(function (node) {
    if (node) {
      node.addEventListener('input', filterCards);
      node.addEventListener('change', filterCards);
    }
  });

  filterCards();
})();
