import Map from './lib/Map';
let tries = 100000;
let configs = [
    {w: 9, h: 9, b: 10, name: "Beginner"},
    {w: 16, h: 16, b: 40, name: "Intermediate"},
    {w: 16, h: 30, b: 99, name: "Expert"}
];
configs.forEach((c) => {
    let solved = 0;
    for (let i = 0; i < tries; i++) {
        let myMap = new Map(c.w, c.h, c.b);
        myMap.bestSolve();
        if (myMap.openCells == myMap.targetOpen) {
            solved++;
        }
    }
    console.log(c.name + ' solved: ' + (100 * solved / tries) + ' %');
});
