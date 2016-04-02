var
  AboutControllerFactoryConstructor;

AboutControllerFactoryConstructor = function AboutControllerFactoryConstructor(app) {
  app.controller('aboutController', ['$rootScope', '$scope', '$timeout', '$window', '$q', 'angular', 'Zound', 'quicksort', 'bubblesort', 'arrayService', 'settingService', function AboutControllerFactory($rootScope, $scope, $timeout, $window, $q, angular, Zound, quicksort, bubblesort, arrayService, settingService) {
    var
      running,
      sorting,

      counts = arrayService.getCounts(),

      populate = function populate() {
        sorting = false;
        arrayService.unsetDeferred();
        arrayService.clear();
        arrayService.fill();
        arrayService.hideMarkers();
      },

      finishSorter = function finishSorter(i, reverse) {
        if (i === undefined) {
          i = 0;
          arrayService.hideMarkers();
        }

        if (reverse && i === -1) {
          arrayService.selectNextSorter();
          return;
        }

        if (i === arrayService.getArrayLength()) {
          i--;
          reverse = true;
        }

        arrayService.mark(i, 'pivot', true).then(function (item) {
          finishSorter(reverse ? i - 1 : i + 1, reverse);
        });
      },

      setRunning = function setRunning(value) {
        $scope.running = running = value;

        if (!running) {
          settingService.play();
        }
      },

      toggleRunning = function toggleRunning() {
        setRunning(!running);
      },

      iterate = function iterate() {
        var
          sorter;

        if (!running) {
          return;
        }

        if (!arrayService.getArrayLength()) {
          return;
        }

        if (!sorting) {
          sorter = arrayService.getSelectedSorter();

          if (sorter) {
            sorting = true;
            sorter.fn(arrayService.getArrayId(), 0).then(finishSorter);
          }
        }

        arrayService.resolveDeferred();
        settingService.play();
      },

      restart = function restart() {
        populate();
        setRunning(true);
      },

      onSelectedSorterSet = function onSelectedSorterSet($event) {
        restart();
      },

      onEffectsReady = function onEffectsReady($event) {
        arrayService.selectNextSorter();
      },

      toggleSound = function toggleSound() {
        settingService.toggleSound();
      },

      init = function init() {
        $scope.$on('update',            iterate);
        $scope.$on('selectedSorterSet', onSelectedSorterSet);
        $scope.$on('effectsReady',      onEffectsReady);

        $scope.counts         = counts;
        $scope.populate       = populate;
        $scope.toggleRunning  = toggleRunning;
        $scope.toggleSound    = toggleSound;

        arrayService.addSorter('quickSort',   'Quicksort',    quicksort);
        arrayService.addSorter('bubbleSort',  'Bubble sort',  bubblesort);

        settingService.play();
      };

    init();
  }]);
};

module.exports = AboutControllerFactoryConstructor;
