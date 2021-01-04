/*!
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

// Cache references to DOM elements.
var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
elms.forEach(function(elm) {
  window[elm] = document.getElementById(elm);
});

/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */
var Player = function(playlist) {
  this.playlist = playlist;
  this.index = 0;

  // Display the title of the first track.
  track.innerHTML = '1. ' + playlist[0].title;

  // Setup the playlist display.
  playlist.forEach(function(song) {
    var div = document.createElement('div');
    div.className = 'list-song';
    div.innerHTML = song.title;
    div.onclick = function() {
      player.skipTo(playlist.indexOf(song));
    };
    list.appendChild(div);
  });
};
Player.prototype = {
  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play: function(index) {
    var self = this;
    var sound;

    index = typeof index === 'number' ? index : self.index;
    var data = self.playlist[index];

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        // src: ['./audio/' + data.file + '.webm', './audio/' + data.file + '.mp3'],
        src: [data.file],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay: function() {
          // Display the duration.
          duration.innerHTML = self.formatTime(Math.round(sound.duration()));

          // Start upating the progress of the track.
          requestAnimationFrame(self.step.bind(self));

          // Start the wave animation if we have already loaded
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          pauseBtn.style.display = 'block';
        },
        onload: function() {
          // Start the wave animation.
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          loading.style.display = 'none';
        },
        onend: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
          self.skip('next');
        },
        onpause: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        },
        onstop: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        },
        onseek: function() {
          // Start upating the progress of the track.
          requestAnimationFrame(self.step.bind(self));
        }
      });
    }

    // Begin playing the sound.
    sound.play();

    // Update the track display.
    track.innerHTML = (index + 1) + '. ' + data.title;

    // Show the pause button.
    if (sound.state() === 'loaded') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
    } else {
      loading.style.display = 'block';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
    }

    // Keep track of the index we are currently playing.
    self.index = index;
  },

  /**
   * Pause the currently playing track.
   */
  pause: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Puase the sound.
    sound.pause();

    // Show the play button.
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
  },

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function(direction) {
    var self = this;

    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === 'prev') {
      index = self.index - 1;
      if (index < 0) {
        index = self.playlist.length - 1;
      }
    } else {
      index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }
    }

    self.skipTo(index);
  },

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo: function(index) {
    var self = this;

    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop();
    }

    // Reset progress.
    progress.style.width = '0%';

    // Play the new track.
    self.play(index);
  },

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume: function(val) {
    var self = this;

    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  },

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function(per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function() {
    var self = this;
    var display = (playlist.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      playlist.style.display = display;
    }, (display === 'block') ? 0 : 500);
    playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume: function() {
    var self = this;
    var display = (volume.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      volume.style.display = display;
    }, (display === 'block') ? 0 : 500);
    volume.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
};

// Setup our new audio player class and pass it the playlist.
var player = new Player([
  {
    title: '发刊词：为什么学了这么多知识，却依然过不好这一生？',
    file: 'http://img.qdi5.com/1%E3%80%81%E5%8F%91%E5%88%8A%E8%AF%8D%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E5%AD%A6%E4%BA%86%E8%BF%99%E4%B9%88%E5%A4%9A%E7%9F%A5%E8%AF%86%EF%BC%8C%E5%8D%B4%E4%BE%9D%E7%84%B6%E8%BF%87%E4%B8%8D%E5%A5%BD%E8%BF%99%E4%B8%80%E7%94%9F%EF%BC%9F.mp3',
    howl: null
  },
  {
    title: '认知升级：学会自主学习，打造二维曲线竞争力实现个人成长破局',
    file: 'http://img.qdi5.com/2%E3%80%81%E8%AE%A4%E7%9F%A5%E5%8D%87%E7%BA%A7%EF%BC%9A%E5%AD%A6%E4%BC%9A%E8%87%AA%E4%B8%BB%E5%AD%A6%E4%B9%A0%EF%BC%8C%E6%89%93%E9%80%A0%E4%BA%8C%E7%BB%B4%E6%9B%B2%E7%BA%BF%E7%AB%9E%E4%BA%89%E5%8A%9B%E5%AE%9E%E7%8E%B0%E4%B8%AA%E4%BA%BA%E6%88%90%E9%95%BF%E7%A0%B4%E5%B1%80.mp3',
    howl: null
  },
  {
    title: '高手模型：掌握学习五环法，让你的时间更有价值',
    file: 'http://img.qdi5.com/3%E3%80%81%E9%AB%98%E6%89%8B%E6%A8%A1%E5%9E%8B%EF%BC%9A%E6%8E%8C%E6%8F%A1%E5%AD%A6%E4%B9%A0%E4%BA%94%E7%8E%AF%E6%B3%95%EF%BC%8C%E8%AE%A9%E4%BD%A0%E7%9A%84%E6%97%B6%E9%97%B4%E6%9B%B4%E6%9C%89%E4%BB%B7%E5%80%BC.mp3',
    howl: null
  },
  {
    title: '高效学习：三大法则提升学习力，让你学得会记得住用得上',
    file: 'http://img.qdi5.com/4%E3%80%81%E9%AB%98%E6%95%88%E5%AD%A6%E4%B9%A0%EF%BC%9A%E4%B8%89%E5%A4%A7%E6%B3%95%E5%88%99%E6%8F%90%E5%8D%87%E5%AD%A6%E4%B9%A0%E5%8A%9B%EF%BC%8C%E8%AE%A9%E4%BD%A0%E5%AD%A6%E5%BE%97%E4%BC%9A%E8%AE%B0%E5%BE%97%E4%BD%8F%E7%94%A8%E5%BE%97%E4%B8%8A.mp3',
    howl: null
  },
  {
    title: '知识宫殿：如何将知识点连接成知识系统，搭建属于你的“移动图书馆”',
    file: 'http://img.qdi5.com/5%E3%80%81%E7%9F%A5%E8%AF%86%E5%AE%AB%E6%AE%BF%EF%BC%9A%E5%A6%82%E4%BD%95%E5%B0%86%E7%9F%A5%E8%AF%86%E7%82%B9%E8%BF%9E%E6%8E%A5%E6%88%90%E7%9F%A5%E8%AF%86%E7%B3%BB%E7%BB%9F%EF%BC%8C%E6%90%AD%E5%BB%BA%E5%B1%9E%E4%BA%8E%E4%BD%A0%E7%9A%84%E2%80%9C%E7%A7%BB%E5%8A%A8%E5%9B%BE%E4%B9%A6%E9%A6%86%E2%80%9D.mp3',
    howl: null
  },
  {
    title: '跨界思维：教你快速get一门新技能，成为斜杠青年',
    file: 'http://img.qdi5.com/6%E3%80%81%E8%B7%A8%E7%95%8C%E6%80%9D%E7%BB%B4%EF%BC%9A%E6%95%99%E4%BD%A0%E5%BF%AB%E9%80%9Fget%E4%B8%80%E9%97%A8%E6%96%B0%E6%8A%80%E8%83%BD%EF%BC%8C%E6%88%90%E4%B8%BA%E6%96%9C%E6%9D%A0%E9%9D%92%E5%B9%B4.mp3',
    howl: null
  },
  {
    title: '知识变现：找到你的商业模式，将知识变为生产力',
    file: 'http://img.qdi5.com/7%E3%80%81%E7%9F%A5%E8%AF%86%E5%8F%98%E7%8E%B0%EF%BC%9A%E6%89%BE%E5%88%B0%E4%BD%A0%E7%9A%84%E5%95%86%E4%B8%9A%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%B0%86%E7%9F%A5%E8%AF%86%E5%8F%98%E4%B8%BA%E7%94%9F%E4%BA%A7%E5%8A%9B.mp3',
    howl: null
  }
]);

// Bind our player controls.
playBtn.addEventListener('click', function() {
  player.play();
});
pauseBtn.addEventListener('click', function() {
  player.pause();
});
prevBtn.addEventListener('click', function() {
  player.skip('prev');
});
nextBtn.addEventListener('click', function() {
  player.skip('next');
});
waveform.addEventListener('click', function(event) {
  player.seek(event.clientX / window.innerWidth);
});
playlistBtn.addEventListener('click', function() {
  player.togglePlaylist();
});
playlist.addEventListener('click', function() {
  player.togglePlaylist();
});
volumeBtn.addEventListener('click', function() {
  player.toggleVolume();
});
volume.addEventListener('click', function() {
  player.toggleVolume();
});

// Setup the event listeners to enable dragging of volume slider.
barEmpty.addEventListener('click', function(event) {
  var per = event.layerX / parseFloat(barEmpty.scrollWidth);
  player.volume(per);
});
sliderBtn.addEventListener('mousedown', function() {
  window.sliderDown = true;
});
sliderBtn.addEventListener('touchstart', function() {
  window.sliderDown = true;
});
volume.addEventListener('mouseup', function() {
  window.sliderDown = false;
});
volume.addEventListener('touchend', function() {
  window.sliderDown = false;
});

var move = function(event) {
  if (window.sliderDown) {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
    player.volume(per);
  }
};

volume.addEventListener('mousemove', move);
volume.addEventListener('touchmove', move);

// Setup the "waveform" animation.
var wave = new SiriWave({
  container: waveform,
  width: window.innerWidth,
  height: window.innerHeight * 0.3,
  cover: true,
  speed: 0.03,
  amplitude: 0.7,
  frequency: 2
});
wave.start();

// Update the height of the wave animation.
// These are basically some hacks to get SiriWave.js to do what we want.
var resize = function() {
  var height = window.innerHeight * 0.3;
  var width = window.innerWidth;
  wave.height = height;
  wave.height_2 = height / 2;
  wave.MAX = wave.height_2 - 4;
  wave.width = width;
  wave.width_2 = width / 2;
  wave.width_4 = width / 4;
  wave.canvas.height = height;
  wave.canvas.width = width;
  wave.container.style.margin = -(height / 2) + 'px auto';

  // Update the position of the slider.
  var sound = player.playlist[player.index].howl;
  if (sound) {
    var vol = sound.volume();
    var barWidth = (vol * 0.9);
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  }
};
window.addEventListener('resize', resize);
resize();
