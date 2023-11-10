import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  spawnSizes = [0.1, 0.2, 0.27, 0.31, 0.38];
  sizes = [0.1, 0.2, 0.27, 0.31, 0.38, 0.5, 0.55, 0.66, 0.72, 0.86, 1];
  nextSize = 0.1;
  currentSize = 0.1;
  ghostBall: Phaser.GameObjects.Image;
  nextBall: Phaser.GameObjects.Image;
  ballCount = 0;

  constructor() {
    super("fruity");
  }

  preload() {
    for (let i = 1; i <= 11; i++) {
      this.load.image("fruit" + i, `assets/fruit${12 - i}.png`);
    }
    this.load.image("fruitbasket", `assets/fruitbasket.png`);
  }

  createBall(x: number, y: number, size: number): Phaser.Physics.Matter.Image {
    const index = this.sizes.indexOf(size);
    const ball = this.matter.add.image(x, y, "fruit" + (index + 1));
    ball.setCollisionCategory(index);
    ball.setCircle(180 * size);
    ball.setFriction(0.005);
    ball.setBounce(0.6);
    ball.setData("size", size);

    return ball;
  }

  create() {
    this.add.image(0, -290, "fruitbasket").setOrigin(0, 0).setScale(0.55);
    this.nextSize = Phaser.Math.RND.pick(this.spawnSizes);
    this.currentSize = Phaser.Math.RND.pick(this.spawnSizes);

    const index = this.sizes.indexOf(this.currentSize);
    this.ghostBall = this.add.image(0, 0, "fruit" + (index + 1));
    this.ghostBall.setAlpha(0);

    const nextIndex = this.sizes.indexOf(this.nextSize);
    this.nextBall = this.add.image(600, 100, "fruit" + (nextIndex + 1));

    console.log("initial", index, nextIndex);

    this.input.addListener("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.ghostBall.setPosition(pointer.x, 320);
    });

    this.matter.world.setBounds(50, 880, 670, 750, 32, true, true, false, true);
    for (let i = 0; i < 0; i++) {
      const x = Phaser.Math.Between(150, 1700);
      const y = Phaser.Math.Between(-600, 0);
      const size = Phaser.Math.RND.pick(this.spawnSizes);
      this.createBall(x, y, size);
    }
    this.input.addListener("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.currentSize = this.nextSize;
      this.nextSize = Phaser.Math.RND.pick(this.spawnSizes);
      this.ghostBall.setTexture(
        "fruit" + (this.sizes.indexOf(this.currentSize) + 1)
      );
      this.nextBall.setTexture(
        "fruit" + (this.sizes.indexOf(this.nextSize) + 1)
      );
      this.ghostBall.setPosition(600, 100);
      this.ghostBall.setPosition(pointer.x, 320);
      this.ghostBall.setAlpha(1);
    });
    this.input.addListener("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.createBall(pointer.x, 320, this.currentSize);
      this.ghostBall.setAlpha(0);
    });

    this.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        event.pairs.forEach((pair) => {
          if (pair.bodyA.gameObject && pair.bodyB.gameObject) {
            const size1 = pair.bodyA.gameObject.getData("size");
            const size2 = pair.bodyB.gameObject.getData("size");
            if (size1 === size2 && size1 < 1) {
              const newSize = this.sizes[this.sizes.indexOf(size1) + 1];
              this.createBall(
                (pair.bodyA.position.x + pair.bodyB.position.x) / 2,
                (pair.bodyA.position.y + pair.bodyB.position.y) / 2,
                newSize
              );

              pair.bodyA.gameObject.destroy();
              pair.bodyB.gameObject.destroy();
            }
          }
        });
      }
    );
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: 780,
  height: 1680,
  scene: Demo,
  physics: {
    default: "matter",
    matter: {
      enableSleeping: true,
      debug: {
        showAxes: false,
        showAngleIndicator: true,
        angleColor: 0xe81153,

        showBroadphase: false,
        broadphaseColor: 0xffb400,

        showBounds: false,
        boundsColor: 0xffffff,

        showVelocity: true,
        velocityColor: 0x00aeef,

        showCollisions: true,
        collisionColor: 0xf5950c,

        showSeparations: false,
        separationColor: 0xffa500,

        showBody: true,
        showStaticBody: true,
        showInternalEdges: true,

        renderFill: false,
        renderLine: true,

        fillColor: 0x106909,
        fillOpacity: 1,
        lineColor: 0x28de19,
        lineOpacity: 1,
        lineThickness: 1,

        staticFillColor: 0x0d177b,
        staticLineColor: 0x1327e4,

        showSleeping: true,
        staticBodySleepOpacity: 1,
        sleepFillColor: 0x464646,
        sleepLineColor: 0x999a99,

        showSensors: true,
        sensorFillColor: 0x0d177b,
        sensorLineColor: 0x1327e4,

        showPositions: true,
        positionSize: 4,
        positionColor: 0xe042da,

        showJoint: true,
        jointColor: 0xe0e042,
        jointLineOpacity: 1,
        jointLineThickness: 2,

        pinSize: 4,
        pinColor: 0x42e0e0,

        springColor: 0xe042e0,

        anchorColor: 0xefefef,
        anchorSize: 4,

        showConvexHulls: true,
        hullColor: 0xd703d0,
      },
    },
  },
};

const game = new Phaser.Game(config);
