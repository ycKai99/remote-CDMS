import { dataEncryption } from "./dataencryption";

export function filterLocalFPIDArray(data): string[] {
    let arr: string[] = [];
    // data.forEach(element => {arr.push(dataEncryption(element['fpid']));});
    data.forEach(element => {arr.push(element['fpid']);});
    console.log('Fptemplate length : ',arr.length)
    return arr;
}