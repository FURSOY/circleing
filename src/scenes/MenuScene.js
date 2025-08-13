import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2 - 50, 'Circle Game', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const startText = this.add.text(width / 2, height / 2 + 20, 'Start', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
