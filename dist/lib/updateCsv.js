'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const es = require('event-stream');
const writeFile = require('./file');
/**
 * Create array of header values
 * @param str First line of csv
 * @param delimiter csv delimiter
 */
const getHeader = (str, delimiter = ',') => str.split(delimiter);
const matchNameGetIndex = (value) => (index, name, i) => value === name ? i : index;
/**
 * Create line without modifications
 * In use for consistency
 * @param str First line of csv
 * @param delimiter csv delimiter
 */
const createSimpleLine = (str, delimiter = ',') => {
    let array = str.split(delimiter);
    let length = array.length;
    let newstring = array.reduce(createLineFromArr, '');
    return newstring;
};
/**
 *
 * @param string line
 * @param value current value in array
 * @param i index
 * @param original original array
 */
const createLineFromArr = (string, value, i, original) => {
    if (i === length - 1) {
        string += `${value}\n`;
    }
    else {
        string += `${value};`;
    }
    return string;
};
/**
 * Modify line
 * @param str Line from original csv
 * @param options config options
 */
const createNewLine = (str, options, constants) => {
    let delimiter = options.delimiter || ',';
    let type = options.type;
    let arr = str.split(delimiter);
    let newline = str;
    if (type === "move_inside") {
        newline = move_inside(arr, options, constants);
    }
    return newline;
};
/**
 * Get constant variables needed for file transformation
 * @param str First line
 * @param options config options
 */
const createConstants = (str, options) => {
    let delimiter = options.delimiter || ',';
    let array = str.split(delimiter);
    let constants = {};
    if (options.type === "move_inside") {
        // Type move_inside = move variable from inside kolumn to new kolumn
        /* TODO: only yet supported type */
        constants = {
            indexA: array.reduce(matchNameGetIndex(options.options.columnA || ""), 0),
            indexB: array.reduce(matchNameGetIndex(options.options.columnB || ""), 0)
        };
    }
    return constants;
};
/**
 * Main func
 * Update csv file
 */
exports.default = (options) => new Promise((resolve, reject) => {
    let newfilename = options.newfilename || `${options.filename}_new.csv`;
    let index = 0;
    let newstring = '';
    let header = [];
    let constants = {};
    let s = fs.createReadStream(options.filename)
        .pipe(es.split())
        .pipe(es.mapSync((line) => {
        s.pause();
        /* If first line */
        if (index === 0) {
            newstring += createSimpleLine(line, options.delimiter);
            header = getHeader(line, options.delimiter);
            constants = createConstants(line, options);
        }
        else {
            /*  Create new lines */
            newstring += createNewLine(line, options, constants);
        }
        index++;
        s.resume();
    }))
        .on('error', (err) => {
        reject({
            ok: false,
            message: "Something went wrong",
            err: err
        });
    })
        .on('end', () => {
        writeFile(newstring, options.newfilename, options.path)
            .then((success) => resolve(success))
            .catch((err) => reject(err));
    });
});
/* Down here is all the types */
/**
 * Used when you want to move a value from inside a column to another column
 * @param arr from line
 * @param options user options
 * @param constants constants created from first line
 */
const move_inside = (arr, options, constants) => {
    /* Possible error, need fix */
    let func = (str) => str;
    if (options.options.findValue) {
        func = options.options.findValue;
    }
    let foundValue = "";
    if (constants.indexA) {
        foundValue = func(arr[constants.indexA]) || "";
    }
    if (constants.indexB) {
        arr[constants.indexB] = foundValue;
    }
    return arr.reduce(createLineFromArr, '');
};
