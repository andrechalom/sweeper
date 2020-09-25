export default class Random {
    private static _seed: number;
    public static get(): number {
        let x = Math.sin(Random._seed++) * 10000;
        return x - Math.floor(x);
    }
    public static set seed(seed: number) {
        // eslint-disable-next-line no-console
        console.log("Map random seed: " + seed);
        Random._seed = seed;
    }
}

const urlParams = new URLSearchParams(window.location.search);
let seed = parseInt(urlParams.get("seed"));

if (Number.isNaN(seed)) {
    let date  = new Date();
    seed = Math.round(date.getTime() / 1000 | 0);
}
Random.seed = seed;