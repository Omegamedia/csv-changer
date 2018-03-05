'use strict'
import * as fs from 'fs'
import { result } from './types'

exports.writeFile = (data: string, filename: string, path: string): Promise<result> => new Promise((resolve, reject) => {
    fs.writeFile(path + filename, data, 'utf8', err => {
        if(err) {
            reject({
                err: err,
                ok: false
            })
        } else {
            resolve({
                ok:  true,
                message: `${filename} created successfully`
            })
        }

    })
})