export default class SpriteManager {
    private static game: Phaser.Scene;

    /** 
     * Registers the "game"
     */
    public static register(game: Phaser.Scene): void {
        SpriteManager.game = game;
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
        return 32 * i;
    }

    public static tileToWorldY(i: number): number {
        return 32 * (i + 1);
    }
}