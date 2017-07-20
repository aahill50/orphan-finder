'use strict';

const fs = require('fs');
const path = require('path');

module.exports.writeArrayToFile = (fileName, arr) => {
    const fileWithExt = fileName + '.txt';
    fs.writeFileSync(path.resolve(process.cwd(), fileWithExt), JSON.stringify(arr, null, 2));
    console.log(fileWithExt, 'created');
};
