var
  TASK_CONFIG = {
    'bower' : {
      'install' : {
        'options' : {
          'copy' : false
        }
      }
    },

    'bower_concat' : {
      'compiled' : {
        'dest' : 'build/compiled/js/lib.js'
      },

      'minified' : {
        // Special callback for defining built files general.
        // In this case we want bower concat to use the minified builds.
        'callback' : function callback(mainFiles, component) {
          var
            fs = require('fs'),

            exists = function exists(path) {
              try {
                fs.accessSync(path, fs.F_OK);
                return true;
                // Do something
              } catch (e) {
                // It isn't accessible
                return false;
              }
            };

          return mainFiles.map(function (filepath) {
            var minPath;

            minPath = filepath.replace(/\.js$/, '.min.js');

            if (exists(minPath)) {
              return minPath;
            }

            minPath = filepath.replace(/\.js$/, '-nodebug-jsmin.js');

            if (exists(minPath)) {
              return minPath;
            }

            return filepath;
          });
        },

        'dest' : 'build/minified/js/lib.js'
      }
    },

    'browserify' : {
      'target' : {
        'files': [
          {
            'expand'  : true,
            'src'     : 'client-loader.js',
            'dest'    : 'build/precompiled/js'
          }
        ]
      }
    },

    'clean' : {
      'coverage' : 'test/coverage',

      'precompiled' : 'build/precompiled',
      'compiled'    : 'build/compiled',
      'minified'    : 'build/minified'
    },

    'concat' : {
      'options': {
        'separator': ';'
      },

      'compiled' : {
        'files': {
          'build/compiled/js/app.js' : ['build/precompiled/js/template.js', 'build/precompiled/js/client-loader.js']
        }
      }
    },

    'copy' : {
      'asset_compiled' : {
        'expand'  : true,
        'cwd'     : 'asset/',
        'src'     : '**/*',
        'dest'    : 'build/compiled/'
      },

      'asset_minified' : {
        'expand'  : true,
        'cwd'     : 'asset/',
        'src'     : '**/*',
        'dest'    : 'build/minified/'
      },

      'view' : {
        'expand'  : true,
        'cwd'     : 'src/html/view',
        'src'     : '**/*',
        'dest'    : 'build/compiled'
      }
    },

    'cssmin' : {
      'options': {
        'shorthandCompacting': false,
        'roundingPrecision': -1
      },

      'minified': {
        'files': [
          {
            'src'   : 'build/compiled/css/app.css',
            'dest'  : 'build/minified/css/app.css'
          }
        ]
      }
    },

    'env' : {
      'coverage': {
        'SRC_COVERAGE' : '../test/coverage/instrument/src/js'
      }
    },

    'htmlmin' : {
      'minified': {
        'options': {
          'removeComments'      : true,
          'collapseWhitespace'  : true
        },

        'files': [
          {
            'expand'  : true,
            'src'     : ['**/*.html'],
            'cwd'     : 'build/compiled',
            'dest'    : 'build/minified'
          }
        ]
      }
    },

    'instrument' : {
      'files' : 'src/js/**/*.js',

      'options' : {
        'lazy'      : true,
        'basePath'  : 'test/coverage/instrument'
      }
    },

    'jasmine_nodejs' : {
      'options' : {
        'random' : true
      },

      'all' : {
        'specs' : 'test/spec/**/*.spec.js'
      }
    },

    'jscs' : {
      'options' : {
        'disallowTrailingWhitespace'            : true,
        'disallowTrailingComma'                 : true,
        'disallowFunctionDeclarations'          : true,
        'disallowNewlineBeforeBlockStatements'  : true,
        'disallowMixedSpacesAndTabs'            : true,
        'requireDotNotation'                    : true,
        'requireMultipleVarDecl'                : true,
        'requireSpaceAfterKeywords'             : true,
        'requireSpaceBeforeBlockStatements'     : true,
        'requireSpacesInConditionalExpression'  : true,
        'requireCurlyBraces'                    : true,
        'disallowKeywordsOnNewLine'             : ['else'],
        'validateIndentation'                   : 2,
        'requireSpacesInFunction' : {
          'beforeOpeningCurlyBrace' : true
        }
      },

      'default' : ['*.js', 'config', 'src', 'test/spec']
    },

    'jshint' : {
      'options': {
        'jasmine'     : true,
        'browser'     : true,
        'curly'       : true,
        'eqeqeq'      : true,
        'eqnull'      : true,
        'latedef'     : true,
        'newcap'      : true,
        'node'        : true,
        'nonew'       : true,
        'nonbsp'      : true,
        'quotmark'    : 'single',
        'undef'       : true,
        'debug'       : true,
        'indent'      : 2
      },

      'default' : ['*.js', 'config', 'src', 'test/spec'],

      'strict' : {
        'options' : {
          'noempty' : true,
          'unused'  : 'vars'
        },

        'files' : {
          'src' : ['*.js', 'config', 'src', 'test/spec']
        }
      }
    },

    'makeReport' : {
      'src' : 'test/coverage/reports/**/*.json',

      'options' : {
        'type'  : 'lcov',
        'dir'   : 'test/coverage/reports',
        'print' : 'detail'
      }
    },

    'md5symlink' : {
      'options' : {
        'patterns' : ['.js', '.css']
      },

      'compiled': {
        'src'   : 'build/compiled/**/*',
        'dest'  : 'build/compiled'
      },

      'minified': {
        'src'   : 'build/minified/**/*',
        'dest'  : 'build/minified'
      }
    },

    'ngtemplates' : {
      'default' : {
        'cwd'         : 'src/html/template',
        'src'         : '**/*.html',
        'dest'        : 'build/precompiled/js/template.js',
        'options'     : {
          'bootstrap': function (module, script) {
            // This predefines a function which will populate the angular
            // cache with the template HTML. Check out the generated
            // template.js under the build directory, you'll need to call
            // it with your angular app instance.
            return 'window.angularTemplates = function angularTemplates(app) { app.run([\'$templateCache\', function ($templateCache) { ' + script + ' } ]) };';
          },

          // Reference existing task.
          'htmlmin' : {
            'collapseWhitespace'        : true,
            'collapseBooleanAttributes' : true
          }
        }
      }
    },

    'storeCoverage' : {
      'options' : {
        'dir' : 'test/coverage/reports'
      }
    },

    'stylus' : {
      'options' : {
        // Use import statements on css as copy inclusion.
        'include css' : true,
        'compress'    : false
      },

      'compiled' : {
        'files': [
          {
            'src'     : 'src/styl/main.styl',
            'dest'    : 'build/compiled/css/app.css'
          }
        ]
      }
    },

    'symlinkassets' : {
      'compiled': {
        'root'  : 'compiled',
        'src'   : 'build/compiled/**/*',
        'dest'  : 'build/compiled'
      },

      'minified': {
        'root'  : 'minified',
        'src'   : 'build/minified/**/*',
        'dest'  : 'build/minified'
      }
    },

    'uglify' : {
      'minified': {
        'options' : {
          'drop_console': true
        },

        'files': [
          {
            'expand'  : true,
            'src'     : ['**/*.js'],
            'cwd'     : 'build/compiled',
            'dest'    : 'build/minified'
          }
        ]
      }
    },

    'gh-pages': {
      'options': {
        'base': 'build/minified',
        'user': {
          'name': '<%= pkg.author.name %>',
          'email': '<%= pkg.author.email %>'
        }
      },

      'src': ['**/*']
    },

    'watch' : {
      'options' : {
        'spawn'         : false,
        'maxListeners'  : 99
      },

      'js' : {
        'files' : ['src/js/**/*.js', 'test/spec/**/*.js'],
        'tasks' : ['test:build', 'browserify', 'concat:compiled']
      },

      'html' : {
        'files' : ['src/html/**/*.html'],
        'tasks' : ['ngtemplates', 'concat:compiled', 'copy:view']
      },

      'styl' : {
        'files' : ['src/styl/**/*'],
        'tasks' : ['stylus:compiled']
      },

      'asset' : {
        'files' : ['asset/**/*'],
        'tasks' : ['copy:asset_compiled', 'copy:asset_minified']
      }
    }
  },

  TASKS = {
    'setup' : [
      'bower'
    ],

    'coverage' : [
      'clean:coverage',
      'env:coverage',
      'instrument',
      'jasmine_nodejs',
      'storeCoverage',
      'makeReport'
    ],

    'test:build' : [
      'jshint:default',
      'jasmine_nodejs'
    ],

    'test:style' : [
      'jshint:strict',
      'jscs'
    ],

    'compile' : [
      'clean:precompiled',
      'clean:compiled',
      'bower_concat:compiled',
      'browserify',
      'ngtemplates',
      'concat:compiled',
      'stylus:compiled',
      'copy:view',
      'copy:asset_compiled'
    ],

    'minify' : [
      'clean:minified',
      'bower_concat:minified',
      'uglify:minified',
      'htmlmin:minified',
      'cssmin:minified',
      'copy:asset_minified'
    ],

    'md5' : [
      'md5symlink',
      'symlinkassets'
    ],

    'build:dev' : [
      'test:build',
      'compile'
    ],

    'dev' : [
      'clean',
      'build:dev',
      'watch'
    ],

    'build' : [
      'compile',
      'minify',
      'md5'
    ],

    'test' : [
      'test:build',
      'test:style'
    ],

    'publish' : [
      'clean',
      'setup',
      'build',
      'gh-pages'
    ],

    'default' : [
      'test:style',
      'coverage',
      'build'
    ]
  },

  runGrunt = function runGrunt(grunt) {
    var
      registerTask = function registerTask(taskName, task) {
        grunt.registerTask(taskName, task);
      },

      registerTasks = function registerTasks(tasks) {
        var
          taskName;

        for (taskName in tasks) {
          registerTask(taskName, tasks[taskName]);
        }
      },

      init = function init() {
        TASK_CONFIG.pkg = grunt.file.readJSON('package.json');

        grunt.initConfig(TASK_CONFIG);

        grunt.loadNpmTasks('grunt-angular-templates');
        grunt.loadNpmTasks('grunt-bower-concat');
        grunt.loadNpmTasks('grunt-bower-task');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-htmlmin');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-stylus');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-env');
        grunt.loadNpmTasks('grunt-gh-pages');
        grunt.loadNpmTasks('grunt-istanbul');
        grunt.loadNpmTasks('grunt-jasmine-nodejs');
        grunt.loadNpmTasks('grunt-jscs');
        grunt.loadNpmTasks('grunt-md5symlink');
        grunt.loadNpmTasks('grunt-symlinkassets');

        registerTasks(TASKS);
      };

    init();
  };

module.exports = runGrunt;
