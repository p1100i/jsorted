var
  AboutControllerFactoryConstructor;

AboutControllerFactoryConstructor = function AboutControllerFactoryConstructor(app) {
  app.controller('aboutController', ['$rootScope', '$scope', '$timeout', '$window', '$q', 'angular', 'Zound', 'quicksort', 'bubblesort', 'mergesort', 'heapsort', 'arrayService', 'settingService', function AboutControllerFactory($rootScope, $scope, $timeout, $window, $q, angular, Zound, quicksort, bubblesort, mergesort, heapsort, arrayService, settingService) {
    var
      running,
      sorting,
      lastTimeMultiplier,

      view = {
        'counts' : arrayService.getCounts()
      },

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

      multiplyTimeStep = function multiplyTimeStep(timeMultiplier) {
        if (timeMultiplier === undefined) {
          return;
        }

        var
          timeUnit = settingService.get('timeUnit');

        if (timeMultiplier !== 0) {
          timeMultiplier = Math.min(timeMultiplier, 20);
          timeMultiplier = Math.max(timeMultiplier, 0.2);
        }

        settingService.set('timeMultiplier',  timeMultiplier);
        settingService.set('timeStep',        timeMultiplier * timeUnit);
      },

      setRunning = function setRunning(value) {
        $scope.running = running = value;

        if (running) {
          multiplyTimeStep(lastTimeMultiplier);
          lastTimeMultiplier = undefined;
        } else {
          lastTimeMultiplier = settingService.get('timeMultiplier');
          multiplyTimeStep(0);
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

      stepIterate = function stepIterate() {
        setRunning(true);
        iterate();
        setRunning(false);
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

      changeTimeMultiplier = function changeTimeMultiplier(multiplier) {
        if (!running) {
          setRunning(true);
        }

        var
          timeMultiplier = settingService.get('timeMultiplier');

        timeMultiplier *= multiplier;

        multiplyTimeStep(timeMultiplier);
      },

      setViewSpeed = function setViewSpeed() {
        var
          timeMultiplier  = settingService.get('timeMultiplier'),
          speedMultiplier = timeMultiplier === 0 ? 0 : 1 / timeMultiplier;

        view.speedMultiplier = speedMultiplier.toFixed(2);
      },

      onSettingChanged = function onSettingChanged() {
        setViewSpeed();
      },

      init = function init() {
        $scope.$on('update',            iterate);
        $scope.$on('selectedSorterSet', onSelectedSorterSet);
        $scope.$on('settingChanged',    onSettingChanged);
        $scope.$on('effectsReady',      onEffectsReady);

        $scope.view                 = view;
        $scope.populate             = populate;
        $scope.stepIterate          = stepIterate;
        $scope.toggleRunning        = toggleRunning;
        $scope.changeTimeMultiplier = changeTimeMultiplier;

        arrayService.addSorter('heapSort',    'Heapsort',     heapsort);
        arrayService.addSorter('quickSort',   'Quicksort',    quicksort);
        arrayService.addSorter('mergeSort',   'Merge sort',   mergesort);
        arrayService.addSorter('bubbleSort',  'Bubble sort',  bubblesort);

        settingService.play();
        setViewSpeed();

        changeTimeMultiplier(0.1);
      };

    init();
  }]);
};

module.exports = AboutControllerFactoryConstructor;
