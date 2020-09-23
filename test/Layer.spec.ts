import {strict as assert} from "assert";
import Layer from "../src/lib/Layer";

describe("Layer", () => {
    it("invalid layers", () => {
        assert.throws(() => new Layer<number>(-1, 2, 0), new Error("Invalid height for Layer: -1"));
        assert.throws(() => new Layer<number>(1, -2, 0), new Error("Invalid width for Layer: -2"));
    });

    it("creates an empty layer", () => {
        let myLayer = new Layer<number>(2, 2);
        assert.strictEqual(myLayer.get(1, 1), null);
    });

    it("creates a filled layer", () => {
        let myLayer = new Layer<number>(2, 2, 175);
        myLayer.set(1, 0, 99);
        assert.strictEqual(myLayer.get(1, 1), 175);
        assert.strictEqual(myLayer.get(1, 0), 99);
        assert.strictEqual(myLayer.get(-1, -1), null);
    });
});        
