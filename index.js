import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileJSON from 'ol/source/TileJSON';


/**
 * Renders a progress bar.
 * @param {HTMLElement} el The target element.
 * @constructor
 */
function Progress(el) {
  this.el = el;
  this.loading = 0;
  this.loaded = 0;
}


/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function () {
  if (this.loading === 0) {
    this.show();
  }
  ++this.loading;
  this.update();
};


/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function () {
  var this_ = this;
  setTimeout(function () {
    ++this_.loaded;
    this_.update();
  }, 100);
};


/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {
  var width = (this.loaded / this.loading * 100).toFixed(1) + '%';
  this.el.style.width = width;
  if (this.loading === this.loaded) {
    this.loading = 0;
    this.loaded = 0;
    var this_ = this;
    setTimeout(function () {
      this_.hide();
    }, 500);
  }
};


/**
 * Show the progress bar.
 */
Progress.prototype.show = function () {
  this.el.style.visibility = 'visible';
};


/**
 * Hide the progress bar.
 */
Progress.prototype.hide = function () {
  if (this.loading === this.loaded) {
    this.el.style.visibility = 'hidden';
    this.el.style.width = 0;
  }
};

var progress = new Progress(document.getElementById('progress'));

var key = 'pk.eyJ1IjoidHNjaGF1YiIsImEiOiJjaW5zYW5lNHkxMTNmdWttM3JyOHZtMmNtIn0.CDIBD8H-G2Gf-cPkIuWtRg';
var source = new TileJSON({
  url: 'https://api.tiles.mapbox.com/v4/mapbox.world-bright.json?secure&access_token=' + key,
  crossOrigin: 'anonymous'
});

source.on('tileloadstart', function () {
  progress.addLoading();
});

source.on('tileloadend', function () {
  progress.addLoaded();
});
source.on('tileloaderror', function () {
  progress.addLoaded();
});

var map = new Map({
  layers: [
    new TileLayer({ source: source })
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});