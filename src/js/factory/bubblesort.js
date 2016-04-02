var
  BubblesortFactoryFactoryConstructor;

BubblesortFactoryFactoryConstructor = function BubblesortFactoryFactoryConstructor(app) {
  app.factory('bubblesort', ['$rootScope', '$q', 'arrayService', function ($rootScope, $q, arrayService) {
    var
      bubbleSort = function bubbleSort(id, i, swapped, passLastSwap, lastSwap, sortDeferred) {
        if (id !== arrayService.getArrayId()) {
          return;
        }

        if (!sortDeferred) {
          sortDeferred = $q.defer();
        }

        var
          lastStep = i + 1 >= lastSwap || i + 1 === arrayService.getArrayLength() - 1,

          continuePass = function continuePass() {
            bubbleSort(id, i + 1, swapped, passLastSwap, lastSwap, sortDeferred);
          },

          restartPass = function restartPass() {
            if (swapped && i !== 0) {
              bubbleSort(id, 0, false, 0, lastSwap, sortDeferred);
              return;
            }

            arrayService.broadcastFinalized(0);
            sortDeferred.resolve();
          },

          finishStep = function finishStep(swappedStep) {
            if (swappedStep) {
              passLastSwap  = i;
              swapped       = true;
            }

            if (lastStep) {
              arrayService.broadcastFinalized(passLastSwap + 1, lastSwap);
              lastSwap = passLastSwap;
              restartPass();
            } else {
              continuePass();
            }
          };

        arrayService.read(i, 'pivot').then(function (pivotItem) {
          arrayService.read(i + 1).then(function (item) {
            arrayService.compare(i, i + 1).then(function (isPivotItemGreater) {
              arrayService.decideSwap(isPivotItemGreater, i, i + 1).then(function (swappedStep) {
                finishStep(swappedStep);
              });
            });
          });
        });

        return sortDeferred.promise;
      };

    return bubbleSort;
  }]);
};

module.exports = BubblesortFactoryFactoryConstructor;
