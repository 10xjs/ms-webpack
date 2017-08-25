'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-env mocha */


var _metalsmith = require('metalsmith');

var _metalsmith2 = _interopRequireDefault(_metalsmith);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _rimraf = require('rimraf');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _lib = require('../../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  context: 'test/fixture/src',
  entry: './js/index.js',
  stats: {
    colors: false
  },
  output: {
    path: 'test/build',
    publicPath: 'http://example.com/assets/',
    filename: '[name].js'
  }
};

describe('metalsmith-webpack', function () {
  afterEach(function () {
    (0, _rimraf.sync)('test/build');
  });

  it('should resolve paths', function () {
    var resolvePaths = _lib.MetalsmithWebpack.resolvePaths;
    var resolved = resolvePaths(config);

    _assert2.default.equal(_path2.default.resolve(config.context), resolved.context);
    _assert2.default.equal(_path2.default.resolve(config.output.path), resolved.output.path);
  });

  it('should output files', function (done) {
    var files = ['main.js'];

    (0, _metalsmith2.default)('test').source('fixture/src').destination('build').ignore('js').use((0, _lib2.default)(_extends({}, config, { stats: { json: true } }))).build(function (err) {
      if (err) return done(err);
      _assert2.default.deepEqual((0, _fs.readdirSync)('test/build'), files);
      return done();
    });
  });

  it('should set metadata', function (done) {
    var metadata = {
      assets: {
        'main.js': 'http://example.com/assets/main.js',
        'main.map': 'http://example.com/assets/main.js.map'
      },
      assetsByType: {
        js: ['http://example.com/assets/main.js'],
        map: ['http://example.com/assets/main.js.map']
      }
    };

    var m = (0, _metalsmith2.default)('test').source('fixture/src').destination('build').ignore('js').use((0, _lib2.default)(_extends({}, config, { devtool: 'source-maps' })));

    m.build(function (err) {
      if (err) return done(err);
      _assert2.default.deepEqual(m.metadata().webpack, metadata);
      return done();
    });
  });

  it('should throw error if output path is outside of metalsmith destination', function (done) {
    (0, _metalsmith2.default)('test').source('fixture/src').destination('foo').ignore('js').use((0, _lib2.default)(config)).build(function (err) {
      _assert2.default.equal(err.message, 'Webpack output path is outside of metalsmith destination.');
      done();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qvc3BlYy9pbmRleC5zcGVjLmpzIl0sIm5hbWVzIjpbImNvbmZpZyIsImNvbnRleHQiLCJlbnRyeSIsInN0YXRzIiwiY29sb3JzIiwib3V0cHV0IiwicGF0aCIsInB1YmxpY1BhdGgiLCJmaWxlbmFtZSIsImRlc2NyaWJlIiwiYWZ0ZXJFYWNoIiwiaXQiLCJyZXNvbHZlUGF0aHMiLCJyZXNvbHZlZCIsImVxdWFsIiwicmVzb2x2ZSIsImRvbmUiLCJmaWxlcyIsInNvdXJjZSIsImRlc3RpbmF0aW9uIiwiaWdub3JlIiwidXNlIiwianNvbiIsImJ1aWxkIiwiZXJyIiwiZGVlcEVxdWFsIiwibWV0YWRhdGEiLCJhc3NldHMiLCJhc3NldHNCeVR5cGUiLCJqcyIsIm1hcCIsIm0iLCJkZXZ0b29sIiwid2VicGFjayIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O2tRQUFBOzs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxXQUFTLGtCQURJO0FBRWJDLFNBQU8sZUFGTTtBQUdiQyxTQUFPO0FBQ0xDLFlBQVE7QUFESCxHQUhNO0FBTWJDLFVBQVE7QUFDTkMsVUFBTSxZQURBO0FBRU5DLGdCQUFZLDRCQUZOO0FBR05DLGNBQVU7QUFISjtBQU5LLENBQWY7O0FBYUFDLFNBQVMsb0JBQVQsRUFBK0IsWUFBTTtBQUNuQ0MsWUFBVSxZQUFNO0FBQ2Qsc0JBQU8sWUFBUDtBQUNELEdBRkQ7O0FBSUFDLEtBQUcsc0JBQUgsRUFBMkIsWUFBTTtBQUMvQixRQUFNQyxlQUFlLHVCQUFrQkEsWUFBdkM7QUFDQSxRQUFNQyxXQUFXRCxhQUFhWixNQUFiLENBQWpCOztBQUVBLHFCQUFPYyxLQUFQLENBQWEsZUFBS0MsT0FBTCxDQUFhZixPQUFPQyxPQUFwQixDQUFiLEVBQTJDWSxTQUFTWixPQUFwRDtBQUNBLHFCQUFPYSxLQUFQLENBQWEsZUFBS0MsT0FBTCxDQUFhZixPQUFPSyxNQUFQLENBQWNDLElBQTNCLENBQWIsRUFBK0NPLFNBQVNSLE1BQVQsQ0FBZ0JDLElBQS9EO0FBQ0QsR0FORDs7QUFRQUssS0FBRyxxQkFBSCxFQUEwQixVQUFDSyxJQUFELEVBQVU7QUFDbEMsUUFBTUMsUUFBUSxDQUFDLFNBQUQsQ0FBZDs7QUFFQSw4QkFBVyxNQUFYLEVBQ0dDLE1BREgsQ0FDVSxhQURWLEVBRUdDLFdBRkgsQ0FFZSxPQUZmLEVBR0dDLE1BSEgsQ0FHVSxJQUhWLEVBSUdDLEdBSkgsQ0FJTyxnQ0FBc0JyQixNQUF0QixJQUE4QkcsT0FBTyxFQUFDbUIsTUFBTSxJQUFQLEVBQXJDLElBSlAsRUFLR0MsS0FMSCxDQUtTLFVBQUNDLEdBQUQsRUFBUztBQUNkLFVBQUlBLEdBQUosRUFBUyxPQUFPUixLQUFLUSxHQUFMLENBQVA7QUFDVCx1QkFBT0MsU0FBUCxDQUFpQixxQkFBWSxZQUFaLENBQWpCLEVBQTRDUixLQUE1QztBQUNBLGFBQU9ELE1BQVA7QUFDRCxLQVRIO0FBVUQsR0FiRDs7QUFlQUwsS0FBRyxxQkFBSCxFQUEwQixVQUFDSyxJQUFELEVBQVU7QUFDbEMsUUFBTVUsV0FBVztBQUNmQyxjQUFRO0FBQ04sbUJBQVcsbUNBREw7QUFFTixvQkFBWTtBQUZOLE9BRE87QUFLZkMsb0JBQWM7QUFDWkMsWUFBSSxDQUFDLG1DQUFELENBRFE7QUFFWkMsYUFBSyxDQUFDLHVDQUFEO0FBRk87QUFMQyxLQUFqQjs7QUFXQSxRQUFNQyxJQUFJLDBCQUFXLE1BQVgsRUFDUGIsTUFETyxDQUNBLGFBREEsRUFFUEMsV0FGTyxDQUVLLE9BRkwsRUFHUEMsTUFITyxDQUdBLElBSEEsRUFJUEMsR0FKTyxDQUlILGdDQUFzQnJCLE1BQXRCLElBQThCZ0MsU0FBUyxhQUF2QyxJQUpHLENBQVY7O0FBTUFELE1BQUVSLEtBQUYsQ0FBUSxVQUFDQyxHQUFELEVBQVM7QUFDZixVQUFJQSxHQUFKLEVBQVMsT0FBT1IsS0FBS1EsR0FBTCxDQUFQO0FBQ1QsdUJBQU9DLFNBQVAsQ0FBaUJNLEVBQUVMLFFBQUYsR0FBYU8sT0FBOUIsRUFBdUNQLFFBQXZDO0FBQ0EsYUFBT1YsTUFBUDtBQUNELEtBSkQ7QUFLRCxHQXZCRDs7QUF5QkFMLEtBQUcsd0VBQUgsRUFDRSxVQUFDSyxJQUFELEVBQVU7QUFDUiw4QkFBVyxNQUFYLEVBQ0dFLE1BREgsQ0FDVSxhQURWLEVBRUdDLFdBRkgsQ0FFZSxLQUZmLEVBR0dDLE1BSEgsQ0FHVSxJQUhWLEVBSUdDLEdBSkgsQ0FJTyxtQkFBa0JyQixNQUFsQixDQUpQLEVBS0d1QixLQUxILENBS1MsVUFBQ0MsR0FBRCxFQUFTO0FBQ2QsdUJBQU9WLEtBQVAsQ0FDRVUsSUFBSVUsT0FETixFQUVFLDJEQUZGO0FBSUFsQjtBQUNELEtBWEg7QUFZRCxHQWRIO0FBZ0JELENBckVEIiwiZmlsZSI6ImluZGV4LnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG1vY2hhICovXG5pbXBvcnQgTWV0YWxzbWl0aCBmcm9tICdtZXRhbHNtaXRoJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCB7c3luYyBhcyBybVN5bmN9IGZyb20gJ3JpbXJhZic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7cmVhZGRpclN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCBtZXRhbHNtaXRoV2VicGFjaywge01ldGFsc21pdGhXZWJwYWNrfSBmcm9tICcuLi8uLi9saWInO1xuXG5jb25zdCBjb25maWcgPSB7XG4gIGNvbnRleHQ6ICd0ZXN0L2ZpeHR1cmUvc3JjJyxcbiAgZW50cnk6ICcuL2pzL2luZGV4LmpzJyxcbiAgc3RhdHM6IHtcbiAgICBjb2xvcnM6IGZhbHNlLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICBwYXRoOiAndGVzdC9idWlsZCcsXG4gICAgcHVibGljUGF0aDogJ2h0dHA6Ly9leGFtcGxlLmNvbS9hc3NldHMvJyxcbiAgICBmaWxlbmFtZTogJ1tuYW1lXS5qcycsXG4gIH0sXG59O1xuXG5kZXNjcmliZSgnbWV0YWxzbWl0aC13ZWJwYWNrJywgKCkgPT4ge1xuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHJtU3luYygndGVzdC9idWlsZCcpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlc29sdmUgcGF0aHMnLCAoKSA9PiB7XG4gICAgY29uc3QgcmVzb2x2ZVBhdGhzID0gTWV0YWxzbWl0aFdlYnBhY2sucmVzb2x2ZVBhdGhzO1xuICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZVBhdGhzKGNvbmZpZyk7XG5cbiAgICBhc3NlcnQuZXF1YWwocGF0aC5yZXNvbHZlKGNvbmZpZy5jb250ZXh0KSwgcmVzb2x2ZWQuY29udGV4dCk7XG4gICAgYXNzZXJ0LmVxdWFsKHBhdGgucmVzb2x2ZShjb25maWcub3V0cHV0LnBhdGgpLCByZXNvbHZlZC5vdXRwdXQucGF0aCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgb3V0cHV0IGZpbGVzJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBmaWxlcyA9IFsnbWFpbi5qcyddO1xuXG4gICAgTWV0YWxzbWl0aCgndGVzdCcpXG4gICAgICAuc291cmNlKCdmaXh0dXJlL3NyYycpXG4gICAgICAuZGVzdGluYXRpb24oJ2J1aWxkJylcbiAgICAgIC5pZ25vcmUoJ2pzJylcbiAgICAgIC51c2UobWV0YWxzbWl0aFdlYnBhY2soey4uLmNvbmZpZywgc3RhdHM6IHtqc29uOiB0cnVlfX0pKVxuICAgICAgLmJ1aWxkKChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGRvbmUoZXJyKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyZWFkZGlyU3luYygndGVzdC9idWlsZCcpLCBmaWxlcyk7XG4gICAgICAgIHJldHVybiBkb25lKCk7XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgbWV0YWRhdGEnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG1ldGFkYXRhID0ge1xuICAgICAgYXNzZXRzOiB7XG4gICAgICAgICdtYWluLmpzJzogJ2h0dHA6Ly9leGFtcGxlLmNvbS9hc3NldHMvbWFpbi5qcycsXG4gICAgICAgICdtYWluLm1hcCc6ICdodHRwOi8vZXhhbXBsZS5jb20vYXNzZXRzL21haW4uanMubWFwJyxcbiAgICAgIH0sXG4gICAgICBhc3NldHNCeVR5cGU6IHtcbiAgICAgICAganM6IFsnaHR0cDovL2V4YW1wbGUuY29tL2Fzc2V0cy9tYWluLmpzJ10sXG4gICAgICAgIG1hcDogWydodHRwOi8vZXhhbXBsZS5jb20vYXNzZXRzL21haW4uanMubWFwJ10sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBtID0gTWV0YWxzbWl0aCgndGVzdCcpXG4gICAgICAuc291cmNlKCdmaXh0dXJlL3NyYycpXG4gICAgICAuZGVzdGluYXRpb24oJ2J1aWxkJylcbiAgICAgIC5pZ25vcmUoJ2pzJylcbiAgICAgIC51c2UobWV0YWxzbWl0aFdlYnBhY2soey4uLmNvbmZpZywgZGV2dG9vbDogJ3NvdXJjZS1tYXBzJ30pKTtcblxuICAgIG0uYnVpbGQoKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGRvbmUoZXJyKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobS5tZXRhZGF0YSgpLndlYnBhY2ssIG1ldGFkYXRhKTtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdGhyb3cgZXJyb3IgaWYgb3V0cHV0IHBhdGggaXMgb3V0c2lkZSBvZiBtZXRhbHNtaXRoIGRlc3RpbmF0aW9uJyxcbiAgICAoZG9uZSkgPT4ge1xuICAgICAgTWV0YWxzbWl0aCgndGVzdCcpXG4gICAgICAgIC5zb3VyY2UoJ2ZpeHR1cmUvc3JjJylcbiAgICAgICAgLmRlc3RpbmF0aW9uKCdmb28nKVxuICAgICAgICAuaWdub3JlKCdqcycpXG4gICAgICAgIC51c2UobWV0YWxzbWl0aFdlYnBhY2soY29uZmlnKSlcbiAgICAgICAgLmJ1aWxkKChlcnIpID0+IHtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgICAgICBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICdXZWJwYWNrIG91dHB1dCBwYXRoIGlzIG91dHNpZGUgb2YgbWV0YWxzbWl0aCBkZXN0aW5hdGlvbi4nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgKTtcbn0pO1xuIl19