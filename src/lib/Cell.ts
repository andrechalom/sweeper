import "phaser";
// import MapGenerator from "./MapGenerator";
// import SpriteManager from "./SpriteManager";

export default class Cell {
    private _isOpen = false;
    private _isBomb = false;
    private _isFlagged = false;
    private _bombNeighbors = 0;
    sprite: Phaser.GameObjects.Sprite;
    // map: MapGenerator;

    constructor() {
        // blank
    }

    makeSprite(): void {
        if (this.sprite === undefined) {
            // this.sprite = SpriteManager.makeSprite("terrain", this.sprite_frame, this.x, this.y, 10);
        }
    }

    destroySprite(): void {
        if (this.sprite !== undefined) {
            this.sprite.destroy();
        }
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    get isBomb(): boolean {
        return this._isBomb;
    }

    setBomb(): void {
        this._isBomb = true;
    }

    setOpen(): void {
        this._isOpen = true;
    }

    get bombNeighbors(): number {
        return this._bombNeighbors;
    }

    set bombNeighbors(ammount: number) {
        this._bombNeighbors = ammount;
    }

    get isFlagged(): boolean {
        return this._isFlagged;
    }

    toggleFlagged(): void {
        this._isFlagged = ! this._isFlagged;
    }
}
