import "phaser";
import NewGameScene from "./scenes/NewGameScene";

const gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#125555",
    width: 30 * 32,
    height: 20 * 32, // 18 + top + bottom panels
    pixelArt: true,
    scene: [NewGameScene]
};

new Phaser.Game(gameConfig);