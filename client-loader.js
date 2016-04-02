var
  Client      = require('./src/js/client'),
  html        = document.getElementsByTagName('html')[0],
  loadCounter = 0,
  libs        = {},
  libDefs     = {},

  /**
   * Grunt task ngtemplates precompiles all the angular templates,
   * and defines the windowfunction .angularTemplates which loader.js
   * cascades for this file. This is how templates can be included
   * in the fastest way through compile time.
   */
  createAngularTemplates = function createAngularTemplates(angularApp) {
    libs.angularTemplates(angularApp);
  },

  defineLibForAngular = function defineLibForAngular(angularApp, libName, lib) {
    angularApp.factory(libName, [function () {
      return lib;
    }]);
  },

  defineLibsForAngular = function defineLibsForAngular(angularApp) {
    var
      libName;

    for (libName in libs) {
      defineLibForAngular(angularApp, libName, libs[libName]);
    }
  },

  instantiateAngularComponents = function instantiateAngularComponents(angularApp, components) {
    var
      i;

    for (i = 0; i < components.length; i++) {
      components[i](angularApp);
    }
  },

  loadLibs = function loadLibs() {
    var
      lib,
      libDef,
      libName;

    for (libName in libDefs) {
      libDef = libDefs[libName];
      lib    = libDef.object || window[libDef.name];

      if (lib) {
        libDef.loaded = true;
        libs[libName] = lib;
      } else {
        libDef.loaded = false;
        return false;
      }
    }

    return true;
  },

  defineLib = function defineLib(lib) {
    var
      object  = lib.object,
      name    = lib.name || lib,
      libDef  = { 'name' : name };

    if (object) {
      libDef.object = object;
    }

    libDefs[name] = libDef;
  },

  defineLibs = function defineLibs(libs) {
    var
      i;

    for (i = 0; i < libs.length; i++) {
      defineLib(libs[i]);
    }
  },

  init = function init() {
    var
      client = new Client();

    defineLibs(client.libs);

    // Ensure libs are truly loaded.
    if (!loadLibs()) {
      loadCounter++;

      if (loadCounter > 10) {
        console.error('Can not load libs', JSON.stringify(libDefs, 0, 2));
        throw new Error('LIB_NOT_AVAILABLE');
      }

      setTimeout(init, 50);

      return;
    }

    var
      angularApp = libs.angular.module('app', client.modules);

    defineLibsForAngular(angularApp);
    instantiateAngularComponents(angularApp, client.components);
    createAngularTemplates(angularApp);

    if (client.beforeBootstrap) {
      client.beforeBootstrap(angularApp);
    }

    // Bootstrap the app, after this, there is no option for app modification.
    libs.angular.bootstrap(html, ['app']);
  };

window.onload = init;
