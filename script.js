// const canvas = document.getElementById('canvas');
// const context = canvas.getContext('2d');

// let position = new Vector2(0, 100);
// let direction = new Vector2(1, 0);
// let velocity = new Vector2(1, 0);

// let player = new Point(position.dx, position.dy, 10, "black");
// let bullets = [];

// index = 0;

// window.addEventListener('keydown', (evt) => {
//   switch (evt.keyCode) {
//     case 37:
//       velocity.angle -= 0.5;
//       break;
//     case 38:
//       velocity.r += 1;
//       break;
//     case 39:
//       velocity.angle += 0.5;
//       break;
//     case 40:
//       velocity.r -= 1;
//       break;
//     case 32:
//       let bullet = new Point(position.dx, position.dy, 5, "yellow");
//       bullet.position = new Vector2(position.dx, position.dy);
//       bullet.velocity = new Vector2(0, 0);
//       bullet.velocity.r = velocity.r + 5 || 3;
//       bullet.velocity.angle = velocity.angle;
//       bullets.push(bullet);
//       index++;
//       break;
//     default:
//   }
// });

// function Update() {
//   requestAnimationFrame(Update);
//   context.clearRect(0, 0, 700, 700);
//   player.x = position.dx; player.y = position.dy;
//   position.addTo(velocity);
//   player.draw();

//   for (let i = 0; i < bullets.length; i++) {
//     bullets[i].draw();
//     bullets[i].x = bullets[i].position.dx; bullets[i].y = bullets[i].position.dy;
//     bullets[i].position.addTo(bullets[i].velocity);
//   }

//   switch (true) {
//     case position.dx < 0:
//       position.dx = 700;
//       break;
//     case position.dx > 700:
//       position.dx = 0;
//       break;
//     case position.dy < 0:
//       position.dy = 700;
//       break;
//     case position.dy > 700:
//       position.dy = 0;
//       break;
//   }

// }
// function Asteroid(width, height) {
//   this.width = width;
//   this.height = height;
//   this.x = width/2;
//   this.y = -6;
//   this.min = 1.6;
//   this.max = 2.2;
//   this.speed = 1.6;
// }

// // Move asteroid
// Asteroid.prototype.move = function() {
//   if(this.y < this.height) {
//       this.y += this.speed;
//   } else {
//       this.y = -6;
//       this.x = Math.random()*(this.width-0)-0;
//   }
// }

// // Draw asteroid
// Asteroid.prototype.draw = function() {
//   ctx.beginPath();
//   ctx.fillStyle = "#D9BA5F";
//   ctx.arc(this.x, this.y, 3, 0, 2*Math.PI, false);
//   ctx.closePath();
//   ctx.fill();
// }


// Update();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const SHIP_SIZE = 30;
const FPS = 30;
const TURN_SPEED = 360;
const SHIP_THRUST = 5;
const FRICTION = 0.6;
const ASTEROIDS = 30;
const ASTEROIDS_SIZE = 150;
const ASTEROID_SPEED = 50;
const ASTEROIDS_VERT = 10;

var ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: SHIP_SIZE / 2,
  a: 90 / 180 * Math.PI,
  rot: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  }
}

var asteroids = [];
createAsteroids();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

setInterval(update, 1000 / FPS);

function createAsteroids() {
  asteroids = [];
  var x, y;
  for (var i = 0; i < ASTEROIDS; i++ ) {
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
    } while(DistBetweenPoints(ship.x, ship.y, x, y) < ASTEROIDS_SIZE * 2 + ship.r);
    asteroids.push(newAsteroid(x, y));
  }
}

function DistBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function keyDown(evt) {
  switch (evt.keyCode) {
    case 37:
      ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
      break;
    case 38:
      ship.thrusting = true;
      break;
    case 39:
      ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
      break;
  }
}

function keyUp(evt) {
  switch (evt.keyCode) {
    case 37:
      ship.rot = 0;
      break;
    case 38:
      ship.thrusting = false;
      break;
    case 39:
      ship.rot = 0;
      break;

  }
}

function newAsteroid(x, y) {
  var asteroid = {
    x: x, 
    y: y,
    xv: Math.random() * ASTEROID_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
    yv: Math.random() * ASTEROID_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
    r: ASTEROIDS_SIZE / 2,
    a: Math.random() * Math.PI * 2,
    vert: Math.floor(Math.random() * (ASTEROIDS_VERT + 1) + ASTEROIDS_VERT / 2),
  }
  return asteroid;
}

function update() {

  //draw space
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //thrust
  if (ship.thrusting) {
    ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
    ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
    
    //the thruster
    context.fillStyle = "red";
    context.strokeStyle = "blue";
    context.lineWidth = SHIP_SIZE / 10;
    context.beginPath();
    context.moveTo(
      ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
    );
    context.lineTo(
      ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
      ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
    );
    context.lineTo(
      ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
    );
    context.closePath();
    context.fill();
    context.stroke();

  } else {
    ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
    ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
  }

  //draw ship
  context.strokeStyle = "white";
  context.lineWidth = SHIP_SIZE / 20;
  context.beginPath();
  context.moveTo(
    ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
    ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
  );
  context.lineTo(
    ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a)),
  );
  context.lineTo(
    ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a)),
  );
  context.closePath();
  context.stroke();

  // asteroids
  context.strokeStyle = "gray";
  context.fillStyle = SHIP_SIZE / 20;
  var x, y, r, a, vert;
  for (var i = 0; i < asteroids.length; i++) {
    x = asteroids[i].x;
    y = asteroids[i].y;
    r = asteroids[i].r;
    a = asteroids[i].a;
    vert = asteroids[i].vert;

    context.beginPath();
    context.moveTo(
      x + r * Math.cos(a),
      y + r * Math.sin(a),
    );

    for (var j = 0; j < vert; j++ ) {
      context.lineTo(
        x + r * Math.cos(a + j * Math.PI * 2 / vert),
        y + r * Math.sin(a + j * Math.PI * 2 / vert),
      )
    }
    context.closePath();
    context.stroke();


  }

  //move ship
  ship.x += ship.thrust.x
  ship.y += ship.thrust.y

  //rotate ship
  ship.a += ship.rot;

  // walls
  if (ship.x < 0 - ship.r) {
    ship.x = canvas.width + ship.r;
  } else if (ship.x > canvas.width + ship.r) {
    ship.x = 0 - ship.r;
  }

  if (ship.y < 0 - ship.r) {
    ship.y = canvas.height + ship.r;
  } else if (ship.y > canvas.height + ship.r) {
    ship.y = 0 - ship.r;
  }
}