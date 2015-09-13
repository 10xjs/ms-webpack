import webpack from "webpack";
import path from "path";
import MemoryFs from "memory-fs";
import supportsColor from "supports-color";
import chalk from "chalk"

export default function(options) {
  return function(files, metalsmith, done) {

    if (!options.entry || !options.output.filename) {
      return done(null, files);
    }

    console.log();
    console.log(`${chalk.magenta("[metalsmith-webpack]")} starting`);

    options = {
      ...options,
      context: path.resolve(options.context || process.cwd()),
      output: {
        ...options.output,
        path: path.resolve(options.output.path || process.cwd())
      },
      watch: false
    };

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
        exclude: ["node_modules", "bower_components", "jam", "components"]
      };
    }

    let outputOptions = {
      ...defaultOutputOptions,
      ...(options.stats || options.stats || {})
    };

    let lastHash = null;
    function compilerCallback(err, stats) {
      if (!options.watch) {
        // Do not keep cache anymore
        compiler.purgeInputFileSystem();
      }

      if (err) {
        lastHash = null;
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      if (outputOptions.json) {
        console.log();
        console.log(JSON.stringify(stats.toJson(outputOptions), null, 2));
        console.log();
      } else if (stats.hash !== lastHash) {
        lastHash = stats.hash;
        let prefix = `\n${chalk.magenta("[metalsmith-webpack]")} `;
        let output = stats.toString(outputOptions).split("\n").join(prefix);
        console.log(prefix + output);
        console.log();
      }
    }

    let compiler = webpack(options, compilerCallback);

    let fs = compiler.outputFileSystem = new MemoryFs();

    compiler.plugin("after-emit", function (compilation, callback) {

      let newFiles = {};

      console.log();

      Object.keys(compilation.assets).forEach(function(outname) {
        let asset = compilation.assets[outname];
        let filePath = asset.existsAt;
        let name = path.relative(metalsmith.destination(), filePath);

        if (asset.emitted) {
          let contents = fs.readFileSync(filePath);
          files[name] = files[name] || {};
          files[name].contents = contents;
          files[name].fileName = filePath;

          newFiles[name] = files[name];
          console.log(`${chalk.magenta("[metalsmith-webpack]")} writing ${chalk.cyan(filePath)}`);
        }
      });

      metalsmith.write(newFiles, function(err) {
        if (err) {
          done(err);
        } else {
          done(null, files);
        }

        callback();
      });
    });
  };
};
