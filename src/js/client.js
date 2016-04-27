var
  Client;

Client = function Client(app) {
  var
    components = [
      require('./constant/route-config'),
      require('./factory/array-service'),
      require('./factory/setting-service'),
      require('./factory/wave-service'),
      require('./factory/bubblesort'),
      require('./factory/quicksort'),
      require('./factory/mergesort'),
      require('./controller/app-controller'),
      require('./controller/about-controller'),
      require('./controller/effect-controller')
    ],

    libs =  [
      'angular',
      'angularTemplates',
      'paper',
      {
        'name'    : 'Zound',
        'object'  : require('zound')
      },
      {
        'name'    : 'audio',
        'object'  : require('h-audio')
      }
    ],

    modules = [
      'ngRoute',
      'ngCookies'
    ],

    setCsrfTokenNames = function setCsrfTokenNames(angularApp) {
      angularApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
      }]);
    },

    loadAngularRoutes = function loadAngularRoutes(angularApp) {
      angularApp.config(['$routeProvider', 'routeConfig', function ($routeProvider, routeConfig) {
        var
          i,
          path,
          paths,
          controller,
          route,
          routes = routeConfig.routes;

        for (controller in routes) {
          route = routes[controller];
          paths = route.paths;

          for (i = 0; i < paths.length; i++) {
            path = paths[i];

            $routeProvider.when(path, {
              'controller'  : controller,
              'templateUrl' : route.templateUrl
            });
          }
        }

        $routeProvider.otherwise({
          redirectTo : '/'
        });
      }]);
    },

    beforeBootstrap = function beforeBootstrap(angularApp) {
      setCsrfTokenNames(angularApp);
      loadAngularRoutes(angularApp);
    };

  this.libs             = libs;
  this.components       = components;
  this.modules          = modules;
  this.beforeBootstrap  = beforeBootstrap;
};

module.exports = Client;
