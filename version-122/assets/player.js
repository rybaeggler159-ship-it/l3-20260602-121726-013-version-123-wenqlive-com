(function() {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function(shell) {
      var video = shell.querySelector('video');
      var overlay = shell.querySelector('.player-overlay');
      var stream = shell.getAttribute('data-stream');
      var prepared = false;
      var hls = null;

      function prepare() {
        if (!video || !stream || prepared) {
          return;
        }

        prepared = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function start() {
        prepare();
        shell.classList.add('is-playing');
        video.setAttribute('controls', 'controls');
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function() {});
        }
      }

      if (overlay) {
        overlay.addEventListener('click', start);
      }

      if (video) {
        video.addEventListener('click', function() {
          if (video.paused) {
            start();
          }
        });

        video.addEventListener('play', function() {
          shell.classList.add('is-playing');
        });
      }

      window.addEventListener('pagehide', function() {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  });
})();
