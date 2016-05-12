var
  SettingServiceFactoryConstructor;

SettingServiceFactoryConstructor = function SettingServiceFactoryConstructor(app) {
  app.factory('settingService', ['$rootScope', '$cookies', 'Zound', 'waveService', function ($rootScope, $cookies, Zound, waveService) {
    var
      zound,

      DEFAULTS = {
        'arrayLength'     : 30,
        'maxValue'        : 30,
        'paperWidth'      : 600,
        'paperHeight'     : 300,
        'timeStep'        : 60,
        'timeUnit'        : 60,
        'timeMultiplier'  : 1,
        'freqMin'         : 10,
        'freqMax'         : 18,
        'colorMin'        : 105 / 256,
        'colorMax'        : 220 / 256
      },

      data = {},

      get = function get(key) {
        var
          value = data[key];

        return value === undefined ? DEFAULTS[key] : value;
      },

      set = function set(key, value) {
        data[key] = value;

        $rootScope.$broadcast('settingChanged', key);
      },

      isMuted = function isMuted() {
        return zound.isMuted();
      },

      play = function play(freqScaler) {
        var
          i,
          freqMax    = get('freqMax'),
          freqMin    = get('freqMin'),
          freqDif    = freqMax - freqMin;

        if (freqScaler === undefined) {
          i = 0;
        } else if (freqScaler === 0) {
          zound.toggleMute();
        } else {
          zound.play(waveService.get('chill', freqScaler * freqDif + freqMin));
        }

        $rootScope.$broadcast('zound');
      },

      init = function init() {
        zound = new Zound({
          'mute' : true
        });
      };

    init();

    return {
      'isMuted'     : isMuted,
      'play'        : play,
      'get'         : get,
      'set'         : set
    };
  }]);
};

module.exports = SettingServiceFactoryConstructor;
