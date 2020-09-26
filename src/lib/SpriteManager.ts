export default class SpriteManager {
    private static offset: {x: number, y: number};
    private static tileSize: number;
    private static game: Phaser.Scene;

    /** 
     * Registers the "game"
     */
    public static register(game: Phaser.Scene): void {
        SpriteManager.game = game;
    }

    public static setOffset(offset: {x: number, y: number}): void {
        SpriteManager.offset = offset;
    }

    public static setTilesize(tileSize: number): void {
        SpriteManager.tileSize = tileSize;
    }

    public static makeSprite(key: string, frame: number, x: integer, y: integer, depth: number): Phaser.GameObjects.Sprite {
        if (SpriteManager.game === undefined) {
            // Not properly initialized!
            return undefined;
        }
        let sprite = SpriteManager.game.add.sprite(
            SpriteManager.tileToWorldX(x),
            SpriteManager.tileToWorldY(y), key, frame);
        sprite.setOrigin(0, 0).setDepth(depth);
        return sprite;
    }

    public static tileToWorldX(i: number): number {
        return SpriteManager.tileSize * (i + SpriteManager.offset.x);
    }

    public static tileToWorldY(i: number): number {
        return SpriteManager.tileSize * (i + SpriteManager.offset.y);
    }
}