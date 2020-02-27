let fr = 30;
const TRISOLARAN_DATE = "2418-02-26";

let stars = [];
let distance;
let years, months;

let bg, bgFlipped;
let initBgWidth, initBgHeight;

// Fake gravitational constant
let G = 0.05;
let showTrail;

let fontRegular;
function preload() {
  fontRegular = loadFont('assets/digital-7.ttf');
  bg = loadImage('images/space-bg.jpg');
  bgFlipped = loadImage('images/space-bg-flipped.jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  showTrail = !showTrail;
}

function computeCenterOfMass(stars) {
  const totalMass = stars.map(star => star.mass).reduce((prev, next) => prev + next);
  let acc = createVector(0, 0);
  for (const star of stars) {
    let mr = p5.Vector.mult(star.pos, star.mass);
    acc.add(mr);
  }
  return acc.div(totalMass);
}

function diffDate(startDate, endDate) {
  let b = moment(startDate);
  let a = moment(endDate);
  const intervals = ['years', 'months'];
  let output = {};

  for (const interval of intervals) {
    let diff = a.diff(b, interval);
    b.add(diff, interval);
    output[interval] = diff;
  }
  return output;
}

function getDistancesBetween(stars) {
  if (stars.length < 2) {
    return 0;
  }
  const distances = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i+1; j < stars.length; j++) {
      distances.push(stars[i].getDistance(stars[j]));
    }
  }
  return distances;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fr);
  // colorMode();

  const timeDiff = diffDate(new Date(), new Date(TRISOLARAN_DATE));
  years = timeDiff.years;
  months = timeDiff.months;

  showTrail = false;

  // Star 1
  let starParams = {
    x: windowWidth*0.5-200,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: 0.2,
    gConstant: G
  }
  let newStar = new Star(starParams);
  stars.push(newStar);

  // Star 2
  starParams = {
    x: windowWidth*0.5+200,
    y: windowHeight*0.5,
    mass: 0.5,
    vx: 0,
    vy: -0.2,
    gConstant: G,
    colorSet: pinkStarSet
  }
  newStar = new Star(starParams);
  stars.push(newStar);
}

function draw() {
  background(14, 35, 62);
  const scale = 0.5;
  const bgWidth = scale * bg.width;
  const bgHeight = scale * bg.height;
  imageMode(CORNER);
  image(bg, 0, 0, bgWidth, bgHeight);
  image(bgFlipped, bgWidth, 0, bgWidth, bgHeight);

  // let centerOfMass = computeCenterOfMass(stars);
  // stroke(255, 0, 0);
  // strokeWeight(5);
  // point(centerOfMass.x, centerOfMass.y);

  for (let i = 0; i < stars.length; i++) {
    for (let j = 0; j < stars.length; j++) {
      if (i != j) {
        force = stars[j].attract(stars[i]);
        stars[i].applyForce(force);
      }
    }

    stars[i].update();
    // stars[i].show();
    renderStar(stars[i], showTrail);
  }

  textSize(22);
  textFont(fontRegular);
  noStroke();
  fill(0, 225, 255);
  const distances = getDistancesBetween(stars);
  text(`Distance:  ${distances[0].toPrecision(4)}`, 50, 50);
  text(`Trisolaran Fleet Arrival: ${years} years ${months} months`, 50, 80);
}
