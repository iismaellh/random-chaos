
var pmax = 10;
var mmax = 1000;
var pivots = [];
var movers = [];
var radius = 0.4;
var step = 1;

var love = 0.5;

var fps = 60;
var speed = .5;
var traces = false;

var zoom;


function setup() {
  
  var d, c, a, x, y, i;
    
  d = 10;
  c = color(255);
  
  createCanvas(windowWidth, windowHeight);

  for(i = 0; i < pmax; i++) {
    a = TWO_PI * i/pmax;
    x = sin(a);
    y = -cos(a);
    pivots.push(new Point(x, y, d, c));
  }
  
  d = 5;
  c = color(255, 50);
  
  for(i = 0; i < mmax; i++) {
    x = random(-1,+1);
    y = random(-1,+1);
    movers.push(new Point(x, y, d, c));
  }
  
}


function draw() {
  
  // update the model
  tick();
  
  background(0);
  translate(width/2, height/2);
  zoom = min(width, height);
  scale(zoom * radius, zoom * radius);
  strokeWeight(1/zoom);
  
  // draw all the pivot points
  noStroke();
  for(var i = 0; i < pmax; i++) {
    pivots[i].draw();
  }
  
  // move and draw all the movers
  for(i = 0; i < mmax; i++) {
    movers[i].draw();
  }

}


function tick() {
  
  // time in seconds, multiplied by speed factor
  var t = frameCount / fps * speed;
  
  // calculate current step
  var s = floor(t);
  
  // is it time for the next step?
  if(s > step) {
    // update step variable
    step = s;
    // update targets
    for(i = 0; i < mmax; i++) {
      movers[i].next();
    }
  }
  
  // progress towards the next step (value between 0 and 1)
  var dt = t - s;
  
  // update all movers
  for(i = 0; i < mmax; i++) {
    movers[i].move(dt);
  }
  
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function Point(x, y, d, c) {
  
  // start and target coordinates
  var sx, tx, px;
  var sy, ty, py;
  
  // expose x and y coordinates
  this.x = sx = tx = px = x;
  this.y = sy = ty = py = y;
  
  this.draw = function() {
    if(traces) {
      stroke(c);
      line(px, py, this.x, this.y);
    } else {
      fill(c);
      ellipse(this.x, this.y, d/zoom, d/zoom);
    }
  };
  
  this.next = function() {
    // pick new target point
    var pivot = random(pivots);
    // old target becomes the new starting point
    sx = tx; 
    sy = ty;
    // target coordinates between starting point and pivot point
    tx = lerp(sx, pivot.x, love);
    ty = lerp(sy, pivot.y, love);
  };
  
  this.move = function(t) {
    // previous coordinates
    px = this.x;
    py = this.y;
    // interpolate between start and target coordinates
    this.x = lerp(sx, tx, t);
    this.y = lerp(sy, ty, t);
  };
  
}