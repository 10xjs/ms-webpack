/* eslint-disable */
var Metalsmith = require('metalsmith');
var assert = require('assert');
var webpack = require('..');
var rm = require('rimraf').sync;
var path = require('path');
var fs = require('fs');
var assertDirEqual = require('assert-dir-equal')

console.log(path.resolve(__dirname, 'fixture/src'));

var config = {
  context: 'test/fixture/src',
  entry: './js/index.js',
  output: {
    path: 'test/build',
    publicPath: "http://cdn.example.com/assets/[hash]/",
    filename: 'js/[name].js'
  },
  devtool: 'source-map'
}

var metadata = {
  assets: {
    'main.js': 'http://cdn.example.com/assets/c06919e5a1001b7c1ed5/js/main.js',
    'main.map': 'http://cdn.example.com/assets/c06919e5a1001b7c1ed5/js/main.js.map'
  },
  assetsByType: {
    js: [ 'http://cdn.example.com/assets/c06919e5a1001b7c1ed5/js/main.js' ],
    map: [ 'http://cdn.example.com/assets/c06919e5a1001b7c1ed5/js/main.js.map' ]
  }
}

describe('metalsmith-webpack', function() {
  afterEach(function() {
    rm('test/build');
  });

  it('should resolve paths', function() {
    var resolvePaths = require('../dist/').MetalsmithWebpack.resolvePaths;
    var resolved = resolvePaths(config);

    assert.equal(path.resolve(config.context), resolved.context);
    assert.equal(path.resolve(config.output.path), resolved.output.path);
  });

  it('should output files', function(done) {
    var m = Metalsmith(__dirname)
      .source('fixture/src')
      .destination('build')
      .ignore('js')
      .use(webpack(config))
      .build(function(err, files){
        if (err) return done(err);
        assertDirEqual('test/fixture/build', 'test/build');
        done();
      });
  });

  it('should set metadata', function(done) {
    var m = Metalsmith(__dirname)
      .source('fixture/src')
      .destination('build')
      .ignore('js')
      .use(webpack(config));

    m.build(function(err, files){
      if (err) return done(err);
      assert.deepEqual(m.metadata().webpack, metadata);
      done();
    });
  });

  it('should throw error if output path is outside of metalsmith destination', function(done) {
    var m = Metalsmith(__dirname)
      .source('fixture/src')
      .destination('foo')
      .ignore('js')
      .use(webpack(config))
      .build(function(err, files) {
        assert.equal(err.name, 'DestinationError');
        done();
      });
  });
});
