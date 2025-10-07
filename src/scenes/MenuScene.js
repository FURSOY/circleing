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

        this.registry.set('aiMode', 'NEW');

        const aiModeText = this.add.text(width / 2, height / 2 + 80, `AI: ${this.registry.get('aiMode')}`, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#555555',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        aiModeText.on('pointerdown', () => {
            const currentMode = this.registry.get('aiMode');
            const newMode = currentMode === 'NEW' ? 'CLASSIC' : 'NEW';
            this.registry.set('aiMode', newMode);
            aiModeText.setText(`AI: ${newMode}`);
        });

        this.registry.set('showSlowRadius', false);

        const slowRadiusText = this.add.text(width / 2, height / 2 + 140, `Slow Radius: ${this.registry.get('showSlowRadius') ? 'ON' : 'OFF'}` , {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#555555',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        slowRadiusText.on('pointerdown', () => {
            const currentSetting = this.registry.get('showSlowRadius');
            this.registry.set('showSlowRadius', !currentSetting);
            slowRadiusText.setText(`Slow Radius: ${!currentSetting ? 'ON' : 'OFF'}`);
        });

        this.add.text(10, height - 10, 'FURSOY', {
            fontSize: '24px',
            color: '#aaaaaa'
        }).setOrigin(0, 1);
    }
}