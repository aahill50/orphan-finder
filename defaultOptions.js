'use strict';

const { NodeJsInputFileSystem, CachedInputFileSystem } = require('enhanced-resolve');
const nodeFileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000);

module.exports = {
    root: '.',
    fileRegex: /^((?!node_modules).)*\.jsx?$/gi,
    babelOptions: {},
    resolveOptions: {
        useSyncFileSystemCalls: true,
        fileSystem: nodeFileSystem,
        unsafeCache: true,
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.json', '.html']
    },
    fileName: 'orphaned-files'
};
