'use strict';

const path = require('path');
const fs = require('fs');
const filewalker = require('filewalker');
const types = require('ast-types');
const { transformFileSync } = require('babel-core');
const { ResolverFactory, NodeJsInputFileSystem, CachedInputFileSystem } = require('enhanced-resolve');
const defaultOptions = require('./defaultOptions');
const merge = require('lodash.merge');
const { writeArrayToFile } = require('./utils');

const FindOrphanedFiles = (passedOptions = {}) => {
    const options = merge({}, defaultOptions, passedOptions);
    const resolver = ResolverFactory.createResolver(options.resolveOptions);
    const files = [];
    const orphanedFiles = [];
    const validFiles = [];
    let allFailedRequires = [];

    filewalker(options.root, { matchRegExp: options.fileRegex })
        .on('file', _path => {
            const { ast } = transformFileSync(_path, options.babelOptions);
            const requires = [];
            const failedRequires = [];

            types.visit(ast, {
                visitCallExpression(path) {
                    if (path.value.callee.name === 'require' && path.value.arguments[0].value) {
                        requires.push(path.value.arguments[0].value)
                    }

                    this.traverse(path);
                }
            });

            requires.forEach(req => {
                let filePath = req;
                if (req[0] === '.') {
                    filePath = path.resolve(path.dirname(_path), req);
                }

                allFailedRequires = [...allFailedRequires, ...failedRequires];

                if (failedRequires.length) {
                    orphanedFiles.push(_path);
                } else {
                    validFiles.push(_path);
                }
            })
        })
        .on('done', () => {
            console.log('Checked', orphanedFiles.length + validFiles.length, 'files');
            console.log('Found', orphanedFiles.length, 'orphaned files');

            writeArrayToFile(options.fileName, orphanedFiles);
            writeArrayToFile(`${options.fileName}-failed-requires`, allFailedRequires);
        })
        .walk();
};

module.exports = FindOrphanedFiles;
