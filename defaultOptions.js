'use strict';

module.exports = {
    globPattern: '**/*.*',
    globIgnore: ['node_modules/**'],
    babelOptions: {},
    resolveOptions: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.json', '.html']
    },
    fileName: 'orphaned-files'
};
