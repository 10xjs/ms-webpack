'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetalsmithWebpack = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */


exports.default = function (options) {
  return new MetalsmithWebpack(options).plugin();
};

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetalsmithWebpack = exports.MetalsmithWebpack = function () {
  function MetalsmithWebpack(options) {
    var _this = this;

    _classCallCheck(this, MetalsmithWebpack);

    var _options = MetalsmithWebpack.resolvePaths(options);

    _options.watch = false;

    this.compiler = (0, _webpack2.default)(_options);
    this.compiler.outputFileSystem = new _memoryFs2.default();

    this.compiler.plugin('after-emit', function (compilation, callback) {
      _this.compiler.purgeInputFileSystem();

      _this.compilation = compilation;

      _this.setFiles();
      _this.setMetadata();

      MetalsmithWebpack.printStats(compilation, _options);

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
            chunkObj[chunkName + _path2.default.extname(file)] = publicPath + file;
            return chunkObj;
          }, {});
          return _extends({}, reduced, chunkAssets);
        }

        reduced[chunkName + _path2.default.extname(chunkAsset)] = publicPath + chunkAsset;
        return reduced;
      }, {});

      var assetsByType = Object.keys(this.compilation.assets).reduce(function (reduced, assetName) {
        var ext = _path2.default.extname(assetName).replace(/^\./, '');
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
          var name = _path2.default.relative(_this2.metalsmith.destination(), fileName);
          var contents = fs.readFileSync(fileName);
          _this2.files[name] = { contents: contents, fileName: fileName };
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

        if (_path2.default.relative(destination, outputPath).startsWith('../')) {
          throw new TypeError('Webpack output path is outside of metalsmith destination.');
        }

        _this3.metalsmith = metalsmith;
        _this3.files = files;

        console.log('\n' + _chalk2.default.magenta('[metalsmith-webpack]') + ' compiling...');

        _this3.compiler.run(done);
      };
    }
  }], [{
    key: 'resolvePaths',
    value: function resolvePaths(options) {
      return _extends({}, options, {
        context: _path2.default.resolve(options.context || process.cwd()),
        output: _extends({}, options.output, {
          path: _path2.default.resolve(options.output.path)
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
        var prefix = _chalk2.default.magenta('[metalsmith-webpack]') + ' ';
        var output = stats.toString(outputOptions).split('\n').join('\n' + prefix);
        console.log(prefix + output);
        console.log();
      }
    }
  }, {
    key: 'getDefaultOutputOptions',
    value: function getDefaultOutputOptions(options) {
      var defaultOutputOptions = {
        colors: _supportsColor2.default,
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
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6WyJvcHRpb25zIiwiTWV0YWxzbWl0aFdlYnBhY2siLCJwbHVnaW4iLCJfb3B0aW9ucyIsInJlc29sdmVQYXRocyIsIndhdGNoIiwiY29tcGlsZXIiLCJvdXRwdXRGaWxlU3lzdGVtIiwiY29tcGlsYXRpb24iLCJjYWxsYmFjayIsInB1cmdlSW5wdXRGaWxlU3lzdGVtIiwic2V0RmlsZXMiLCJzZXRNZXRhZGF0YSIsInByaW50U3RhdHMiLCJhc3NldHNCeUNodW5rTmFtZSIsImdldFN0YXRzIiwidG9Kc29uIiwicHVibGljUGF0aCIsIm1haW5UZW1wbGF0ZSIsImdldFB1YmxpY1BhdGgiLCJoYXNoIiwiYXNzZXRzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsInJlZHVjZWQiLCJjaHVua05hbWUiLCJjaHVua0Fzc2V0IiwiQXJyYXkiLCJpc0FycmF5IiwiY2h1bmtBc3NldHMiLCJjaHVua09iaiIsImZpbGUiLCJleHRuYW1lIiwiYXNzZXRzQnlUeXBlIiwiYXNzZXROYW1lIiwiZXh0IiwicmVwbGFjZSIsImNvbmNhdCIsIm1ldGFsc21pdGgiLCJtZXRhZGF0YSIsIndlYnBhY2siLCJmcyIsImZvckVhY2giLCJvdXRuYW1lIiwiYXNzZXQiLCJlbWl0dGVkIiwiZmlsZU5hbWUiLCJleGlzdHNBdCIsIm5hbWUiLCJyZWxhdGl2ZSIsImRlc3RpbmF0aW9uIiwiY29udGVudHMiLCJyZWFkRmlsZVN5bmMiLCJmaWxlcyIsImRvbmUiLCJvdXRwdXRQYXRoIiwib3V0cHV0IiwicGF0aCIsInN0YXJ0c1dpdGgiLCJUeXBlRXJyb3IiLCJjb25zb2xlIiwibG9nIiwibWFnZW50YSIsInJ1biIsImNvbnRleHQiLCJyZXNvbHZlIiwicHJvY2VzcyIsImN3ZCIsInN0YXRzIiwib3V0cHV0T3B0aW9ucyIsImdldERlZmF1bHRPdXRwdXRPcHRpb25zIiwianNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJsYXN0SGFzaCIsInByZWZpeCIsInRvU3RyaW5nIiwic3BsaXQiLCJqb2luIiwiZGVmYXVsdE91dHB1dE9wdGlvbnMiLCJjb2xvcnMiLCJjaHVua3MiLCJtb2R1bGVzIiwiY2h1bmtNb2R1bGVzIiwicmVhc29ucyIsImNhY2hlZCIsImNhY2hlZEFzc2V0cyIsImV4Y2x1ZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxakJBQUE7OztrQkE0SmUsVUFBU0EsT0FBVCxFQUFrQjtBQUMvQixTQUFPLElBQUlDLGlCQUFKLENBQXNCRCxPQUF0QixFQUErQkUsTUFBL0IsRUFBUDtBQUNELEM7O0FBN0pEOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRWFELGlCLFdBQUFBLGlCO0FBRVgsNkJBQVlELE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFDbkIsUUFBTUcsV0FBV0Ysa0JBQWtCRyxZQUFsQixDQUErQkosT0FBL0IsQ0FBakI7O0FBRUFHLGFBQVNFLEtBQVQsR0FBaUIsS0FBakI7O0FBRUEsU0FBS0MsUUFBTCxHQUFnQix1QkFBUUgsUUFBUixDQUFoQjtBQUNBLFNBQUtHLFFBQUwsQ0FBY0MsZ0JBQWQsR0FBaUMsd0JBQWpDOztBQUVBLFNBQUtELFFBQUwsQ0FBY0osTUFBZCxDQUFxQixZQUFyQixFQUFtQyxVQUFDTSxXQUFELEVBQWNDLFFBQWQsRUFBMkI7QUFDNUQsWUFBS0gsUUFBTCxDQUFjSSxvQkFBZDs7QUFFQSxZQUFLRixXQUFMLEdBQW1CQSxXQUFuQjs7QUFFQSxZQUFLRyxRQUFMO0FBQ0EsWUFBS0MsV0FBTDs7QUFFQVgsd0JBQWtCWSxVQUFsQixDQUE2QkwsV0FBN0IsRUFBMENMLFFBQTFDOztBQUVBTTtBQUNELEtBWEQ7QUFZRDs7OztrQ0F5RGE7QUFDWixVQUFNSyxvQkFBb0IsS0FBS04sV0FBTCxDQUFpQk8sUUFBakIsR0FDdkJDLE1BRHVCLEdBQ2RGLGlCQURaO0FBRUEsVUFBTUcsYUFBYSxLQUFLVCxXQUFMLENBQWlCVSxZQUFqQixDQUE4QkMsYUFBOUIsQ0FBNEM7QUFDN0RDLGNB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RHlCO0FBRXpCQyxnQkFBUSxJQUZpQjtBQUd6QkMsaUJBQVMsSUFIZ0I7QUFJekJDLHNCQUFjLElBSlc7QUFLekJDLGlCQUFTLElBTGdCO0FBTXpCQyxnQkFBUSxJQU5pQjtBQU96QkMsc0JBQWM7QUFQVyxPQUEzQjs7QUFVQSxVQUFJdkYsUUFBUXFFLEtBQVIsSUFBaUIsQ0FBQ3JFLFFBQVFxRSxLQUFSLENBQWNHLElBQXBDLEVBQTBDO0FBQ3hDUSw0Q0FDS0Esb0JBREw7QUFFRU0sa0JBQVEsS0FGVjtBQUdFQyx3QkFBYyxLQUhoQjtBQUlFQyxtQkFBUyxDQUFDLGNBQUQsRUFBaUIsa0JBQWpCLEVBQXFDLEtBQXJDLEVBQTRDLFlBQTVDO0FBSlg7QUFNRDs7QUFFRCwwQkFDS1Isb0JBREwsRUFFTWhGLFFBQVFxRSxLQUFSLElBQWlCLEVBRnZCO0FBSUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IE1lbW9yeUZzIGZyb20gJ21lbW9yeS1mcyc7XG5pbXBvcnQgc3VwcG9ydHNDb2xvciBmcm9tICdzdXBwb3J0cy1jb2xvcic7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuXG5leHBvcnQgY2xhc3MgTWV0YWxzbWl0aFdlYnBhY2sge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBfb3B0aW9ucyA9IE1ldGFsc21pdGhXZWJwYWNrLnJlc29sdmVQYXRocyhvcHRpb25zKTtcblxuICAgIF9vcHRpb25zLndhdGNoID0gZmFsc2U7XG5cbiAgICB0aGlzLmNvbXBpbGVyID0gd2VicGFjayhfb3B0aW9ucyk7XG4gICAgdGhpcy5jb21waWxlci5vdXRwdXRGaWxlU3lzdGVtID0gbmV3IE1lbW9yeUZzKCk7XG5cbiAgICB0aGlzLmNvbXBpbGVyLnBsdWdpbignYWZ0ZXItZW1pdCcsIChjb21waWxhdGlvbiwgY2FsbGJhY2spID0+IHtcbiAgICAgIHRoaXMuY29tcGlsZXIucHVyZ2VJbnB1dEZpbGVTeXN0ZW0oKTtcblxuICAgICAgdGhpcy5jb21waWxhdGlvbiA9IGNvbXBpbGF0aW9uO1xuXG4gICAgICB0aGlzLnNldEZpbGVzKCk7XG4gICAgICB0aGlzLnNldE1ldGFkYXRhKCk7XG5cbiAgICAgIE1ldGFsc21pdGhXZWJwYWNrLnByaW50U3RhdHMoY29tcGlsYXRpb24sIF9vcHRpb25zKTtcblxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZXNvbHZlUGF0aHMob3B0aW9ucykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgY29udGV4dDogcGF0aC5yZXNvbHZlKG9wdGlvbnMuY29udGV4dCB8fCBwcm9jZXNzLmN3ZCgpKSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAuLi5vcHRpb25zLm91dHB1dCxcbiAgICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKG9wdGlvbnMub3V0cHV0LnBhdGgpLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIHByaW50U3RhdHMoY29tcGlsYXRpb24sIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzdGF0cyA9IGNvbXBpbGF0aW9uLmdldFN0YXRzKCk7XG4gICAgY29uc3Qgb3V0cHV0T3B0aW9ucyA9IHRoaXMuZ2V0RGVmYXVsdE91dHB1dE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBpZiAob3V0cHV0T3B0aW9ucy5qc29uKSB7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoc3RhdHMudG9Kc29uKG91dHB1dE9wdGlvbnMpLCBudWxsLCAyKSk7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgIH0gZWxzZSBpZiAoc3RhdHMuaGFzaCAhPT0gdGhpcy5sYXN0SGFzaCkge1xuICAgICAgdGhpcy5sYXN0SGFzaCA9IHN0YXRzLmhhc2g7XG4gICAgICBjb25zdCBwcmVmaXggPSBgJHtjaGFsay5tYWdlbnRhKCdbbWV0YWxzbWl0aC13ZWJwYWNrXScpfSBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gc3RhdHMudG9TdHJpbmcob3V0cHV0T3B0aW9ucylcbiAgICAgICAgLnNwbGl0KCdcXG4nKS5qb2luKGBcXG4ke3ByZWZpeH1gKTtcbiAgICAgIGNvbnNvbGUubG9nKHByZWZpeCArIG91dHB1dCk7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXREZWZhdWx0T3V0cHV0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgbGV0IGRlZmF1bHRPdXRwdXRPcHRpb25zID0ge1xuICAgICAgY29sb3JzOiBzdXBwb3J0c0NvbG9yLFxuICAgICAgY2h1bmtzOiB0cnVlLFxuICAgICAgbW9kdWxlczogdHJ1ZSxcbiAgICAgIGNodW5rTW9kdWxlczogdHJ1ZSxcbiAgICAgIHJlYXNvbnM6IHRydWUsXG4gICAgICBjYWNoZWQ6IHRydWUsXG4gICAgICBjYWNoZWRBc3NldHM6IHRydWUsXG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zLnN0YXRzICYmICFvcHRpb25zLnN0YXRzLmpzb24pIHtcbiAgICAgIGRlZmF1bHRPdXRwdXRPcHRpb25zID0ge1xuICAgICAgICAuLi5kZWZhdWx0T3V0cHV0T3B0aW9ucyxcbiAgICAgICAgY2FjaGVkOiBmYWxzZSxcbiAgICAgICAgY2FjaGVkQXNzZXRzOiBmYWxzZSxcbiAgICAgICAgZXhjbHVkZTogWydub2RlX21vZHVsZXMnLCAnYm93ZXJfY29tcG9uZW50cycsICdqYW0nLCAnY29tcG9uZW50cyddLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZGVmYXVsdE91dHB1dE9wdGlvbnMsXG4gICAgICAuLi4ob3B0aW9ucy5zdGF0cyB8fCB7fSksXG4gICAgfTtcbiAgfVxuXG4gIHNldE1ldGFkYXRhKCkge1xuICAgIGNvbnN0IGFzc2V0c0J5Q2h1bmtOYW1lID0gdGhpcy5jb21waWxhdGlvbi5nZXRTdGF0cygpXG4gICAgICAudG9Kc29uKCkuYXNzZXRzQnlDaHVua05hbWU7XG4gICAgY29uc3QgcHVibGljUGF0aCA9IHRoaXMuY29tcGlsYXRpb24ubWFpblRlbXBsYXRlLmdldFB1YmxpY1BhdGgoe1xuICAgICAgaGFzaDogdGhpcy5jb21waWxhdGlvbi5oYXNoLFxuICAgIH0pO1xuICAgIGNvbnN0IGFzc2V0cyA9IE9iamVjdC5rZXlzKGFzc2V0c0J5Q2h1bmtOYW1lKVxuICAgICAgLnJlZHVjZSgocmVkdWNlZCwgY2h1bmtOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGNodW5rQXNzZXQgPSBhc3NldHNCeUNodW5rTmFtZVtjaHVua05hbWVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNodW5rQXNzZXQpKSB7XG4gICAgICAgICAgY29uc3QgY2h1bmtBc3NldHMgPSBjaHVua0Fzc2V0LnJlZHVjZSgoY2h1bmtPYmosIGZpbGUpID0+IHtcbiAgICAgICAgICAgIGNodW5rT2JqW2NodW5rTmFtZSArIHBhdGguZXh0bmFtZShmaWxlKV0gPSBwdWJsaWNQYXRoICsgZmlsZTtcbiAgICAgICAgICAgIHJldHVybiBjaHVua09iajtcbiAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnJlZHVjZWQsXG4gICAgICAgICAgICAuLi5jaHVua0Fzc2V0cyxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVkdWNlZFtjaHVua05hbWUgKyBwYXRoLmV4dG5hbWUoY2h1bmtBc3NldCldID0gcHVibGljUGF0aCArIGNodW5rQXNzZXQ7XG4gICAgICAgIHJldHVybiByZWR1Y2VkO1xuICAgICAgfSwge30pO1xuXG4gICAgY29uc3QgYXNzZXRzQnlUeXBlID0gT2JqZWN0LmtleXModGhpcy5jb21waWxhdGlvbi5hc3NldHMpXG4gICAgICAucmVkdWNlKChyZWR1Y2VkLCBhc3NldE5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKGFzc2V0TmFtZSkucmVwbGFjZSgvXlxcLi8sICcnKTtcbiAgICAgICAgcmVkdWNlZFtleHRdID0gKHJlZHVjZWRbZXh0XSB8fCBbXSkuY29uY2F0KFtwdWJsaWNQYXRoICsgYXNzZXROYW1lXSk7XG4gICAgICAgIHJldHVybiByZWR1Y2VkO1xuICAgICAgfSwge30pO1xuXG4gICAgdGhpcy5tZXRhbHNtaXRoLm1ldGFkYXRhKCkud2VicGFjayA9IHthc3NldHMsIGFzc2V0c0J5VHlwZX07XG4gIH1cblxuICBzZXRGaWxlcygpIHtcbiAgICBjb25zdCBmcyA9IHRoaXMuY29tcGlsZXIub3V0cHV0RmlsZVN5c3RlbTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbXBpbGF0aW9uLmFzc2V0cykuZm9yRWFjaCgob3V0bmFtZSkgPT4ge1xuICAgICAgY29uc3QgYXNzZXQgPSB0aGlzLmNvbXBpbGF0aW9uLmFzc2V0c1tvdXRuYW1lXTtcblxuICAgICAgaWYgKGFzc2V0LmVtaXR0ZWQpIHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBhc3NldC5leGlzdHNBdDtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhdGgucmVsYXRpdmUodGhpcy5tZXRhbHNtaXRoLmRlc3RpbmF0aW9uKCksIGZpbGVOYW1lKTtcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZU5hbWUpO1xuICAgICAgICB0aGlzLmZpbGVzW25hbWVdID0ge2NvbnRlbnRzLCBmaWxlTmFtZX07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwbHVnaW4oKSB7XG4gICAgcmV0dXJuIChmaWxlcywgbWV0YWxzbWl0aCwgZG9uZSkgPT57XG4gICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IG1ldGFsc21pdGguZGVzdGluYXRpb24oKTtcbiAgICAgIGNvbnN0IG91dHB1dFBhdGggPSB0aGlzLmNvbXBpbGVyLm9wdGlvbnMub3V0cHV0LnBhdGg7XG5cbiAgICAgIGlmIChwYXRoLnJlbGF0aXZlKGRlc3RpbmF0aW9uLCBvdXRwdXRQYXRoKS5zdGFydHNXaXRoKCcuLi8nKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICdXZWJwYWNrIG91dHB1dCBwYXRoIGlzIG91dHNpZGUgb2YgbWV0YWxzbWl0aCBkZXN0aW5hdGlvbi4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWV0YWxzbWl0aCA9IG1ldGFsc21pdGg7XG4gICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG5cbiAgICAgIGNvbnNvbGUubG9nKGBcXG4ke2NoYWxrLm1hZ2VudGEoJ1ttZXRhbHNtaXRoLXdlYnBhY2tdJyl9IGNvbXBpbGluZy4uLmApO1xuXG4gICAgICB0aGlzLmNvbXBpbGVyLnJ1bihkb25lKTtcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBNZXRhbHNtaXRoV2VicGFjayhvcHRpb25zKS5wbHVnaW4oKTtcbn1cbiJdfQ==