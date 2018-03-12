'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const es = require('event-stream');
const writeFile = require('./file').writeFile;
const getHeader = (str, delimiter = ',') => str.split(delimiter);
const matchMultipleIndexes = (array, indexes) => indexes.map(index => array.reduce(matchNameGetIndex(index || ""), 0));
const matchNameGetIndex = (value) => (index, name, i) => value == name.replace(/"/g, "").replace(/'/g, "") ? i : index;
const createSimpleLine = (str, delimiter = ',', excel = false, quotes = true) => {
    let array = str.split(delimiter);
    let newstring = array.reduce(createLineFromArr(delimiter, excel, quotes), '');
    return newstring;
};
const createLineFromArr = (delimiter = ',', excel = false, quotes = true, maxCharacters) => (string, value, i, original) => {
    const modifyString = (str) => {
        if (maxCharacters) {
            if (maxCharacters.indexesForMaxCharacters.filter((x, y) => y === i).length > 0) {
                return str.substring(0, maxCharacters.maxCharacters);
            }
        }
        return str;
    };
    const wrap = (str) => {
        let string = str.replace(/"/g, "");
        if (excel) {
            return `"=""${str.replace(/"/g, "")}"""`;
        }
        else {
            return quotes ? `"${str.replace(/"/g, "")}"` : `${str.replace(/"/g, "")}`;
        }
    };
    if (i === original.length - 1) {
        string += `${wrap(value)}\n`;
    }
    else {
        string += `${wrap(value)};`;
    }
    return modifyString(string);
};
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
const createModify = (array, options, constants) => {
    let indexesForMaxCharacter = [];
    console.log('createModify');
    console.log('options:', JSON.stringify(options, null, 2));
    if (typeof options.modify != "undefined") {
        console.log('1');
        if (options.modify.maxForAll) {
            console.log('2');
            indexesForMaxCharacter = array.map((x, i) => i);
        }
        else if (typeof options.modify.maxFor != 'undefined') {
            console.log('3');
            let maxfor = options.modify.maxFor || [];
            console.log(maxfor);
            indexesForMaxCharacter = array.reduce((indexes, name, index) => {
                console.log(name);
                let match = maxfor.filter(x => x === name.replace(/"/g, "")).length > 0;
                if (match) {
                    return indexes.concat([index]);
                }
                else {
                    return indexes;
                }
            }, indexesForMaxCharacter);
        }
    }
    console.log('indexes', indexesForMaxCharacter);
    if (indexesForMaxCharacter.length > 0) {
        return Object.assign({}, constants, {
            indexesForMaxCharacter: indexesForMaxCharacter
        });
    }
    else {
        return constants;
    }
};
const createConstants = (str, options) => {
    let delimiter = options.delimiter || ',';
    let array = str.split(delimiter);
    let constants = {};
    if (options.type === "move_inside") {
        constants = {
            indexA: array.reduce(matchNameGetIndex(options.options.columnA || ""), 0),
            indexB: array.reduce(matchNameGetIndex(options.options.columnB || ""), 0),
            multipleIndexes: matchMultipleIndexes(array, options.options.columnsA || [])
        };
    }
    let contstantsWithModify = createModify(array, options, constants);
    console.log('Csv-Changer options => ', contstantsWithModify);
    return contstantsWithModify;
};
const main = (options) => new Promise((resolve, reject) => {
    let newfilename = options.newfilename || `${options.filename}_new.csv`;
    let index = 0;
    let newstring = '';
    let header = [];
    let constants = {};
    let path = `${options.path}${options.filename}`;
    try {
        let s = fs.createReadStream(path)
            .pipe(es.split())
            .pipe(es.mapSync((line) => {
            s.pause();
            if (index === 0) {
                newstring += createSimpleLine(line, options.delimiter, options.excel, options.quotes);
                header = getHeader(line, options.delimiter);
                constants = createConstants(line, options);
            }
            else {
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
const move_inside = (arr, options, constants) => {
    let func = (str) => str;
    if (typeof options.options.findValue === 'function') {
        func = options.options.findValue;
    }
    let foundValue = "";
    if (constants.multipleIndexes) {
        let value = constants.multipleIndexes.map(i => func(arr[i])).filter(index => index !== "")[0] || "";
        if (value !== "") {
            foundValue = value;
        }
    }
    else if (constants.indexA) {
        if (arr[constants.indexA]) {
            foundValue = func(arr[constants.indexA]);
        }
    }
    if (constants.indexB) {
        if (arr[constants.indexB]) {
            arr[constants.indexB] = foundValue;
        }
    }
    return arr.reduce(createLineFromArr(options.delimiter, options.excel, options.quotes, constants.maxCharacters), '');
};
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
