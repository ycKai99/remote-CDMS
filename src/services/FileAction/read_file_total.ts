import fs = require('graceful-fs')
import { makeDirectory } from './create_directory'

export function readFileTotal(folder: string) {
    let num = 0;
    try {
        const files = fs.readdirSync(folder);
        num = files.length
      } catch (err) {
        console.log('err is ',err)
            if(err.code === "ENOENT" || err.code === undefined) { // if folder does not exist
                console.log('err code')
                makeDirectory(folder.substring(0, folder.length-1)) // create folder
            }
      }
    return num
}