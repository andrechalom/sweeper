import {strict as assert} from "assert";
import Map from "../src/lib/Map";
import Random from "../src/lib/Random";

describe("Map", () => {
    it("invalid maps", () => {
        assert.throws(() => new Map(-1, 2, 0), new Error("Invalid map width or height: must be between 2 and 1000"));
        assert.throws(() => new Map(2, 2, 0), new Error("Invalid bomb number, must be between 1 and 2"));
        assert.throws(() => new Map(4, 5, 12), new Error("Invalid bomb number, must be between 1 and 10"));
    });

    it("creates a map", () => {
        let myMap = new Map(8, 10, 10);
        assert.strictEqual(myMap.width, 8);
        assert.strictEqual(myMap.height, 10);
        let bombs = myMap.sumInEveryTile((x, y) => myMap.getCell(x, y).isBomb ? 1 : 0);
        assert.strictEqual(bombs, 10);
    });

    it("opens some spots and sweeps the map until game is finished", () => {
        // Setting the random seed so the map is always the same
        Random.seed = 42;
        let myMap = new Map(8, 10, 5);
        assert.strictEqual(myMap.openCells, 0); // no open cells
        myMap.open(1, 0);
        assert.strictEqual(myMap.openCells, 1); // a single open cell
        myMap.open(5, 4);
        assert.strictEqual(myMap.openCells, 33); // cells opened and recursed
        myMap.sweep();
        assert.strictEqual(myMap.openCells, 33); // sweeping does not open cells
        myMap.chord();
        assert.strictEqual(myMap.openCells, 73); // a lot of progress!
        myMap.sweep();
        myMap.chord();
        myMap.sweep();
        assert.strictEqual(myMap.openCells, 75); // game completed!
        myMap.print();
    });

});
