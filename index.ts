'use strict'
const mergeSubscribers = require('./lib/mergeSubscribers')
const updateCsv = require('./lib/updateCsv')
import { mergeConfig, updateOptions } from './lib/types'

/*
class CsvChanger {
    constructor(public config: config) {
        this.config = config
    }
    test(str: string ) { return test(str) }
}

module.exports = (config: config) => new CsvChanger(config)
*/


exports.mergeSubscribers = (config: mergeConfig ) => mergeSubscribers(config)

exports.updateCsv = (options: updateOptions) => updateCsv(options)
