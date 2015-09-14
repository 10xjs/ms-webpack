"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _memoryFs = require("memory-fs");

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _supportsColor = require("supports-color");

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

exports["default"] = function (options) {
  var _metalsmith = undefined;
  var _files = undefined;

  options = _extends({}, options, {
    context: _path2["default"].resolve(options.context || process.cwd()),
    output: _extends({}, options.output, {
      path: _path2["default"].resolve(options.output.path || process.cwd())
    }),
    watch: false
  });

  var defaultOutputOptions = {
    colors: _supportsColor2["default"],
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
      exclude: ["node_modules", "bower_components", "jam", "components"]
    });
  }

  var outputOptions = _extends({}, defaultOutputOptions, options.stats || options.stats || {});

  var compiler = (0, _webpack2["default"])(options);
  var fs = compiler.outputFileSystem = new _memoryFs2["default"]();
  var lastHash = null;

  compiler.plugin("after-emit", function (compilation, callback) {
    Object.keys(compilation.assets).forEach(function (outname) {
      var asset = compilation.assets[outname];
      var filePath = asset.existsAt;
      var name = _path2["default"].relative(_metalsmith.destination(), filePath);

      if (asset.emitted) {
        var contents = fs.readFileSync(filePath);
        _files[name] = {};
        _files[name].contents = contents;
        _files[name].fileName = filePath;
      }
    });

    _metalsmith.write(_files, function (err) {
      console.log();
      Object.keys(_files).forEach(function (fileName) {
        console.log(_chalk2["default"].magenta("[metalsmith-webpack]") + " writing " + _chalk2["default"].cyan(fileName));
      });
      if (err) {
        callback(err);
      }
      callback();
    });
  });

  return function (files, metalsmith, done) {

    if (!options.entry || !options.output.filename) {
      return done(null, files);
    }

    _metalsmith = metalsmith;
    _files = {};

    console.log("\n" + _chalk2["default"].magenta("[metalsmith-webpack]") + " starting");

    options = _extends({}, options, {
      context: _path2["default"].resolve(options.context || process.cwd()),
      output: _extends({}, options.output, {
        path: _path2["default"].resolve(options.output.path || process.cwd())
      }),
      watch: false
    });

    compiler.run(function (err, stats) {
      if (err) {
        return done(err);
      }

      if (outputOptions.json) {
        console.log();
        console.log(JSON.stringify(stats.toJson(outputOptions), null, 2));
        console.log();
      } else if (stats.hash !== lastHash) {
        lastHash = stats.hash;
        var prefix = "\n" + _chalk2["default"].magenta("[metalsmith-webpack]") + " ";
        var output = stats.toString(outputOptions).split("\n").join(prefix);
        console.log(prefix + output);
        console.log();
      }

      files = _extends({}, _files, {
        files: files
      });

      done(null, files);
    });
  };
};

;
module.exports = exports["default"];
//# sourceMappingURL=metalsmith-webpack.js.map