import Phaser from 'phaser';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import BigEnemy from '../objects/BigEnemy';
import FastEnemy from '../objects/FastEnemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.waveConfigs = [
            { small: 30 },
            { small: 50, big: 5 },
            { small: 50, fast: 20 },
            { small: 75, fast: 40, big: 20 },
        ];
    }

    create() {
        const { width, height } = this.scale;
        this.player = new Player(this, width / 2, height / 2);

        this.enemies = this.physics.add.group();

        // Grup içi çarpışma için collider ekleme
        this.enemies.children.iterate(e1 => {
            this.enemies.children.iterate(e2 => {
                if (e1 !== e2) this.physics.add.collider(e1, e2);
            });
        });

        // Player ve düşman çarpışması
        this.physics.add.overlap(this.player, this.enemies, () => {
            this.scene.start('MenuScene');
        });

        // Wave değişkenleri
        this.currentWave = 1;
        this.waveTime = 10;
        this.waveTimer = this.waveTime;
        this.inWave = false;
        this.nextWaveZone = null;
        this.nextWaveTimer = 0;

        // UI
        this.waveText = this.add.text(10, 10, '', { fontSize: '20px', fill: '#fff' });
        this.timeText = this.add.text(10, 40, '', { fontSize: '20px', fill: '#fff' });

        this.startWave();
    }

    startWave() {
        this.clearEnemies();
        this.waveTimer = this.waveTime;
        this.inWave = true;

        const config = this.waveConfigs[this.currentWave - 1] || { small: 5 };

        if (config.small) for (let i = 0; i < config.small; i++) this.enemies.add(new Enemy(this, Phaser.Math.Between(0, this.scale.width), -20, this.player));
        if (config.big) for (let i = 0; i < config.big; i++) this.enemies.add(new BigEnemy(this, Phaser.Math.Between(0, this.scale.width), -20, this.player));
        if (config.fast) for (let i = 0; i < config.fast; i++) this.enemies.add(new FastEnemy(this, Phaser.Math.Between(0, this.scale.width), -20, this.player));

        // Grup içi çarpışmayı güncelle
        this.enemies.children.iterate(e1 => {
            this.enemies.children.iterate(e2 => {
                if (e1 !== e2) this.physics.add.collider(e1, e2);
            });
        });
    }

    clearEnemies() {
        this.enemies.clear(true, true);
    }

    spawnNextWaveZone() {
        const { width, height } = this.scale;
        const zoneX = Phaser.Math.Between(100, width - 100);
        const zoneY = Phaser.Math.Between(100, height - 100);
        this.nextWaveZone = this.add.circle(zoneX, zoneY, 40, 0x00ff00, 0.3);
        this.physics.add.existing(this.nextWaveZone, false);
        this.nextWaveTimer = 0;
    }

    update(time, delta) {
        const pointer = this.input.activePointer;
        this.player.update(pointer);

        this.enemies.children.iterate(enemy => {
            if (enemy) enemy.update();
        });

        if (this.inWave) {
            this.waveTimer -= delta / 1000;
            if (this.waveTimer <= 0) {
                this.inWave = false;
                this.clearEnemies();
                this.spawnNextWaveZone();
            }
        } else if (this.nextWaveZone) {
            const dx = this.player.x - this.nextWaveZone.x;
            const dy = this.player.y - this.nextWaveZone.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50) {
                this.nextWaveTimer += delta / 1000;
                if (this.nextWaveTimer >= 3) {
                    this.currentWave++;
                    this.nextWaveZone.destroy();
                    this.nextWaveZone = null;
                    this.startWave();
                }
            } else this.nextWaveTimer = 0;
        }

        this.waveText.setText(`Wave: ${this.currentWave}`);
        this.timeText.setText(this.inWave ? `Time Left: ${Math.ceil(this.waveTimer)}` : 'Wave Complete');
    }
}