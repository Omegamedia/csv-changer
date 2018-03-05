'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mergeSubscribers = require('./lib/mergeSubscribers');
const updatecsv = require('./lib/updatecsv');
/*
class CsvChanger {
    constructor(public config: config) {
        this.config = config
    }
    test(str: string ) { return test(str) }
}

module.exports = (config: config) => new CsvChanger(config)
*/
// exports.mergeSubscribers = (config: mergeConfig ) => mergeSubscribers(config)
exports.updatecsv = (options) => updatecsv.main(options);
