'use strict'
const mergeSubscribers = require('./lib/mergeSubscribers')
const updatecsv = require('./lib/updatecsv')
import { mergeConfig, updateOptions, result } from './lib/types'

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

exports.updatecsv = (options: updateOptions): Promise<result> => updatecsv.main(options)
