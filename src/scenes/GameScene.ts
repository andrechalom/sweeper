
import Map from "../lib/Map";
import Layer from "../lib/Layer";
import SpriteManager from "../lib/SpriteManager";
import Cell from "../lib/Cell";
import EventManager from "../lib/EventManager";

export default class GameScene extends Phaser.Scene {
    config: {width: number; height: number, bombs: number};
    map: Map;
    sprites: Layer<Phaser.GameObjects.Sprite>;
    gameOver = false;
    alien: Phaser.GameObjects.Sprite;
    ai: Phaser.GameObjects.Sprite;

    constructor() {
        super({key: "GameScene"});
    }

    init(config: {width: number; height: number, bombs: number}): void {
        this.config = config;
    }

    preload(): void {
        let frameSize = {frameWidth: 32, frameHeight: 32};
        this.load.spritesheet("tileset", "img/tiles.png", frameSize);
    }

    create(): void {
        // Initializes the managers
        SpriteManager.register(this);
        EventManager.register(this);
        SpriteManager.setTilesize(32);
        SpriteManager.setOffset({x: (30 - this.config.width) / 2, y: 1.5});

        this.alien = this.add.sprite(14.5 * 32, 5, "tileset", 16);
        this.alien.setOrigin(0, 0);
        this.alien.setInteractive({cursor: "pointer"});
        this.alien.on("pointerdown", () => {
            for (let i = 0; i < this.config.width; i++) {
                for (let j = 0; j < this.config.height; j++) {
                    this.sprites.get(i, j).destroy();
                }
            }
            this.newgame();
        });

        this.ai = this.add.sprite(18.5 * 32, 5, "tileset", 14);
        this.ai.setOrigin(0, 0);
        this.ai.setInteractive({cursor: "pointer"});
        this.ai.on("pointerdown", () => {
            this.map.shallowSolve();
            this.updateSprites();
        });

        this.newgame();
    }

    newgame(): void {
        this.gameOver = false;
        this.map = new Map(this.config.width, this.config.height, this.config.bombs);
        // Adds graphics and sets the terrain layer as "clickable"
        this.sprites = new Layer<Phaser.GameObjects.Sprite>(this.map.height, this.map.width);
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                //make sprite for (i,j)
                let mySprite = SpriteManager.makeSprite("tileset", 0, i, j, 0);
                mySprite.setInteractive();
                mySprite.on('pointerdown', (pointer: any) => {
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
                    }
                    // middle click chords
                    if (pointer.button == 1) {
                        this.map.chord(i, j);
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
        this.updateSprites();
    }

    updateSprites(): void {
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                let myCell = this.map.getCell(i, j);
                let frame = this.frameFromCell(myCell);
                this.sprites.get(i, j).setFrame(frame);
            }
        }
        if (this.gameOver) {
            this.alien.setFrame(17);
            return;
        }
        if (this.map.openCells == this.map.targetOpen) {
            this.alien.setFrame(18);
            return;
        }
        this.alien.setFrame(16);
    }

    frameFromCell(cell: Cell): number {
        // special case: if the game is over, we show all bombs and errors
        if (this.gameOver) {
            if (cell.isBomb && ! cell.isFlagged) {
                if (cell.isOpen) {
                    return 12;
                }
                return 10;
            }
            if (cell.isFlagged && ! cell.isBomb) {
                return 13;
            }
        }
        // normal scenario:
        if (! cell.isOpen) {
            if (cell.isFlagged) {
                return 11;
            }
            return 0;
        }
        if (cell.isBomb) {
            return 12; // should never arrive here, but just in case...
        }
        return cell.bombNeighbors + 1;
    }
}
