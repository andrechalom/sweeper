import {strict as assert} from "assert";
import Map from "../src/lib/Map";

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

});
