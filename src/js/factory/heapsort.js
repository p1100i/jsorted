
var
  HeapsortFactoryFactoryConstructor;

HeapsortFactoryFactoryConstructor = function HeapsortFactoryFactoryConstructor(app) {
  app.factory('heapsort', ['$rootScope', '$q', 'arrayService', function ($rootScope, $q, arrayService) {
    var
      getParentIndex = function getParentIndex(i) {
        return Math.floor((i - 1) / 2);
      },

      getLeftChildIndex = function getLeftChildIndex(i) {
        return 2 * i + 1;
      },

      shiftDown = function shiftDown(left, right, root) {
        var
          child,
          toSwap,
          shiftDownDeferred = $q.defer();

        if (root === undefined) {
          root = left;
        }

        toSwap  = root;
        child   = getLeftChildIndex(root);

        if (child > right) {
          shiftDownDeferred.resolve();
          return shiftDownDeferred.promise;
        }

        arrayService.compare(child, toSwap).then(function (leftChildBigger) {
          if (leftChildBigger) {
            toSwap = child;
          }

          arrayService.compare(child + 1, toSwap).then(function (rightChildBigger) {
            if (child < right && rightChildBigger) {
              toSwap = child + 1;
            }

            arrayService.decideSwap(toSwap !== root, root, toSwap).then(function (didSwap) {
              if (didSwap) {
                root = toSwap;

                shiftDown(left, right, root).then(function () {
                  shiftDownDeferred.resolve();
                });
              } else {
                shiftDownDeferred.resolve();
              }
            });
          });
        });

        return shiftDownDeferred.promise;
      },

      heapify = function heapify(heapLeft, right) {
        var
          heapifyDeferred = $q.defer();

        shiftDown(heapLeft, right).then(function () {

          if (heapLeft <= 0) {
            heapifyDeferred.resolve();
            return;
          }

          heapLeft--;

          heapify(heapLeft, right).then(function () {
            heapifyDeferred.resolve();
          });
        });

        return heapifyDeferred.promise;
      },

      swapByShiftDown = function swapByShiftDown(right) {
        var
          swapByShiftDownDeferred = $q.defer();

        arrayService.decideSwap(right > 0, right, 0).then(function (didSwap) {
          arrayService.finalize(right);

          if (didSwap) {
            right--;
            shiftDown(0, right).then(function () {
              swapByShiftDown(right).then(function () {
                swapByShiftDownDeferred.resolve();
              });
            });
          } else {
            swapByShiftDownDeferred.resolve();
          }
        });

        return swapByShiftDownDeferred.promise;
      },

      heapSort = function heapSort() {
        var
          len               = arrayService.getArrayLength(),
          right             = len - 1,
          mid               = getParentIndex(right),
          heapSortDeferred  = $q.defer();

        heapify(mid, right).then(function () {
          swapByShiftDown(right).then(function () {
            heapSortDeferred.resolve();
          });
        });

        return heapSortDeferred.promise;
      };

    return heapSort;
  }]);
};

module.exports = HeapsortFactoryFactoryConstructor;
