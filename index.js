'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const types = require('ast-types');
const { transformFileSync } = require('babel-core');
const node = require('enhanced-resolve/lib/node');
const merge = require('lodash.merge');
const { writeArrayToFile } = require('./utils');
const defaultOptions = require('./defaultOptions');

const FindOrphanedFiles = (passedOptions = {}) => {
    const options = merge({}, defaultOptions, passedOptions);
    const resolveSync = node.create.sync(options.resolveOptions);
    const orphanedFiles = [];
    const validFiles = [];
    let allFailedRequires = [];

    const files = glob.sync(options.globPattern, { ignore: options.globIgnore });

    files.forEach(_path => {
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
            let filePath = path.dirname(_path);
            if (req[0] !== '.') {
                filePath = process.cwd();
            }

            try {
                resolveSync(filePath, req);
            } catch (e) {
                failedRequires.push(req);
            }
        });

        allFailedRequires = [...allFailedRequires, ...failedRequires];

        if (failedRequires.length) {
            orphanedFiles.push(_path);
        } else {
            validFiles.push(_path);
        }
    });

    console.log('Checked', orphanedFiles.length + validFiles.length, 'files');
    console.log('Found', orphanedFiles.length, 'orphaned files');

    writeArrayToFile(options.fileName, orphanedFiles);
    writeArrayToFile(`${options.fileName}-failed-requires`, allFailedRequires);
};

module.exports = FindOrphanedFiles;
