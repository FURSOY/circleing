import Phaser from 'phaser';

export default class BigEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        const radius = 30;
        const color = 0x0000ff; // mavi

        const g = scene.add.graphics();
        g.fillStyle(color, 1);
        g.fillCircle(radius, radius, radius);
        g.generateTexture('bigEnemyCircle', radius * 2, radius * 2);
        g.destroy();

        super(scene, x, y, 'bigEnemyCircle');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(radius);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);

        this.player = player;
        this.speed = 60; // daha yavaş
    }

    update() {
        if (!this.player.active) return;
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) this.body.setVelocity((dx / dist) * this.speed, (dy / dist) * this.speed);
    }
}
