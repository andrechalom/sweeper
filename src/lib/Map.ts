import Layer from "./Layer";
import Cell from "./Cell";
import Random from "./Random";
import EventManager from "./EventManager";

export default class Map {
    // constant traits
    private _height: number;
    private _width: number;
    private _bombs: number;
    gameOver = false;

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
     */
    inRegion(
        centerX: number,
        centerY: number,
        radius: number,
        callback: (x: number, y: number)=> void
    ): void {
        for (let x = Math.max(0, centerX - radius); x <= Math.min(this._width - 1, centerX + radius); x++) {
            for (let y = Math.max(0, centerY - radius); y <= Math.min(this._height - 1, centerY + radius); y++) {
                callback(x, y);
            }
        }
    }

    /**
     * Performs the specified function in a region of the map and sums over the results
     * @param {number} centerX Center of the region (x coordinate)
     * @param {number} centerY Center of the region (y coordinate)
     * @param {number} radius Size of the region in tiles
     * @param {Function} callback The function to be applied. Must accept (x, y) as map coordinates
     * @return {number} The sum of the function returns
     */
    sumInRegion(
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

    constructor(width: number, height: number, bombs: number) {
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

        // Initializes the map
        this._cells = new Layer<Cell>(height, width);
        this.inEveryTile((x, y) => this._cells.set(x, y, new Cell));
        this.addBombs(bombs);
        // Saves a "cache" of how many neighbors are bombs
        this.inEveryTile((x, y) => {
            this.getCell(x, y).bombNeighbors = this.sumInRegion(x, y, 1, (xx, yy) => {
                return this.getCell(xx, yy).isBomb ? 1 : 0;
            });
        });
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

            x = Math.floor(Random.get() * (this._width - 1));
            y = Math.floor(Random.get() * (this._height - 1));
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

    get openCells(): number {
        return this.sumInEveryTile((x, y) => this.getCell(x, y).isOpen ? 1 : 0);
    }

    get targetOpen(): number {
        return this.height * this.width - this.bombs;
    }

    /**
     * Marks the designated location as open, and recurses into neighbors if possible.
     * 
     * @param x X coordinate
     * @param y Y coordinate
     */
    open(x: number, y: number): void {
        let cell = this.getCell(x, y);
        if (cell.isOpen) {
            return;
        }
        if (cell.isFlagged) {
            return;
        }
        cell.setOpen();
        if (cell.isBomb) {
            this.gameOver = true;
            EventManager.sendGameOver();
        }
        // recursive open if this is a sweet zero
        if (cell.bombNeighbors === 0) {
            this.inRegion(x, y, 1, (xx, yy) => this.open(xx, yy));
        }
    }

    /**
     * Flags all of the obvious bombs
     */
    sweep(): void {
        this.inEveryTile((x, y) => {
            let cell = this.getCell(x, y);
            let bombNeighbors = cell.bombNeighbors;
            let closedNeighbors = this.sumInRegion(x, y, 1, (xx, yy) => {
                return this.getCell(xx, yy).isOpen ? 0 : 1;
            });
            if (bombNeighbors === closedNeighbors) {
                // Flags all closed neighbors as bombs
                this.inRegion(x, y, 1, (xx, yy) => {
                    let bomb = this.getCell(xx, yy);
                    if (! bomb.isOpen && ! bomb.isFlagged) {
                        bomb.toggleFlagged();
                    }
                });
            }
        });
    }
    
    /**
     * Opens all neighbors that cannot be bombs
     */
    chord(x: number, y: number): void {
        let cell = this.getCell(x, y);
        if (!cell.isOpen) {
            return;
        }
        let bombNeighbors = cell.bombNeighbors;
        let flaggedNeighbors = this.sumInRegion(x, y, 1, (xx, yy) => {
            return this.getCell(xx, yy).isFlagged ? 1 : 0;
        });
        if (bombNeighbors === flaggedNeighbors) {
            // opens all non-flagged neighbors
            this.inRegion(x, y, 1, (xx, yy) => {
                let cell2 = this.getCell(xx, yy);
                if (! cell2.isOpen && ! cell2.isFlagged) {
                    this.open(xx, yy);
                }
            });
        }
    }

    /**
     * Opens all cells that cannot be bombs
     */
    chordAll(): void {
        this.inEveryTile((x, y) => {
            this.chord(x, y);
        });
    }

    shallowSolve(): void {
        let initialOpen = this.openCells;
        this.sweep();
        this.chordAll();
        if (this.openCells !== initialOpen) {
            this.shallowSolve();
        }
    }

    bestSolve(): void {
        if (this.gameOver) {
            return;
        }
        let initialOpen = this.openCells;
        if (initialOpen === 0) {
            // for first guess, we open a corner, which has a slightly better chance of being a zero
            this.open(0, 0);
            return this.bestSolve();
        }
        // currently, shallow solve is the best we have, but we will expand this
        this.shallowSolve();
        // pattern finding will go here
        if (this.openCells === initialOpen) {
            this.simpleGuess();
        }
        if (this.openCells !== this.targetOpen) {
            this.bestSolve();
        }
    }

    simpleGuess(): void {
        let x: number, y: number;
        do {
            x = Math.floor(Random.get() * (this._width - 1));
            y = Math.floor(Random.get() * (this._height - 1));
        } while (this.getCell(x, y).isOpen);
        this.open(x, y);
    }

    // for debugging purposes
    print(): void {
        let cell: Cell;
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                cell = this.getCell(i, j);
                if (cell.isFlagged) {
                    process.stdout.write('B');
                    continue;
                }
                if (!cell.isOpen) {
                    process.stdout.write('*');
                    continue;
                }
                process.stdout.write(cell.bombNeighbors.toString());
            }
            process.stdout.write("\n");
        }
    }
}
