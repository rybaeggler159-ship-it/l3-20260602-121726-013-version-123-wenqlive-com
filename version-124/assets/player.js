(function () {
  const video = document.querySelector('[data-m3u8]');
  const layer = document.querySelector('[data-video-layer]');
  const playButton = document.querySelector('[data-video-play]');

  if (!video) {
    return;
  }

  let ready = false;
  let hls = null;

  function bindStream() {
    if (ready) {
      return;
    }

    const streamUrl = video.getAttribute('data-m3u8');

    if (!streamUrl) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }

    ready = true;
  }

  function startPlay() {
    bindStream();
    const promise = video.play();

    if (promise && typeof promise.then === 'function') {
      promise.then(function () {
        if (layer) {
          layer.classList.add('hidden');
        }
      }).catch(function () {
        if (layer) {
          layer.classList.remove('hidden');
        }
      });
    } else if (layer) {
      layer.classList.add('hidden');
    }
  }

  function togglePlay() {
    if (video.paused) {
      startPlay();
    } else {
      video.pause();
    }
  }

  if (playButton) {
    playButton.addEventListener('click', startPlay);
  }

  video.addEventListener('click', togglePlay);
  video.addEventListener('play', function () {
    if (layer) {
      layer.classList.add('hidden');
    }
  });
  video.addEventListener('pause', function () {
    if (layer && video.currentTime === 0) {
      layer.classList.remove('hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
