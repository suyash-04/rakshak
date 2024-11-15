export function scaleToRangeForAccident(number: number): number {
    const min = 1;
    const max = 31;
    const intensity =  ((number - min) / (number + max) )*100;
    return intensity;
}