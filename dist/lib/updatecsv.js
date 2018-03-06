'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const es = require('event-stream');
const writeFile = require('./file').writeFile;
/**
 * Create array of header values
 * @param str First line of csv
 * @param delimiter csv delimiter
 */
const getHeader = (str, delimiter = ',') => str.split(delimiter);
const matchNameGetIndex = (value) => (index, name, i) => value == name.replace(/"/g, "").replace(/'/g, "") ? i : index;
/**
 * Create line without modifications
 * In use for consistency
 * @param str First line of csv
 * @param delimiter csv delimiter
 */
const createSimpleLine = (str, delimiter = ',') => {
    let array = str.split(delimiter);
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
    if (i === original.length - 1) {
        string += `="${value.replace(/"/g, "")}"\n`;
    }
    else {
        string += `="${value.replace(/"/g, "")}";`;
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
    console.log(options.options);
    if (options.type === "move_inside" /*&& checkOptions("move_inside", options)*/) {
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
const main = (options) => new Promise((resolve, reject) => {
    let newfilename = options.newfilename || `${options.filename}_new.csv`;
    let index = 0;
    let newstring = '';
    let header = [];
    let constants = {};
    let path = `${options.path}${options.filename}`;
    console.log('Finding file ', path);
    try {
        let s = fs.createReadStream(path)
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
    }
    catch (err) {
        reject({
            ok: false,
            message: "something went wrong",
            err: err
        });
    }
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
    if (typeof options.options.findValue === 'function') {
        func = options.options.findValue;
    }
    // console.log('Function: ', func.toString())
    let foundValue = "";
    console.log('constants: ', constants);
    if (constants.indexA) {
        if (arr[constants.indexA]) {
            console.log('Running func');
            foundValue = func(arr[constants.indexA]);
        }
    }
    if (constants.indexB) {
        if (arr[constants.indexB]) {
            arr[constants.indexB] = foundValue;
        }
    }
    return arr.reduce(createLineFromArr, '');
};
/**
 * Check if type has all the options required
 */
const checkOptions = (type, options) => {
    let check = false;
    if (type === "move_inside") {
        check = options.options.findValue &&
            (options.options.columnA || options.options.indexA) &&
            (options.options.columnB || options.options.indexB) ?
            true : false;
    }
    if (!check) {
        console.log('Missing options | csv-changer');
    }
    return check;
};
exports.main = main;
