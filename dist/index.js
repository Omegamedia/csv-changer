'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mergeSubscribers = require('./lib/mergeSubscribers');
const updatecsv = require('./lib/updatecsv');
exports.updatecsv = (options) => updatecsv.main(options);
