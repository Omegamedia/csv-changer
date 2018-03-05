'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mergeSubscribers = require('./lib/mergeSubscribers');
const updateCsv = require('./lib/updateCsv');
/*
class CsvChanger {
    constructor(public config: config) {
        this.config = config
    }
    test(str: string ) { return test(str) }
}

module.exports = (config: config) => new CsvChanger(config)
*/
exports.mergeSubscribers = (config) => mergeSubscribers(config);
exports.updateCsv = (options) => updateCsv(options);
