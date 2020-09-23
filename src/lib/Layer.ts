export default class Layer<T> {
    height: number;
    width: number;
    map: T[][];

    constructor(height: number, width: number, fill: T = null) {
        if (!Number.isInteger(height) || height < 0) {
            throw new Error("Invalid height for Layer: " + height);
        }
        if (!Number.isInteger(width) || width < 0) {
            throw new Error("Invalid width for Layer: " + width);
        }
        this.height = height;
        this.width = width;
        this.map = new Array(height);
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = Array(width).fill(fill);
        }
    }

    /**
     * Returns whatever is in position x,y of the layer, or `null` if out-of-bounds
     */
    get(x: number, y: number): T {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) { 
            return null;
        }
        return this.map[y][x];
    }

    set(x: number, y: number, value: T): void{
        this.map[y][x] = value;
    }
}