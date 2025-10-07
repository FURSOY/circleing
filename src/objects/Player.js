import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const config = {
            radius: 20,
            color: 0xffffff,
            maxSpeed: 500,
            acceleration: 3000,
            drag: 600,
            snapToPointerDist: 1,
            slowRadius: 150
        };

        const g = scene.add.graphics();
        g.fillStyle(config.color, 1);
        g.fillCircle(config.radius, config.radius, config.radius);
        g.generateTexture('playerCircle', config.radius * 2, config.radius * 2);
        g.destroy();

        super(scene, x, y, 'playerCircle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.config = config;

        this.setCollideWorldBounds(true);
        this.body.setCircle(config.radius);
        this.body.setAllowGravity(false);
        this.body.setMaxVelocity(config.maxSpeed);
        this.body.setDrag(config.drag, config.drag);

        if (scene.registry.get('showSlowRadius')) {
            this.slowCircle = scene.add.graphics();
            this.slowCircle.lineStyle(1, 0xff0000, 0.5);
            this.slowCircle.strokeCircle(0, 0, config.slowRadius);
            this.slowCircle.setPosition(x, y);
        } else {
            this.slowCircle = null;
        }

        this.speedText = scene.add.text(10, scene.scale.height - 30, `Speed: 0 / ${config.maxSpeed}`, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0, 0);
    }

    update(pointer) {
        const { acceleration, snapToPointerDist, maxSpeed, slowRadius } = this.config;
        const dx = pointer.x - this.x;
        const dy = pointer.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.slowCircle) {
            this.slowCircle.setPosition(this.x, this.y);
        }

        if (dist <= snapToPointerDist) {
            this.body.setVelocity(0, 0);
            this.body.setAcceleration(0, 0);
            this.setPosition(pointer.x, pointer.y);
        } else {
            const nx = dx / dist;
            const ny = dy / dist;

            let targetSpeed = maxSpeed;
            if (dist < slowRadius) {
                targetSpeed = maxSpeed * (dist / slowRadius);
            }

            this.body.setAcceleration(nx * acceleration, ny * acceleration);

            const speed = this.body.velocity.length();
            if (speed > targetSpeed) {
                this.body.velocity.scale(targetSpeed / speed);
            }
        }

        const currentSpeed = this.body.velocity.length();
        this.speedText.setText(`Speed: ${currentSpeed.toFixed(1)} / ${maxSpeed}`);
    }
}