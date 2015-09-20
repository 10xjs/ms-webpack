'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _supportsColor = require('supports-color');

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var DestinationError = (function (_Error) {
  _inherits(DestinationError, _Error);

  function DestinationError(destination, outputPath) {
    _classCallCheck(this, DestinationError);

    _get(Object.getPrototypeOf(DestinationError.prototype), 'constructor', this).call(this);
    this.message = 'Webpack output path is outside of metalsmith destination';
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.destination = destination;
    this.outputPath = outputPath;
  }

  return DestinationError;
})(Error);

exports.DestinationError = DestinationError;
;

var MetalsmithWebpack = (function () {
  function MetalsmithWebpack(options) {
    var _this = this;

    _classCallCheck(this, MetalsmithWebpack);

    options = MetalsmithWebpack.resolvePaths(options);

    options.watch = false;

    this.compiler = (0, _webpack2['default'])(options);
    this.compiler.outputFileSystem = new _memoryFs2['default']();

    this.compiler.plugin('after-emit', function (compilation, callback) {
      _this.compiler.purgeInputFileSystem();

      _this.compilation = compilation;

      _this.setFiles();
      _this.setMetadata();

      MetalsmithWebpack.printStats(compilation, options);

      callback();
    });
  }

  _createClass(MetalsmithWebpack, [{
    key: 'setMetadata',
    value: function setMetadata() {
      var assetsByChunkName = this.compilation.getStats().toJson().assetsByChunkName;
      var publicPath = this.compilation.mainTemplate.getPublicPath({
        hash: this.compilation.hash
      });
      var assets = Object.keys(assetsByChunkName).reduce(function (reduced, chunkName) {
        var chunkAsset = assetsByChunkName[chunkName];

        if (Array.isArray(chunkAsset)) {
          var chunkAssets = chunkAsset.reduce(function (chunkObj, file) {
            chunkObj[chunkName + _path2['default'].extname(file)] = publicPath + file;
            return chunkObj;
          }, {});
          return _extends({}, reduced, chunkAssets);
        }

        reduced[chunkName + _path2['default'].extname(chunkAsset)] = _path2['default'].join(publicPath, chunkAsset);
        return reduced;
      }, {});

      var assetsByType = Object.keys(this.compilation.assets).reduce(function (reduced, assetName) {
        var ext = _path2['default'].extname(assetName).replace(/^\./, '');
        reduced[ext] = (reduced[ext] || []).concat([publicPath + assetName]);
        return reduced;
      }, {});

      this.metalsmith.metadata().webpack = { assets: assets, assetsByType: assetsByType };
    }
  }, {
    key: 'setFiles',
    value: function setFiles() {
      var _this2 = this;

      var fs = this.compiler.outputFileSystem;
      Object.keys(this.compilation.assets).forEach(function (outname) {
        var asset = _this2.compilation.assets[outname];

        if (asset.emitted) {
          var fileName = asset.existsAt;
          var _name = _path2['default'].relative(_this2.metalsmith.destination(), fileName);
          var contents = fs.readFileSync(fileName);
          _this2.files[_name] = { contents: contents, fileName: fileName };
        }
      });
    }
  }, {
    key: 'plugin',
    value: function plugin() {
      var _this3 = this;

      return function (files, metalsmith, done) {
        var destination = metalsmith.destination();
        var outputPath = _this3.compiler.options.output.path;

        if (_path2['default'].relative(destination, outputPath).startsWith('../')) {
          throw new DestinationError(destination, outputPath);
        }

        _this3.metalsmith = metalsmith;
        _this3.files = files;

        console.log('\n' + _chalk2['default'].magenta('[metalsmith-webpack]') + ' compiling...');

        _this3.compiler.run(done);
      };
    }
  }], [{
    key: 'resolvePaths',
    value: function resolvePaths(options) {
      return _extends({}, options, {
        context: _path2['default'].resolve(options.context || process.cwd()),
        output: _extends({}, options.output, {
          path: _path2['default'].resolve(options.output.path)
        })
      });
    }
  }, {
    key: 'printStats',
    value: function printStats(compilation, options) {
      var stats = compilation.getStats();
      var outputOptions = this.getDefaultOutputOptions(options);

      if (outputOptions.json) {
        console.log();
        console.log(JSON.stringify(stats.toJson(outputOptions), null, 2));
        console.log();
      } else if (stats.hash !== this.lastHash) {
        this.lastHash = stats.hash;
        var prefix = _chalk2['default'].magenta('[metalsmith-webpack]') + ' ';
        var output = stats.toString(outputOptions).split('\n').join('\n' + prefix);
        console.log(prefix + output);
        console.log();
      }
    }
  }, {
    key: 'getDefaultOutputOptions',
    value: function getDefaultOutputOptions(options) {
      var defaultOutputOptions = {
        colors: _supportsColor2['default'],
        chunks: true,
        modules: true,
        chunkModules: true,
        reasons: true,
        cached: true,
        cachedAssets: true
      };

      if (options.stats && !options.stats.json) {
        defaultOutputOptions = _extends({}, defaultOutputOptions, {
          cached: false,
          cachedAssets: false,
          exclude: ['node_modules', 'bower_components', 'jam', 'components']
        });
      }

      return _extends({}, defaultOutputOptions, options.stats || {});
    }
  }]);

  return MetalsmithWebpack;
})();

exports.MetalsmithWebpack = MetalsmithWebpack;

exports['default'] = function (options) {
  return new MetalsmithWebpack(options).plugin();
};

;