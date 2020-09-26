export default class Cell {
    private _isOpen = false;
    private _isBomb = false;
    private _isFlagged = false;
    private _bombNeighbors = 0;

    constructor() {
        // blank
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
        if (this.isOpen) {
            return;
        }
        this._isFlagged = ! this._isFlagged;
    }
}
