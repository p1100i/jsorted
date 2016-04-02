var
  AppControllerFactoryConstructor;

AppControllerFactoryConstructor = function AppControllerFactoryConstructor(app) {
  app.controller('appController', ['$rootScope', '$scope', '$window', 'arrayService', 'settingService', function AppControllerFactory($rootScope, $scope, $window, arrayService, settingService) {
    var
      updater,
      timeUnit,
      timediff,
      timeoutId,
      timeupdate,
      lastTimestamp,

      sort = {},


      requestUpdate = function requestUpdate() {
        if (timeoutId) {
          $window.clearTimeout(timeoutId);
        }

        $window.requestAnimationFrame(updater);
      },

      setTimeUnit = function setTimeUnit() {
        timeUnit = settingService.get('timeUnit');
      },

      update = function update(timestamp) {
        lastTimestamp = lastTimestamp || timestamp;
        timediff      = timestamp - lastTimestamp;
        timeupdate    = Math.max(0, timeUnit - timediff);

        $rootScope.$broadcast('update');

        timeoutId     = $window.setTimeout(requestUpdate, timeupdate);
        lastTimestamp = timestamp + timeupdate;
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

      changeTimeUnit = function changeTimeUnit(timeUnitDiff) {
        var
          currentTimeUnit = settingService.get('timeUnit');

        settingService.set('timeUnit', currentTimeUnit + timeUnitDiff);
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
        setTimeUnit();
      },

      init = function init() {
        updater               = update;
        $scope.sort           = sort;
        $scope.onKeydown      = onKeydown;
        $scope.toggleMute     = toggleMute;
        $scope.onChangeSort   = onChangeSort;
        $scope.changeTimeUnit = changeTimeUnit;

        $scope.$on('selectedSorterSet', onSelectedSorterSet);
        $scope.$on('settingChanged',    onSettingChanged);
        $scope.$on('zound',             updateMuted);

        setTimeUnit();
        updateSort();
        requestUpdate();
      };

    init();
  }]);
};

module.exports = AppControllerFactoryConstructor;
