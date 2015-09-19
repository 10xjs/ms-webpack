import webpack from 'webpack';
import path from 'path';
import MemoryFs from 'memory-fs';
import supportsColor from 'supports-color';
import chalk from 'chalk';

export class DestinationError extends Error {
  constructor(destination, outputPath) {
    super();
    this.message = 'Webpack output path is outside of metalsmith destination';
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.destination = destination;
    this.outputPath = outputPath;
  }
};

export class MetalsmithWebpack {

  constructor(options) {
    options = MetalsmithWebpack.resolvePaths(options);

    options.watch = false;

    this.compiler = webpack(options);
    this.compiler.outputFileSystem = new MemoryFs();

    this.compiler.plugin('after-emit', (compilation, callback) => {
      this.compiler.purgeInputFileSystem();

      this.compilation = compilation;

      this.setFiles();
      this.setMetadata();

      MetalsmithWebpack.printStats(compilation, options);

      callback();
    });
  }

  static resolvePaths(options) {
    return {
      ...options,
      context: path.resolve(options.context || process.cwd()),
      output: {
        ...options.output,
        path: path.resolve(options.output.path)
      }
    };
  }

  static printStats(compilation, options) {
    let stats = compilation.getStats();
    let outputOptions = this.getDefaultOutputOptions(options);

    if (outputOptions.json) {
      console.log();
      console.log(JSON.stringify(stats.toJson(outputOptions), null, 2));
      console.log();
    } else if (stats.hash !== this.lastHash) {
      this.lastHash = stats.hash;
      let prefix = `${chalk.magenta('[metalsmith-webpack]')} `;
      let output = stats.toString(outputOptions).split('\n').join('\n' + prefix);
      console.log(prefix + output);
      console.log();
    }
  }

  static getDefaultOutputOptions(options) {
    let defaultOutputOptions = {
      colors: supportsColor,
      chunks: true,
      modules: true,
      chunkModules: true,
      reasons: true,
      cached: true,
      cachedAssets: true
    };

    if (options.stats && !options.stats.json) {
      defaultOutputOptions = {
        ...defaultOutputOptions,
        cached: false,
        cachedAssets: false,
        exclude: ['node_modules', 'bower_components', 'jam', 'components']
      };
    }

    return {
      ...defaultOutputOptions,
      ...(options.stats || {})
    };
  }

  setMetadata() {
    var assetsByChunkName = this.compilation.getStats().toJson().assetsByChunkName;
    let publicPath = this.compiler.options.output.publicPath || '';

    let assets = Object.keys(assetsByChunkName).reduce((reduced, chunkName) => {
      let chunkAsset = assetsByChunkName[chunkName];

      if (Array.isArray(chunkAsset)) {
        let chunkAssets = chunkAsset.reduce((chunkObj, file) => {
          chunkObj[chunkName + path.extname(file)] = path.join(publicPath, file);
          return chunkObj;
        }, {});
        return {
          ...reduced,
          ...chunkAssets
        };
      }

      reduced[chunkName + path.extname(chunkAsset)] = path.join(publicPath, chunkAsset);
      return reduced;
    }, {});

    let assetsByType = Object.keys(this.compilation.assets).reduce((reduced, assetName) => {
      let ext = path.extname(assetName).replace(/^\./, '');
      reduced[ext] = (reduced[ext] || []).concat([path.join(publicPath, assetName)]);
      return reduced;
    }, {});

    this.metalsmith.metadata().webpack = { assets, assetsByType };
  }

  setFiles() {
    let fs = this.compiler.outputFileSystem;
    Object.keys(this.compilation.assets).forEach(outname => {
      let asset = this.compilation.assets[outname];

      if (asset.emitted) {
        let fileName = asset.existsAt;
        let name = path.relative(this.metalsmith.destination(), fileName);
        let contents = fs.readFileSync(fileName);
        this.files[name] = { contents, fileName };
      }
    });
  }

  plugin() {
    return (files, metalsmith, done) =>{
      let destination = metalsmith.destination();
      let outputPath = this.compiler.options.output.path;

      if (path.relative(destination, outputPath).startsWith('../')) {
        throw new DestinationError(destination, outputPath);
      }

      this.metalsmith = metalsmith;
      this.files = files;

      console.log(`\n${chalk.magenta('[metalsmith-webpack]')} compiling...`);

      this.compiler.run(done);
    };
  }
}

export default function(options) {
  return new MetalsmithWebpack(options).plugin();
};
