var
  QuicksortFactoryFactoryConstructor;

QuicksortFactoryFactoryConstructor = function QuicksortFactoryFactoryConstructor(app) {
  app.factory('quicksort', ['$rootScope', '$q', 'arrayService', function ($rootScope, $q, arrayService) {
    var
      quickSortPartition = function quickSortPartition(left, right) {
        var
          i,
          pivot,
          innerCheckDeferred  = $q.defer(),
          partitionDeferred   = $q.defer(),

          innerCheck = function innerCheck(j) {
            if (j >= pivot) {
              innerCheckDeferred.resolve();

              return innerCheckDeferred.promise;
            }

            arrayService.compare(pivot, j).then(function (isPivotItemGreater) {
              arrayService.decideSwap(isPivotItemGreater, i, j).then(function (didSwap) {
                if (didSwap) {
                  i++;
                }

                innerCheck(j + 1);
              });
            });

            return innerCheckDeferred.promise;
          };

        pivot = arrayService.getRandomIndex(left, right) + 1;

        arrayService.read(pivot, 'pivot').then(function () {
          arrayService.swap(pivot, right).then(function () {
            pivot = right;
            i     = left;

            innerCheck(left).then(function () {
              arrayService.decideSwap(true, i, pivot).then(function (didSwap) {
                if (pivot === left + 1) {
                  arrayService.finalize(left, pivot);
                } else {
                  arrayService.finalize(i);
                }

                partitionDeferred.resolve(i);
              });
            });
          });
        });

        return partitionDeferred.promise;
      },

      quickSort = function quickSort(id, left, right) {
        var
          quickSortDeferred = $q.defer();

        if (id !== arrayService.getArrayId()) {
          quickSortDeferred.resolve();
          return;
        }

        if (right === undefined) {
          right = arrayService.getArrayLength() - 1;
        }

        if (left >= right) {
          arrayService.finalize(right);
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
