import Phaser from 'phaser';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import BigEnemy from '../objects/BigEnemy';
import FastEnemy from '../objects/FastEnemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.waveConfigs = [
            { small: 100 },
            { small: 150, big: 30 },
            { small: 200, fast: 50 },
            { small: 200, fast: 100, big: 40 },
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
        this.waveTime = 20;
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

        const spawnEnemy = (EnemyClass, count) => {
            for (let i = 0; i < count; i++) {
                // Rastgele kenar seç (0: üst, 1: alt, 2: sol, 3: sağ)
                const side = Phaser.Math.Between(0, 3);
                let x, y;

                if (side === 0) { // üst
                    x = Phaser.Math.Between(0, this.scale.width);
                    y = -20;
                } else if (side === 1) { // alt
                    x = Phaser.Math.Between(0, this.scale.width);
                    y = this.scale.height + 20;
                } else if (side === 2) { // sol
                    x = -20;
                    y = Phaser.Math.Between(0, this.scale.height);
                } else { // sağ
                    x = this.scale.width + 20;
                    y = Phaser.Math.Between(0, this.scale.height);
                }

                this.enemies.add(new EnemyClass(this, x, y, this.player));
            }
        };

        if (config.small) spawnEnemy(Enemy, config.small);
        if (config.big) spawnEnemy(BigEnemy, config.big);
        if (config.fast) spawnEnemy(FastEnemy, config.fast);

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

    spawnNextWaveButton() {
        const { width, height } = this.scale;
        const btnX = Phaser.Math.Between(150, width - 150);
        const btnY = Phaser.Math.Between(150, height - 150);

        // Buton arka planı
        this.nextWaveButton = this.add.rectangle(btnX, btnY, 120, 60, 0x4444ff, 0.8);
        this.physics.add.existing(this.nextWaveButton, false);

        // Buton yazısı
        this.nextWaveText = this.add.text(btnX, btnY, "START WAVE", {
            fontSize: "18px",
            fill: "#fff"
        }).setOrigin(0.5);

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
                this.spawnNextWaveButton();
            }
        }
        else if (this.nextWaveButton) {
            const dx = this.player.x - this.nextWaveButton.x;
            const dy = this.player.y - this.nextWaveButton.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 60) {
                this.nextWaveTimer += delta / 1000;
                if (this.nextWaveTimer >= 3) {
                    this.startCountdown(); // Geri sayım başlat
                }
            } else {
                this.nextWaveTimer = 0;
            }
        }

        this.waveText.setText(`Wave: ${this.currentWave}`);
        this.timeText.setText(this.inWave ? `Time Left: ${Math.ceil(this.waveTimer)}` : 'Wave Complete');
    }

    startCountdown() {
        if (this.countdownText) return; // Tekrarlamasın

        this.nextWaveButton.destroy();
        this.nextWaveText.destroy();

        let countdown = 3;
        this.countdownText = this.add.text(this.scale.width / 2, this.scale.height / 2, countdown, {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        const timer = this.time.addEvent({
            delay: 1000,
            repeat: 2,
            callback: () => {
                countdown--;
                this.countdownText.setText(countdown);
                if (countdown <= 0) {
                    this.countdownText.destroy();
                    this.countdownText = null;
                    this.currentWave++;
                    this.startWave();
                }
            }
        });
    }

}