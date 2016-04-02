var
  AppServerBootstrap;

AppServerBootstrap = function AppServerBootstrap() {
  var
    init = function init() {
      console.log(' # App server bootstrapping');
    };

  this.init = init;
};

module.exports = AppServerBootstrap;
