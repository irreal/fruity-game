import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  spawnSizes = [0.1, 0.2, 0.27, 0.31, 0.38];
  sizes = [0.1, 0.2, 0.27, 0.31, 0.38, 0.5, 0.55, 0.66, 0.72, 0.86, 1];
  nextSize = 0.1;
  ghostBall: Phaser.GameObjects.Image;
  constructor() {
    super("fruity");
  }

  preload() {
    for (let i = 1; i <= 11; i++) {
      this.load.image("fruit" + i, `assets/fruit${12 - i}.png`);
    }
  }

  createBall(x: number, y: number, size: number): Phaser.Physics.Matter.Image {
    const index = this.sizes.indexOf(size);
    const ball = this.matter.add.image(x, y, "fruit" + (index + 1));
    ball.setCircle(180 * size, {
      restitution: 0.02,
      friction: 0.1,
      density: 15,
    });
    ball.setFriction(0.005);
    ball.setBounce(1);
    ball.setData("size", size);
    return ball;
  }

  create() {
    this.nextSize = Phaser.Math.RND.pick(this.spawnSizes);
    const index = this.sizes.indexOf(this.nextSize);
    this.ghostBall = this.add.image(0, 0, "fruit" + (index + 1));
    this.ghostBall.setAlpha(0.4);
    this.input.addListener("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.ghostBall.setPosition(pointer.x, 320);
    });

    this.matter.world.setBounds(70, 450, 610, 800, 32, true, true, false, true);
    for (let i = 0; i < 0; i++) {
      const x = Phaser.Math.Between(150, 1700);
      const y = Phaser.Math.Between(-600, 0);
      const size = Phaser.Math.RND.pick(this.spawnSizes);
      this.createBall(x, y, size);
    }
    this.input.addListener("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.createBall(pointer.x, 320, this.nextSize);
      this.nextSize = Phaser.Math.RND.pick(this.spawnSizes);
      const index = this.sizes.indexOf(this.nextSize);
      this.ghostBall.setTexture("fruit" + (index + 1));
    });

    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (bodyA.gameObject && bodyB.gameObject) {
        const size1 = bodyA.gameObject.getData("size");
        const size2 = bodyB.gameObject.getData("size");
        if (size1 === size2 && size1 < 1) {
          const newSize = this.sizes[this.sizes.indexOf(size1) + 1];
          this.createBall(
            (bodyA.position.x + bodyB.position.x) / 2,
            (bodyA.position.y + bodyB.position.y) / 2,
            newSize
          );

          bodyA.gameObject.destroy();
          bodyB.gameObject.destroy();
        }
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
