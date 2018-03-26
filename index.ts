'use strict'
const mergeSubscribers = require('./lib/mergeSubscribers')
const updatecsv = require('./lib/updatecsv')
import { mergeConfig, updateOptions, result } from './lib/types'


// exports.mergeSubscribers = (config: mergeConfig ) => mergeSubscribers(config)

exports.updatecsv = (options: updateOptions): Promise<result> => updatecsv.main(options)
