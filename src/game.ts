import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  spawnSizes = [0.1, 0.2, 0.27, 0.31, 0.38];
  sizes = [0.1, 0.2, 0.27, 0.31, 0.38, 0.5, 0.55, 0.66, 0.72, 0.86, 1];
  nextSize = 0.1;
  ghostBall: Phaser.GameObjects.Image;
  group: Phaser.Physics.Arcade.Group;
  constructor() {
    super("fruity");
  }

  preload() {
    for (let i = 1; i <= 11; i++) {
      this.load.image("fruit" + i, `assets/fruit${12 - i}.png`);
    }
  }

  createBall(
    x: number,
    y: number,
    size: number
  ): Phaser.GameObjects.GameObject {
    const index = this.sizes.indexOf(size);
    )
    const ball: Phaser.Physics.Arcade.Sprite = this.group.create(x, y, "fruit" + (index + 1));
    ball.setCircle(180 * size);
    ball.setDamping(false);
    ball.setDrag(100);
    ball.setBounce(0.8);
    ball.setMass(10*size);
    ball.setData("size", size);
    return ball;
  }

  create() {
    this.group = this.physics.add.group({
      defaultKey: "ball",
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });

    this.physics.world.gravity.y = 550;
    
    this.physics.add.collider(this.group,this.group);

    

    this.nextSize = Phaser.Math.RND.pick(this.spawnSizes);
    const index = this.sizes.indexOf(this.nextSize);
    this.ghostBall = this.add.image(0, 0, "fruit" + (index + 1));
    this.ghostBall.setAlpha(0);
    this.input.addListener("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.ghostBall.setPosition(pointer.x, 320);
    });

    this.input.addListener("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.ghostBall.setAlpha(0.5);
    });

    this.input.addListener("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.createBall(pointer.x, 320, this.nextSize);
      this.nextSize = Phaser.Math.RND.pick(this.spawnSizes);
      const index = this.sizes.indexOf(this.nextSize);
      this.ghostBall.setTexture("fruit" + (index + 1));
      this.ghostBall.setAlpha(0);
    });

    this.physics.world.on('collide', (gameObject1, gameObject2, body1, body2) =>
    {
                console.log('collide', gameObject1, gameObject2, body1, body2);
                const size1 = gameObject1.getData("size");
        const size2 = gameObject2.getData("size");
        if (size1 === size2 && size1 < 1) {
          const newSize = this.sizes[this.sizes.indexOf(size1) + 1];
          this.createBall(
            (body1.position.x + body2.position.x) / 2,
            (body1.position.y + body2.position.y) / 2,
            newSize
          );

          gameObject1.destroy();
          gameObject2.destroy();
        }
    });
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: 780,
  height: 1680,
  scene: Demo,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
};

const game = new Phaser.Game(config);
