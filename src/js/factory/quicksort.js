var
  QuicksortFactoryFactoryConstructor;

QuicksortFactoryFactoryConstructor = function QuicksortFactoryFactoryConstructor(app) {
  app.factory('quicksort', ['$rootScope', '$q', 'arrayService', function ($rootScope, $q, arrayService) {
    var
      quickSortPartition = function quickSortPartition(left, right) {
        var
          i,
          innerCheckDeferred  = $q.defer(),
          partitionDeferred   = $q.defer(),

          innerCheck = function innerCheck(j) {
            if (j >= right) {
              innerCheckDeferred.resolve();

              return innerCheckDeferred.promise;
            }

            arrayService.read(j).then(function (item) {
              arrayService.compare(right, j).then(function (isPivotItemGreater) {
                arrayService.decideSwap(isPivotItemGreater, i, j).then(function (didSwap) {
                  if (didSwap) {
                    i++;
                  }

                  innerCheck(j + 1);
                });
              });
            });

            return innerCheckDeferred.promise;
          };

        arrayService.read(right, 'pivot').then(function (pivotItem) {
          i = left;

          innerCheck(left).then(function () {
            arrayService.decideSwap(true, i, right).then(function (didSwap) {
              if (right === left + 1) {
                arrayService.broadcastFinalized(left);
                arrayService.broadcastFinalized(right);
              } else {
                arrayService.broadcastFinalized(i);
              }

              partitionDeferred.resolve(i);
            });
          });
        });

        return partitionDeferred.promise;
      },

      quickSort = function quickSort(id, left, right) {
        var
          quickSortDeferred = $q.defer();

        if (id !== arrayService.getArrayId()) {
          return;
        }

        if (right === undefined) {
          right = arrayService.getArrayLength() - 1;
        }

        if (left >= right) {
          arrayService.broadcastFinalized(right);
          quickSortDeferred.resolve();

          return quickSortDeferred.promise;
        }

        quickSortPartition(left, right).then(function (partition) {
          quickSort(id, left, partition - 1).then(function () {
            quickSort(id, partition + 1, right).then(function () {
              quickSortDeferred.resolve();
            });
          });
        });

        return quickSortDeferred.promise;
      };

    return quickSort;
  }]);
};

module.exports = QuicksortFactoryFactoryConstructor;
