var
  EffectsControllerFactoryConstructor;

EffectsControllerFactoryConstructor = function EffectsControllerFactoryConstructor(app) {
  app.controller('effectController', ['$rootScope', '$scope', '$window', '$timeout', 'paper', 'settingService', function EffectsControllerFactory($rootScope, $scope, $window, $timeout, paper, settingService) {
    var
      barTypes  = {},
      canvas    = document.getElementById('paper-canvas'),
      viewSize  = new paper.Size(settingService.get('paperWidth'), settingService.get('paperHeight')),
      COLOR_MIN = settingService.get('colorMin'),
      COLOR_MAX = settingService.get('colorMax'),
      COLOR_DIF = COLOR_MAX - COLOR_MIN,

      defineBarType = function defineBarType(type, fillColor, strokeColor) {
        var
          barType = {
            'cache'       : {},
            'fillColor'   : fillColor,
            'strokeColor' : strokeColor || fillColor
          };

        barTypes[type] = barType;
      },

      setPaperSize = function setPaperSize() {
        paper.view.viewSize = viewSize;
      },

      getBarWidth = function getBarWidth() {
        var
          maxBarCount = settingService.get('arrayLength');

        return Math.floor(viewSize.width / maxBarCount);
      },

      getPositionByIndex = function getPositionByIndex(index) {
        var
          barWidth = getBarWidth();

        return barWidth * index + barWidth / 2;
      },

      getHeightRatio = function getHeightRatio(value) {
        return value ? value / settingService.get('maxValue') : 1;
      },

      getHeight = function getHeight(ratio) {
        return Math.floor(ratio * viewSize.height);
      },

      getFillColor = function getFillColor(ratio) {
        var
          effect = COLOR_DIF * ratio + COLOR_MIN;

        return new paper.Color(COLOR_MIN, effect, COLOR_MAX);
      },

      createBar = function createBar(height, fillColor, strokeColor) {
        var
          begPoint  = new paper.Point(-getBarWidth(),  viewSize.height - height),
          endPoint  = new paper.Point(             0,  viewSize.height),
          rect      = new paper.Rectangle(begPoint, endPoint),
          path      = new paper.Path.Rectangle(rect);

        path.fillColor    = fillColor;
        path.strokeColor  = strokeColor;

        return path;
      },

      getBars = function getBars(type, value) {
        var
          barType     = barTypes[type],
          barCache    = barType.cache,
          heightRatio = getHeightRatio(value),
          height      = getHeight(heightRatio),
          bars        = barCache[height];

        if (!bars) {
          bars = barCache[height] = [
            createBar(height, barType.fillColor, barType.strokeColor),
            createBar(height, getFillColor(heightRatio), barType.strokeColor)
          ];
        }

        return bars;
      },

      drawBar = function drawBar(type, index, value, colorized) {
        var
          position  = getPositionByIndex(index),
          bars      = getBars(type, value, colorized),
          drawedBar = bars[colorized ? 1 : 0],
          hiddenBar = bars[colorized ? 0 : 1];

        drawedBar.position.x = position;
        hiddenBar.position.x = -getBarWidth();
      },

      redraw = function redraw() {
        paper.view.draw();
      },

      onValues = function onValues($event, values) {
        var
          i,
          valueObj;

        for (i = 0; i < values.length; i++) {
          valueObj = values[i];
          drawBar('value', valueObj.index, valueObj.value);
        }

        redraw();
      },

      onValueAdded = function onValueAdded($event, index, value, colorized) {
        drawBar('value', index, value, colorized);
        redraw();
      },

      onIndexMarked = function onIndexMarked($event, index, markerType) {
        drawBar(markerType, index);
        redraw();
      },

      init = function init() {
        defineBarType('value',      '#ccc', '#222');
        defineBarType('pivot',      new paper.Color(0.8, 0.2, 0.4, 0.4));
        defineBarType('swapBig',    new paper.Color(0.5, 0.2, 0.7, 0.2));
        defineBarType('swapSmall',  new paper.Color(0.3, 0.2, 0.7, 0.2));

        paper.setup(canvas);

        setPaperSize();

        $scope.$on('update',        redraw);
        $scope.$on('valueAdded',    onValueAdded);
        $scope.$on('indexMarked',   onIndexMarked);

        $rootScope.$broadcast('effectsReady');
      };

    init();
  }]);
};

module.exports = EffectsControllerFactoryConstructor;
