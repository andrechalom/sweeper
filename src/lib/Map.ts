import Layer from "./Layer";
//import SpriteManager from "./SpriteManager";
import Cell from "./Cell";
import * as Utils from "./utils";

export default class Map {
    // constant traits
    private _height: number;
    private _width: number;
    private _bombs: number;

    // objects
    private _cells: Layer<Cell>;

    /**
     * Performs the specified function on every tile
     * @param {Function} callback The function to be applied. Must accept (x, y) as map coordinates
     */
    inEveryTile(callback: (x: number, y: number)=> void): void {
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                callback(x, y);
            }
        }
    }

    /**
     * Performs the specified function on every tile in the map and sums over the result
     * @param {Function} callback The function to be applied. Must accept (x, y) as map coordinates
     * @return {number} The sum of the function returns
     */
    sumInEveryTile(callback: (x: number, y: number)=> number): number {
        let ret = 0;

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                ret += callback(x, y);
            }
        }
        return ret;
    }

    /**
     * Performs the specified function in a region of the map and sums over the results
     * @param {number} centerX Center of the region (x coordinate)
     * @param {number} centerY Center of the region (y coordinate)
     * @param {number} radius Size of the region in tiles
     * @param {Function} callback The function to be applied. Must accept (x, y) as map coordinates
     * @return {number} The sum of the function returns
     */
    inRegion(
        centerX: number,
        centerY: number,
        radius: number,
        callback: (x: number, y: number)=> number
    ): number {
        let ret = 0;
        for (let x = Math.max(0, centerX - radius); x <= Math.min(this._width - 1, centerX + radius); x++) {
            for (let y = Math.max(0, centerY - radius); y <= Math.min(this._height - 1, centerY + radius); y++) {
                ret += callback(x, y);
            }
        }
        return ret;
    }

    /**
     * Returns a cell at coordinates x, y
     */
    getCell(x: number, y: number): Cell {
        return this._cells.get(x, y);
    }

    constructor(/*game: GameScene, */ width: number, height: number, bombs: number) {
        // initialize basic attributes
        // this.game = game;
        // creating a new map
        // basic checks
        if (width < 2 || height < 2 || width > 1000 || height > 1000) {
            throw new Error("Invalid map width or height: must be between 2 and 1000");
        }
        if (bombs < 1 || bombs > width * height / 2) {
            throw new Error("Invalid bomb number, must be between 1 and " +  width * height / 2);
        }

        this._width = width;
        this._height = height;
        this._bombs = bombs;

        this._cells = new Layer<Cell>(height, width);
        this.inEveryTile((x, y) => this._cells.set(x, y, new Cell));

        this.addBombs(bombs);
    }

    addBombs(bombs: number): void {
        // Puts some neutral cities on the map
        for (let i = 0; i < bombs; i++) {
            let position = this.randomBombPosition();
            if (position) {
                this._cells.get(position.x, position.y).setBomb();
            }
        }
    }

    randomBombPosition(): {x: number, y: number} | false {
        let x: number, y: number;
        let tried = 0;
        do {
            if (tried++ > 100) {
                return false;
            }

            x = Math.floor(Utils.random() * (this._width - 1));
            y = Math.floor(Utils.random() * (this._height - 1));
        } while (this.getCell(x, y).isBomb);
        return {x: x, y: y};
    }

    get height(): number {
        return this._height;
    }
    get width(): number {
        return this._width;
    }
    get bombs(): number {
        return this._bombs;
    }
}
