var
  WaveServiceFactoryConstructor;

WaveServiceFactoryConstructor = function WaveServiceFactoryConstructor(app) {
  app.factory('waveService', [function () {
    var
      x,
      maxX,
      add,

      waves = {},

      reinit = function reinit(t) {
        x     = 0;
        maxX  = 1;
        add   = 0.005;
      },

      chill = function chill(t, scale) {
        x += add;

        if (x > maxX) {
          add *= -1;
        }

        x = Math.max(0, x);

        return Math.sin(scale * t * Math.PI * 200) * x;
      },

      get = function get(waveName, scale) {
        reinit();

        return waves[waveName].bind(null, scale);
      },

      init = function init() {
        waves.chill = chill;
      };

    init();

    return {
      'get' : get
    };
  }]);
};

module.exports = WaveServiceFactoryConstructor;
