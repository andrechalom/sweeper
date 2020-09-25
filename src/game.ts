import "phaser";
// import * as Utils from "./lib/Random";
import NewGameScene from "./scenes/NewGameScene";

const gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#125555",
    width: 30 * Utils.FRAMESIZE,
    height: 20 * Utils.FRAMESIZE, // 18 + top + bottom panels
    pixelArt: true,
    scene: [NewGameScene]
};

new Phaser.Game(gameConfig);