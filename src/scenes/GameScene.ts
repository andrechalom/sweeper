
import Map from "../lib/Map";
import Layer from "../lib/Layer";
import SpriteManager from "../lib/SpriteManager";
import Cell from "../lib/Cell";

export default class GameScene extends Phaser.Scene {
    map: Map;
    sprites: Layer<Phaser.GameObjects.Sprite>;
    gameOver = false;

    constructor() {
        super({key: "GameScene"});
    }

    init(data: {width: number; height: number, bombs: number}): void {
        this.map = new Map(data.width, data.height, data.bombs);
    }

    preload(): void {
        let frameSize = {frameWidth: 32, frameHeight: 32};
        this.load.spritesheet("tileset", "img/tiles.png", frameSize);
    }

    create(): void {
        // Initializes the sprite manager
        SpriteManager.register(this);

        // Adds graphics and sets the terrain layer as "clickable"
        this.sprites = new Layer<Phaser.GameObjects.Sprite>(this.map.height, this.map.width);
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                //make sprite for (i,j)
                let mySprite = SpriteManager.makeSprite("tileset", 0, i, j, 0);
                mySprite.setInteractive();
                mySprite.on('pointerdown', (pointer: any) => {
                    console.log(pointer)
                    if (this.gameOver) {
                        // no more interacting for you
                        return;
                    }
                    // left click opens
                    if (pointer.button == 0) {
                        if (this.map.getCell(i, j).isFlagged) {
                            // prevents opening a flagged bomb
                            return;
                        }
                        this.map.open(i, j);
                        if (this.map.getCell(i, j).isBomb) {
                            this.gameOver = true;
                        }
                    }
                    // middle click chords
                    if (pointer.button == 1) {
                        this.map.chord();
                    }
                    // right click flags
                    if (pointer.button == 2) {
                        this.map.getCell(i, j).toggleFlagged();
                    }
                    this.updateSprites();
                });
                this.sprites.set(i, j, mySprite);
            }
        }
    }

    updateSprites(): void {
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                let myCell = this.map.getCell(i, j);
                let frame = this.frameFromCell(myCell);
                this.sprites.get(i, j).setFrame(frame);
            }
        }
    }
    frameFromCell(cell: Cell): number {
        if (! cell.isOpen) {
            if (cell.isFlagged) {
                return 11;
            }
            return 0;
        }
        if (cell.isBomb) {
            return 10;
        }
        return cell.bombNeighbors + 1;
    }
}
