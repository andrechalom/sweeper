import Map from './lib/Map';
import Random from './lib/Random';

Random.seed = 42;
let myMap = new Map(16, 30, 99);
myMap.open(15, 15);
myMap.print();
console.log('Open: ' + myMap.openCells + '/' + myMap.targetOpen);
myMap.shallowSolve();
myMap.print();
console.log('Open: ' + myMap.openCells + '/' + myMap.targetOpen);