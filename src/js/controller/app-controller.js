var
  AppControllerFactoryConstructor;

AppControllerFactoryConstructor = function AppControllerFactoryConstructor(app) {
  app.controller('appController', ['$rootScope', '$scope', '$window', 'arrayService', 'settingService', function AppControllerFactory($rootScope, $scope, $window, arrayService, settingService) {
    var
      updater,
      timeStep,
      timeDiff,
      timeoutId,
      timeUpdate,
      lastTimestamp,

      sort = {},

      requestUpdate = function requestUpdate() {
        if (timeoutId) {
          $window.clearTimeout(timeoutId);
        }

        $window.requestAnimationFrame(updater);
      },

      setTimeStep = function setTimeStep() {
        timeStep = settingService.get('timeStep');
      },

      update = function update(timestamp) {
        lastTimestamp = lastTimestamp || timestamp;
        timeDiff      = timestamp - lastTimestamp;
        timeUpdate    = Math.max(0, timeStep - timeDiff);

        $rootScope.$broadcast('update');

        timeoutId     = $window.setTimeout(requestUpdate, timeUpdate);
        lastTimestamp = timestamp + timeUpdate;
      },

      updateSort = function updateSort() {
        var
          selectedSorter          = arrayService.getSelectedSorter(),
          selectedSorterIndex     = selectedSorter && selectedSorter.index;

        sort.sorters              = arrayService.getSorters();
        sort.selectedSorterIndex  = selectedSorterIndex;
      },

      toggleMute = function toggleMute() {
        settingService.play(0);
      },

      updateMuted = function updateMuted() {
        $scope.muted = settingService.isMuted();
      },

      onKeydown = function onKeydown($event) {
        if ($event && $event.keyCode === 27) {
          toggleMute();
        }
      },

      onSelectedSorterSet = function onSelectedSorterSet() {
        updateSort();
      },

      onChangeSort = function onChangeSort($event) {
        arrayService.selectSorter(sort.selectedSorterIndex);
      },

      onSettingChanged = function onSettingChanged(timestamp) {
        setTimeStep();
      },

      init = function init() {
        updater               = update;
        $scope.sort           = sort;
        $scope.onKeydown      = onKeydown;
        $scope.toggleMute     = toggleMute;
        $scope.onChangeSort   = onChangeSort;

        $scope.$on('selectedSorterSet', onSelectedSorterSet);
        $scope.$on('settingChanged',    onSettingChanged);
        $scope.$on('zound',             updateMuted);

        setTimeStep();
        updateSort();
        requestUpdate();
        toggleMute();
      };

    init();
  }]);
};

module.exports = AppControllerFactoryConstructor;
