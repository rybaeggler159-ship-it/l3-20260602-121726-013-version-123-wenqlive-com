document.addEventListener("DOMContentLoaded", function() {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");
  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function() {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function(slide, current) {
      slide.classList.toggle("is-active", current === activeIndex);
    });
    dots.forEach(function(dot, current) {
      dot.classList.toggle("is-active", current === activeIndex);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function() {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-row"));

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function searchableText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-tags"),
      card.getAttribute("data-year"),
      card.getAttribute("data-region"),
      card.getAttribute("data-genre"),
      card.textContent
    ].join(" "));
  }

  function applySearch(value) {
    var key = normalize(value);
    cards.forEach(function(card) {
      var matched = !key || searchableText(card).indexOf(key) !== -1;
      card.classList.toggle("is-filtered-out", !matched);
    });
  }

  searchInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      applySearch(input.value);
    });
  });

  var params = new URLSearchParams(window.location.search);
  var query = params.get("q");
  if (query && searchInputs.length) {
    searchInputs[0].value = query;
    applySearch(query);
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]")).forEach(function(button) {
    button.addEventListener("click", function() {
      var value = button.getAttribute("data-filter-value") || "";
      searchInputs.forEach(function(input) {
        input.value = value;
      });
      applySearch(value);
    });
  });
});
