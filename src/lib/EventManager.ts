import GameScene from "../scenes/GameScene";

export default class EventManager {
    private static game: GameScene;

    /** 
     * Registers the "game"
     */
    public static register(game: GameScene): void {
        EventManager.game = game;
    }

    public static sendGameOver(): void {
        if (EventManager.game === undefined) {
            // Not properly initialized!
            return;
        }
        console.log("EVENT BOOM");
        this.game.gameOver = true;
    }
}