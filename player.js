import { Falling, Jumping, Rolling, Running, Sitting } from "./playerStates.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById("player");
    this.speed = 0;
    this.maxSpeed = 1.5;
    this.frameX = 0;
    this.frameY = 5;
    this.vy = 0;
    this.weight = 1;
    this.maxFrame = 5;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [
      new Sitting(game),
      new Running(game),
      new Jumping(game),
      new Falling(game),
      new Rolling(game),
    ];
  }

  update(input, deltaTime) {
    this.checkCollisions();
    this.currentState.handleInput(input.keys);
    // Horizontal movment
    this.x += this.speed;
    if (input.keys.includes("ArrowRight")) {
      this.speed = this.maxSpeed;
    } else if (input.keys.includes("ArrowLeft")) {
      this.speed = -this.maxSpeed;
    } else {
      this.speed = 0;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }

    // Vertical movment
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }

    // Sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollisions() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {
      }
    });
  }
}
