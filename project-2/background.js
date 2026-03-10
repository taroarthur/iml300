/* 
There's this wonderful painter/artist whose name is Akiko Nakayama. She works with the electronic artist Floating Points, mixing different paints live and capturing it with a camera feed to use as visuals during the music performance. I was inspired by the viscous seeping of paint and gradual mixing of colours, and decided to create a drawing programme inspired by that. 

Press keys 1-3 to change the brush & paint type!

*/

let paint = [];
let paintTypes;
let paintIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  background(195);

  // using arrays to store the different brushes/paints
  paintTypes = [
    {
      name: "Thick",
      colour: [191, 29, 29],
      size: 10,
      viscosity: 0.1,
      fade: 0.07,
      rings: 2,
    },
  ];
}

function draw() {
  //draws only when mouse is pressed
  if (mouseIsPressed) {
    addPaint(mouseX, mouseY);
  }

  // background changes colour according to mouse height
  let factor = mouseY / height;
  

  // creating array of shapes for more fine-tuned paint behaviour! applying some tricks from IML-288/Processing
  for (let i = paint.length - 1; i >= 0; i--) {
    let p = paint[i];

    p.size += p.viscosity;
    p.wet -= p.fade;

    if (p.wet <= 0) {
      paint.splice(i, 1);
      continue;
    }

    // referencing pre-set RGB values to get different colours
    fill(p.colour[0], p.colour[1], p.colour[2], p.wet);

    // where the magic happens! this calculates how the paint should behave depending on viscosity, wetness (opacity), etc.
    for (let rad = 1; rad <= p.rings; rad++) {
      let spread = p.size + rad * 5;
      fill(p.colour[0], p.colour[1], p.colour[2], p.wet * 4 * rad);

      // random function creates 'paper' effect, where the paint blobs aren't lined up perfectly
      ellipse(
      p.x - spread / 2 + random(-1.2, 1.2),
        p.y - spread / 2 + random(-1.2, 1.2),
        spread
      );
    }
  }
}

// all the info from the paintTypes index are plugged in here so that different brushes are drawn & each paint reacts differently
function addPaint(x, y) {
  let p = paintTypes[paintIndex];

  paint.push({
    x,
    y,
    size: p.size,
    viscosity: p.viscosity,
    fade: p.fade,
    rings: p.rings,
    wet: 110,
    colour: p.colour,
  });

  if (paintTypes.length > 1200) paintTypes.shift();
}

