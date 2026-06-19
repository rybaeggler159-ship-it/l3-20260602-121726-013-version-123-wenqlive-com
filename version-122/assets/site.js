(function() {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function() {
        mobileNav.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var dotsWrap = hero.querySelector('[data-hero-dots]');
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });

        if (dotsWrap) {
          Array.prototype.slice.call(dotsWrap.children).forEach(function(dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
          });
        }
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }

        timer = window.setInterval(function() {
          show(current + 1);
        }, 5200);
      }

      if (dotsWrap) {
        slides.forEach(function(_, index) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'hero-dot';
          dot.setAttribute('aria-label', '切换推荐影片');
          dot.addEventListener('click', function() {
            show(index);
            restart();
          });
          dotsWrap.appendChild(dot);
        });
      }

      if (prev) {
        prev.addEventListener('click', function() {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener('click', function() {
          show(current + 1);
          restart();
        });
      }

      show(0);
      restart();
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll('.site-search'));

    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        var query = input.value.trim().toLowerCase();
        var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
        var visible = 0;

        cards.forEach(function(card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-year'),
            card.textContent
          ].join(' ').toLowerCase();
          var matched = !query || haystack.indexOf(query) !== -1;
          card.classList.toggle('is-hidden-by-search', !matched);

          if (matched) {
            visible += 1;
          }
        });

        Array.prototype.slice.call(document.querySelectorAll('[data-empty-state]')).forEach(function(state) {
          state.classList.toggle('is-visible', visible === 0);
        });
      });
    });
  });
})();
