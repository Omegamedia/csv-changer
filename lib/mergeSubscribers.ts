'use strict'
import { mergeConfig, result } from './types'


export default (config: mergeConfig): Promise<result> => new Promise( async (resolve, reject) => {
    let status, newfiles
    try {
        newfiles = await merge(config.toMerge)
    }
    catch(err) {
        reject({
            ok: false,
            err: err
        })
    }
    resolve({
        ok: true
    })
})


const merge = (files: string[]) : Promise<result> => new Promise((resolve, reject) => {






    resolve({
        ok: true
    })
})