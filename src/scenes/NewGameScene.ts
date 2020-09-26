import GameScene from "./GameScene";

export default class NewGameScene extends Phaser.Scene {

    constructor() {
        super({key: "NewGameScene"});
    }

    preload(): void {
        //this.load.image("panel", "img/panel.png");
        //this.load.image("close", "img/close.png");
    }

    scenename = "NewGameScene";
    headertext = "Welcome to Sweeper!";
    
    create(): void {
        let textOpts = {font: "24px Arial", fill: "#000000"};

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //let backdrop = this.add.image(210, 120, "panel").setOrigin(0, 0);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let title = this.add.text(300, 180, this.headertext, textOpts);
        let options = ["Beginner", "Intermediate", "Expert"];
        let y = 210;

        options.forEach(key => {
            textOpts.fill = "#000000";
            let width: number;
            let height: number;
            let bombs: number;

            let mytext = this.add.text(325, y, key, textOpts);
            mytext.setInteractive({cursor: "pointer"});
            mytext.on("pointerdown", () => {
                switch (key) {
                case "Beginner":
                    width = height = 9;
                    bombs = 10;
                    break;
                case "Intermediate":
                    width = height = 16;
                    bombs = 40;
                    break;
                default:
                    height = 16;
                    width = 30;
                    bombs = 99;
                }
                // game start
                this.scene.add("GameScene", GameScene, true, {width: width, height: height, bombs: bombs});
                this.scene.remove("NewGameScene");
            });
            y += 35;
        });
    }
}