/*
  Inspired by the progress bar on Pandora.
  They seem to achieve it by stretching an inline image as time passes.
  I've done it in a similar manner with some raw DOM manipulation.

  Set up in a modular way - fork away!
  Ticker takes a params object with the following avaliable settings:

  Optional:
  `start` - Number - % to begin the progress at
              default: 0
  `max` - Number - % to end the progress at (Probably keep this <= 100)
              default: 100
  `tick` - Number - Number in milliseconds between ticks
              default: 1000
  `callback` - Function - Optional function to call upon completion of the ticker
              default: none

  Required:
  `time` - Number - Total number of seconds for the ticker to elapse
  `element` - String - Selector for the element you want to act as
    		                    the progress bar

  Should work on IE8+ (querySelector has IE8 support with CSS 2.1 selectors)

  Ultimately just animates the width of an object from x% to y%
    But it ticks! Ooo!
*/

;(function (window, document, undefined) {
  // Ticker Object
  function Ticker(params) {
    if (typeof params !== 'object') {
      throw 'Missing or incorrect parameter object';
      return false;
    }

    // Slide Element
    this.element = document.querySelector(params.element);
    this.totalTime = params.time;

    if (this.element === null) {
      throw 'Specified element does not exist'
      return false;
    }

    this.interval = null;
    this.callback = params.callback;
    this.paused = null;

    // Timing block
    this.value = params.start || 0;
    this.max = params.max || 100;
    this.tickTime = params.tick || 1000;

    this.run();
  };

  Ticker.prototype.tick = function () {
    this.value = this.value + (this.max / this.totalTime);
    this.element.style.width = this.value  + '%';
    if (this.value >= this.max) {
      // End Interval
      window.clearInterval(this.interval);
      if (typeof this.callback === 'function') {
        this.callback();
      }
    }
  }

  Ticker.prototype.pause = function () {
    this.paused = true;
    window.clearInterval(this.interval);
  }

  Ticker.prototype.play = function () {
    var that = this;

    this.paused = false;
    this.interval = window.setInterval(function() {
      that.tick();
    }, this.tickTime)
  };

  Ticker.prototype.run = function () {
    this.element.style.width = this.value  + '%';
    this.play();
  }

  // Set global namespace to existing entity or a new constructor
  window.Ticker = window.Ticker || Ticker;

  return Ticker;

}(window, document));

var xyxx = new Ticker({
  element: '.slide1',
  time: 298
});

new Ticker({
  element: '.slide2',
  time: 140
});

new Ticker({
  element: '.slide3',
  start: 50,
  time: 526
});

new Ticker({
  element: '.slide4',
  time: 24
});

new Ticker({
  element: '.slide5',
  time: 374
});

new Ticker({
  element: '.slide6',
  time: 500,
  tick: 1000 / 60
});

// Fluff

var btn1 = document.querySelector('.btn1');

btn1.addEventListener('click', function (e) {
  e.preventDefault();
  if (xyxx.paused) {
    this.innerHTML = 'Pause';
    xyxx.play();
  } else {
    this.innerHTML = 'Play';
    xyxx.pause();
  }
});
