export const FRAMESIZE = 32;

const urlParams = new URLSearchParams(window.location.search);
let seed = parseInt(urlParams.get("seed"));

if (Number.isNaN(seed)) {
    let date  = new Date();
    seed = Math.round(date.getTime() / 1000 | 0);
}
// eslint-disable-next-line no-console
console.log("Map random seed: " + seed);

export function random(): number {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}