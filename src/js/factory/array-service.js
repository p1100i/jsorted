var
  ArrayServiceFactoryConstructor;

ArrayServiceFactoryConstructor = function ArrayServiceFactoryConstructor(app) {
  app.factory('arrayService', ['$rootScope', '$q', 'settingService', function ($rootScope, $q, settingService) {
    var
      array   = [],
      sorters = [],
      counts  = {},

      arrayId,
      deferred,
      resolveWith,
      selectedSorter,

      getCounts = function getCounts() {
        return counts;
      },

      broadcastMark = function broadcastMark(i, markerType) {
        $rootScope.$broadcast('indexMarked', i, markerType);
      },

      broadcastAdd = function broadcastAdd(i, value) {
        $rootScope.$broadcast('valueAdded', i, value);
      },

      broadcastFinalized = function broadcastFinalized(i) {
        var
          value = array[i];

        $rootScope.$broadcast('valueAdded', i, value, true);
      },

      hideMarkers = function hideMarkers() {
        broadcastMark(-1, 'pivot');
        broadcastMark(-1, 'swapSmall');
        broadcastMark(-1, 'swapBig');
      },

      addSorter = function addSorter(name, title, fn) {
        sorters.push({
          'name'  : name,
          'title' : title,
          'fn'    : fn,
          'index' : sorters.length
        });
      },

      getUniqueRandomValue = function getUniqueRandomValue(max) {
        var
          value,
          found,
          maxTries = 1000;

        do {
          value = Math.floor(Math.random() * max) + 1;
          maxTries--;
          found = array.indexOf(value) === -1 || maxTries < 0;
        } while (!found);

        return value;
      },

      clear = function clear() {
        counts.swap     = 0;
        counts.compare  = 0;
        counts.read     = 0;

        if (arrayId === undefined) {
          arrayId = 1;
        } else {
          arrayId++;
        }

        array.splice(0, array.length);
      },

      addValue = function addValue(index, value) {
        broadcastAdd(index, value);
        array.push(value);
      },

      fill = function fill(predefined) {
        var
          i,
          val,
          len = settingService.get('arrayLength'),
          max = settingService.get('maxValue');

        if (predefined) {
          len = predefined.length;
          max = Math.max.apply(null, predefined);

          settingService.set('arrayLength', len);
          settingService.set('maxValue',    max);
        }

        for (i = 0; i < len; i++) {
          val = predefined ? predefined[i] : getUniqueRandomValue(max);
          addValue(i, val);
        }
      },

      getArrayLength = function getArrayLength() {
        return array.length;
      },

      getArrayId = function getArrayId() {
        return arrayId;
      },

      getSorters = function getSorters() {
        return sorters;
      },

      getSelectedSorter = function getSelectedSorter() {
        return selectedSorter;
      },

      selectSorter = function selectSorter(i) {
        var
          sorter = sorters[i] || sorters[0];

        if (!sorter) {
          return;
        }

        selectedSorter = sorter;

        $rootScope.$broadcast('selectedSorterSet', selectedSorter);
      },

      selectNextSorter = function selectNextSorter() {
        var
          i = sorters.indexOf(selectedSorter);

        i += 1;
        i %= sorters.length;

        selectSorter(i);
      },

      unsetDeferred = function unsetDeferred() {
        deferred = undefined;
      },

      resolveDeferred = function resolveDeferred() {
        if (!deferred) {
          return;
        }

        deferred.resolve(resolveWith);

        unsetDeferred();
      },

      setDeferred = function setDeferred() {
        if (deferred) {
          console.log('trying to set already set deferred', deferred);
          throw new Error('invalid method');
        }

        deferred = $q.defer();

        return deferred.promise;
      },

      setResolveWith = function setResolveWith(value, resolveInstantly) {
        var
          instantDeferred;

        if (resolveInstantly) {
          instantDeferred = $q.defer();
          instantDeferred.resolve(value);

          return instantDeferred.promise;
        }

        resolveWith = value;

        return setDeferred();
      },

      normalize = function normalize(value) {
        var
          max = settingService.get('maxValue');

        return value / max;
      },

      mark = function mark(i, markerType) {
        var
          value;

        value = array[i];

        if (markerType) {
          broadcastMark(i, markerType);
        }

        settingService.play(normalize(value));

        return setResolveWith(value);
      },

      finalize = function finalize(i, j) {
        do {
          broadcastFinalized(i);
        } while (++i <= j);
      },

      read = function read(i, markerType) {
        var
          value;

        value = array[i];

        counts.read++;

        if (markerType) {
          broadcastMark(i, markerType);
        }

        return setResolveWith(value, true);
      },

      decideSwap = function decideSwap(swap, i, j) {
        if (!swap) {
          return setResolveWith(false, true);
        }

        var
          big,
          smaller;

        big     = array[i];
        smaller = array[j];

        counts.swap++;

        array[i]    = smaller;
        array[j]    = big;

        broadcastAdd(i, smaller);
        broadcastAdd(j, big);

        broadcastMark(i, 'swapSmall');
        broadcastMark(j, 'swapBig');

        settingService.play(normalize(smaller));

        return setResolveWith(true);
      },

      visualize = function visualize(i, j) {
        for (; i <= j; i++) {
          broadcastAdd(i, array[i]);
        }

        return setResolveWith(true);
      },

      decideMove = function decideMove(move, movedIndex, destination, instantly) {
        if (!move) {
          return setResolveWith(false, true);
        }

        var
          value,
          movedValue = array[movedIndex];

        for (; movedIndex > destination; movedIndex--) {
          value = array[movedIndex - 1];
          array[movedIndex] = value;
        }

        array[destination] = movedValue;

        return setResolveWith(true, instantly);
      },

      compare = function compare(i, j, play, instantly) {
        broadcastMark(i, 'swapSmall');
        broadcastMark(j, 'swapBig');

        counts.compare++;

        if (play) {
          settingService.play(normalize(array[i]));
        }

        return setResolveWith(array[i] > array[j], instantly);
      };

    return {
      'addSorter'           : addSorter,
      'broadcastMark'       : broadcastMark,
      'broadcastFinalized'  : broadcastFinalized,
      'clear'               : clear,
      'compare'             : compare,
      'finalize'            : finalize,
      'decideSwap'          : decideSwap,
      'decideMove'          : decideMove,
      'fill'                : fill,
      'getArrayId'          : getArrayId,
      'getArrayLength'      : getArrayLength,
      'getCounts'           : getCounts,
      'getSelectedSorter'   : getSelectedSorter,
      'getSorters'          : getSorters,
      'hideMarkers'         : hideMarkers,
      'mark'                : mark,
      'read'                : read,
      'resolveDeferred'     : resolveDeferred,
      'selectNextSorter'    : selectNextSorter,
      'selectSorter'        : selectSorter,
      'visualize'           : visualize,
      'unsetDeferred'       : unsetDeferred
    };
  }]);
};

module.exports = ArrayServiceFactoryConstructor;
