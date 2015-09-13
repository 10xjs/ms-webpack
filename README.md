# metalsmith-webpack

A [webpack][webpack] plugin for [Metalsmith][metalsmith].

## Installation

add to your package.js dependencies
```json
"metalsmith-webpack": "https://github.com/nealgranger/metalsmith-webpack.git#master"
```

## Usage

```js
var webpack = require('metalsmith-webpack')

var config = {
  context: './src/assets/js/',
  entry: './index.js',
  output: {
    path: './build',
    path: '/js',
     filename: 'bundle.js'
   }
}

Metalsmith(__dirname)
  .src('./src')
  .ignore('assets')
  .use(webpack(config))
  .dest('./build')
  .build()
```

### Options

See the [webpack configuration][webpack configuration] documentation for details.

## Development

```
$ npm run dev
```

## License

MIT License, see [LICENSE][license] for details.

[metalsmith]: http://www.metalsmith.io/
[license]: https://github.com/nealgranger/metalsmith-webpack/blob/master/LICENSE.md
[webpack]: http://webpack.github.io/
[webpack configuration]: http://webpack.github.io/docs/configuration.html
