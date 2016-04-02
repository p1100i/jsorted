var
  path = require('path'),

  processRequire = function processRequire(requirePath) {
    return require(path.join(process.env.SRC_COVERAGE || '../src/js', requirePath));
  };

module.exports = processRequire;
