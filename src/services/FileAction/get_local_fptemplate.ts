import { dataEncryption } from "./data_encryption";

export function localFpTemplate(data): string[] {
    let arr: string[] = [];
    data.forEach(element => {arr.push(dataEncryption(element['fpid']));});
    console.log('Fptemplate length : ',arr.length)
    return arr;
}