# orphan-finder
Find orhpaned files in your project, that is, files who have missing dependencies

## Features
This package will crawl your files identifying any files that have faulty require statements.
A file containing an array of these "orphaned files" will be created along with a file that identifies the require statements that actually failed.

This package uses [babel-core](https://github.com/babel/babel/tree/7.0/packages/babel-core) to transform each file and generate it's ast, which is how `require` statements are extracted. Options can be passed to `babel-core` using `options.babelOptions`.

This package uses [enhanced-resolve](https://github.com/webpack/enhanced-resolve) to check if each `require` statement is valid. Options can be passed to `enhanced-resolve` via `options.resolveOptions`. This is the same package used by [webpack](https://webpack.js.org/) to resolve modules and additional information on it's usage can be found [here](https://webpack.js.org/configuration/resolve/)

## Installation:
```sh
# Using yarn
yarn add orphan-finder --dev

# Using npm
npm install orphan-finder --save-dev
```

## Usage:
After installing this package to your project, create a new .js file and require the package in it. In the file, call the required package with any desired options. Finally, run the file from the command line to generate the list of orphaned files and failed requires.

You can customize your usage with the following options:

| Option  | Type | Default Value | More Details |
| ------- | -----| ------------- |--------------|
| globPattern | string | '*\*\/\*.\*'  | [node-glob](https://github.com/isaacs/node-glob#glob-primer) |
| globIgnore | string \| array[string] | 'node_modules\/**' | [node-glob](https://github.com/isaacs/node-glob#glob-primer) |
| babelOptions | object | {} | [babel](https://babeljs.io/docs/core-packages/#options) |
| resolveOptions | object | See below | [enhanced-resolve](https://github.com/webpack/enhanced-resolve#resolver-options) |
| resolveOptions.modules | array[string] | ['node_modules'] | [enhanced-resolve](https://github.com/webpack/enhanced-resolve#resolver-options) |
| resolveOptions.extensions | array[string] | ['.js', '.jsx', '.json', '.html'] | [enhanced-resolve](https://github.com/webpack/enhanced-resolve#resolver-options) |

###### Example:
```js
// Example filename: scripts/findOrphanedFiles.js
// Require the package
const finder = require('orphan-finder');

// Define your custom options
// These options will be merged with the default options
// You are not required to pass any options if the default options work for you
const options = {
    babelOptions: {
        presets: [
            require.resolve('babel-preset-es2015-node4'),
            require.resolve('babel-preset-react')
        ],
        plugins: [require.resolve('babel-plugin-transform-object-rest-spread')]
    },
    resolveOptions: {
        modules: ['node_modules', './src']
    }
}

finder(options);
```

Now just run this file from your terminal and the output files will be generated:
```bash
~ node ./scripts/findOrphanedFiles.js
...
Checked 959 files
Found 12 orphaned files
orphaned-files.txt created
orphaned-files-failed-requires.txt created
```

