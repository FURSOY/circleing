import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        const radius = 15;
        const color = 0xff0000; // kırmızı

        const g = scene.add.graphics();
        g.fillStyle(color, 1);
        g.fillCircle(radius, radius, radius);
        g.generateTexture('enemyCircle', radius * 2, radius * 2);
        g.destroy();

        super(scene, x, y, 'enemyCircle');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(radius);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);

        this.player = player;
        this.speed = 100;
    }

    update() {
        if (!this.player.active) return;
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) this.body.setVelocity((dx / dist) * this.speed, (dy / dist) * this.speed);
    }
}