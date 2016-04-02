var
  SETTINGS,
  ServerConfig;

SETTINGS = {
  'production' : {
    'SERVDIR'     : 'minified',
    'PORT'        : 3000,
    'REDIS'       : {
      'DATABASE' : 3
    }
  },

  'staging' : {
    'SERVDIR'     : 'minified',
    'PORT'        : 3000,
    'REDIS'       : {
      'DATABASE' : 2
    }
  },

  'test' : {
    'SERVDIR'     : 'compiled',
    'PORT'        : 40100,
    'REDIS'       : {
      'DATABASE' : 1
    }
  },

  'development' : {
    'SERVDIR'     : 'compiled',
    'PORT'        : 3000,
    'REDIS'       : {
      'DATABASE' : 0
    }
  }
};

ServerConfig = function ServerConfig(nodeEnv) {
  var
    settings,

    getSettings = function getSettings() {
      return settings;
    },

    init = function init() {
      settings = SETTINGS[nodeEnv];

      if (!settings) {
        throw new Error('not a settings');
      }
    };

  this.getSettings = getSettings;

  init();
};

module.exports = ServerConfig;
