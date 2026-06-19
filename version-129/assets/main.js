(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileNav() {
    var toggle = document.querySelector(".mobile-toggle");
    if (!toggle) {
      return;
    }
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector(".hero");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
    }

    function move(step) {
      show(current + step);
    }

    function play() {
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      play();
    }

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        move(1);
        restart();
      });
    }
    if (slides.length > 1) {
      play();
    }
  }

  function createCard(item) {
    var tags = (item.tags || []).slice(0, 2).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return [
      "<a class=\"movie-card\" href=\"" + item.url + "\" title=\"" + escapeHtml(item.title) + "\">",
      "<div class=\"poster-wrap\">",
      "<img src=\"" + item.image + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\" onerror=\"this.style.opacity='0';\">",
      "<div class=\"poster-shade\"></div>",
      "<div class=\"poster-meta\"><span>" + escapeHtml(item.category) + "</span><span>评分 " + escapeHtml(String(item.rating)) + "</span></div>",
      "<div class=\"play-float\">▶</div>",
      "</div>",
      "<div class=\"card-body\"><h2>" + escapeHtml(item.title) + "</h2><p>" + escapeHtml(item.oneLine) + "</p><div class=\"card-tags\">" + tags + "</div></div>",
      "</a>"
    ].join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function setupSearchPage() {
    var form = document.querySelector("[data-search-form]");
    var results = document.querySelector("[data-search-results]");
    var note = document.querySelector("[data-search-note]");
    if (!form || !results || !window.SEARCH_ITEMS) {
      return;
    }

    var keyword = form.querySelector("[name='q']");
    var type = form.querySelector("[name='type']");
    var year = form.querySelector("[name='year']");
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      keyword.value = params.get("q");
    }

    function run() {
      var q = keyword.value.trim().toLowerCase();
      var selectedType = type.value;
      var selectedYear = year.value;
      var items = window.SEARCH_ITEMS.filter(function (item) {
        var text = [item.title, item.oneLine, item.genre, item.region, item.category, (item.tags || []).join(" ")].join(" ").toLowerCase();
        var keywordMatch = !q || text.indexOf(q) !== -1;
        var typeMatch = !selectedType || item.type === selectedType;
        var yearMatch = !selectedYear || item.year === selectedYear;
        return keywordMatch && typeMatch && yearMatch;
      }).slice(0, 96);

      if (note) {
        note.textContent = items.length ? "为你找到相关影片" : "没有找到相关影片";
      }
      results.innerHTML = items.map(createCard).join("");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      run();
    });
    form.addEventListener("change", run);
    if (keyword.value) {
      run();
    }
  }

  window.initMoviePlayer = function (streamUrl, videoId, coverId) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var loaded = false;
    var hlsInstance = null;

    if (!video) {
      return;
    }

    function start() {
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
        loaded = true;
      }
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (!loaded) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  ready(function () {
    setupMobileNav();
    setupHero();
    setupSearchPage();
  });
})();
