'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.writeFile = (data, filename, path) => new Promise((resolve, reject) => {
    fs.writeFile(path + filename, data, 'utf8', err => {
        if (err) {
            reject({
                err: err,
                ok: false
            });
        }
        else {
            resolve({
                ok: true,
                message: `${filename} created successfully`
            });
        }
    });
});
