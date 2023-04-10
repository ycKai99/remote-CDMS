export function localFpid(data): string[] {
    let arr: string[] = [];
    data.forEach(element => {arr.push(element['uuid']);});
    return arr;
}