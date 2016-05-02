
var
  MergesortFactoryFactoryConstructor;

MergesortFactoryFactoryConstructor = function MergesortFactoryFactoryConstructor(app) {
  app.factory('mergesort', ['$rootScope', '$q', 'arrayService', function ($rootScope, $q, arrayService) {
    var
      getMid = function getMid(left, right) {
        return Math.ceil((right - left) / 2) + left;
      },

      merge = function merge(left, right, i, j, mid) {
        var
          mergeDeferred = $q.defer();

        if (i === mid || j === right + 1) {
          arrayService.visualize(left, right).then(function () {
            mergeDeferred.resolve();
          });

          return mergeDeferred.promise;
        }

        arrayService.compare(i, j, true).then(function (isItemGreater) {
          arrayService.decideMove(isItemGreater, j, i, true).then(function (didMove) {
            if (didMove) {
              merge(left, right, i + 1, j + 1, mid + 1).then(function () {
                mergeDeferred.resolve();
              });
            } else {
              merge(left, right, i + 1, j, mid).then(function () {
                mergeDeferred.resolve();
              });
            }
          });
        });

        return mergeDeferred.promise;
      },

      mergeSort = function mergeSort(id, left, right) {
        var
          mid,
          lastIteration,
          mergeSortDeferred = $q.defer();

        if (id !== arrayService.getArrayId()) {
          mergeSortDeferred.resolve();
          return mergeSortDeferred.promise;
        }

        if (right === undefined) {
          lastIteration = true;
          right = arrayService.getArrayLength() - 1;
        }

        if (left >= right) {
          mergeSortDeferred.resolve();
          return mergeSortDeferred.promise;
        }

        mid = getMid(left, right);

        mergeSort(id, left, mid - 1).then(function () {
          mergeSort(id, mid, right).then(function () {
            merge(left, right, left, mid, mid).then(function () {
              if (lastIteration) {
                arrayService.finalize(left, right);
              }

              mergeSortDeferred.resolve();
            });
          });
        });

        return mergeSortDeferred.promise;
      };

    return mergeSort;
  }]);
};

module.exports = MergesortFactoryFactoryConstructor;
