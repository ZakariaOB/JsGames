import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemy.js";
import { UI } from "./UI.js";

// TODO 8.26.24

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1000;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.background = new Background(this);
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = true;
      this.score = 0;
      this.fontColor = 'black';
      this.UI = new UI(this);
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.particles = [];
    }
    update(deltaTime) {
      this.background.update();
      this.player.update(this.input, deltaTime);
      // handleEnemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((e) => {
        e.update(deltaTime);
        if (e.markedForDeletion) {
          this.enemies.splice(this.enemies.indexOf(e), 1);
        }
      });
      // hanlde particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) {
          this.particles.splice(index, 1);
        }
      });
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((e) => {
        e.draw(context);
      });
      this.particles.forEach((p) => {
        p.draw(context);
      });
      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      }
      else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));
    }
  }
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animate);
  }

  animate(0);
});
