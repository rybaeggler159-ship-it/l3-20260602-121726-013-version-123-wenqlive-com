(function () {
  window.initPlayer = function (videoId, coverId, stream) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var shell = video ? video.closest('.player-shell') : null;
    var ready = false;
    var hls = null;

    function prepare() {
      if (!video || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        ready = true;
        return;
      }

      video.src = stream;
      ready = true;
    }

    function play() {
      prepare();
      if (shell) {
        shell.classList.add('playing');
      }
      if (video) {
        video.controls = true;
        var action = video.play();
        if (action && typeof action.catch === 'function') {
          action.catch(function () {});
        }
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (shell) {
          shell.classList.add('playing');
        }
      });
      video.addEventListener('ended', function () {
        if (shell) {
          shell.classList.remove('playing');
        }
      });
    }
  };
})();
