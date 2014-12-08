// -----------------------------------------------------
// Experimental animation written with paper.js, not 
// quite oop-style, not quite maintainable, not quite 
// efficient, but it does the job :)
// -----------------------------------------------------

//
// Various global config parameters
//
var hoverScale = 1.3;
var strokeWidth = 2;
var strokeColor = 'grey';
var speed = 5;
var nbIcons = 17;
var rasterScale = 0.08;

var maxInputs = 6;
var minInputs = 3;
var maxOutputs = 6;
var minOutputs = 3;

// 
// Draw the Symbiot box
// 
var drawSymbiot = function() {
  var symbiot = Path.Rectangle({
    center: view.center,
    size: [100, 100],
    strokeColor: strokeColor,
    strokeWidth: strokeWidth * 5,
    strokeCap:'round',
    radius: 10
  });
  var text = new PointText(symbiot.bounds.center.x, symbiot.bounds.topCenter.y - 20);
  text.content = 'Symbiot';
  text.fillColor = 'black';
  text.fontSize = 14;
  text.fontWeight = 'bold';
  text.justification = 'center';
  return symbiot;
}

// 
// Draw the inputs
// 
var drawInputs = function(symbiot, nbInputs) {

  // config
  var leftMargin = 100;
  var topMargin = 10;
  var connectorWidth = 60;

  // working variables
  var lTop = topMargin;
  var lHeight = view.bounds.height - 2 * topMargin;
  lTop += lHeight / nbInputs / 2;
  var rTop = symbiot.center.y - symbiot.bounds.height / 2;
  var rHeight = symbiot.center.y + symbiot.bounds.height / 2 - rTop;
  rTop += rHeight / nbInputs / 2;

  // draw lines
  var lines = new Array();
  for (i=0; i<nbInputs; i++) {

    var line = new Path();
    line.strokeColor = strokeColor;
    line.strokeWidth =  strokeWidth;
    line.strokeCap = 'round';

    line.add(new Point(leftMargin                                                  , i * lHeight / nbInputs + lTop));
    line.add(new Point(symbiot.center.x - symbiot.bounds.width / 2 - connectorWidth, i * rHeight / nbInputs + rTop));
    line.add(new Point(symbiot.center.x - symbiot.bounds.width / 2                 , i * rHeight / nbInputs + rTop));
    lines[i] = line;
  }
  return lines;
};

// 
// Draw the outputs
// 
var drawOutputs = function(symbiot, nbOutputs) {

  // config
  var topMargin = 10;
  var connectorWidth = 60;
  var rightMargin = 100;

  // working variables
  var rTop = topMargin;
  var lHeight = view.bounds.height - 2 * topMargin;
  rTop += lHeight / nbOutputs / 2;
  var lTop = symbiot.center.y - symbiot.bounds.height / 2;
  var rHeight = symbiot.center.y + symbiot.bounds.height / 2 - lTop;
  lTop += rHeight / nbOutputs / 2;

  // draw outputs
  var lines = new Array();
  for (i=0; i<nbOutputs; i++) {

    var line = new Path();
    line.strokeColor = strokeColor;
    line.strokeWidth =  strokeWidth;
    line.strokeCap = 'round';
    line.strokeJoin = 'round';

    line.add(new Point(symbiot.center.x + symbiot.bounds.width / 2                 , i * rHeight / nbOutputs + lTop));
    line.add(new Point(symbiot.center.x + symbiot.bounds.width / 2 + connectorWidth, i * rHeight / nbOutputs + lTop));
    line.add(new Point(view.bounds.width - rightMargin                             , i * lHeight / nbOutputs + rTop));
    lines[i] = line;
  }
  return lines;
};

//
// Draw things
//
var drawThings = function (inputs, outputs) {

  
  var inputThings = new Array();
  for (i=0; i<inputs.length; i++) {

    var raster = new Raster('thing'+Math.ceil(Math.random()*nbIcons));
    raster.scale(rasterScale);
    raster.position = inputs[i].segments[0].point - new Point(30, 0);
    inputThings[i] = raster;
  }

  var outputThings = new Array();
  for (i=0; i<outputs.length; i++) {

    var raster = new Raster('thing'+Math.ceil(Math.random()*nbIcons));
    raster.scale(rasterScale);
    raster.position = outputs[i].segments[outputs[i].segments.length-1].point + new Point(30, 0);
    outputThings[i] = raster;
  }
  return { 'inputThings': inputThings, 'outputThings' : outputThings };
}

// 
// Display (and animate) a stream
// 
function Stream (inputPath, outputPath, outputThing) {

  // vars for animation
  var circle;
  var rect;
  var nextTarget;
  var jump;
  var state = 'init';
  var endCount = 0;

  var calculateJump = function (targetPoint, speed) {

    var jump = (targetPoint - circle.position);
    jump.length = speed;
    return jump;
  };

  this.liveYourLife = function () {

    switch (state) {

      // init
      case 'init':
        circle = Path.Circle({
          center: new Point(inputPath.segments[0].point),
          radius: 5,
          fillColor: strokeColor,
          strokeWidth: strokeWidth
        });
        nextTarget = inputPath.segments[1];
        jump = calculateJump(nextTarget.point, speed);
        state = 'in';
        break;

      // receive from input
      case 'in':
        var dist = nextTarget.point - circle.position;
        if (dist.length < jump.length) {
          nextTarget = nextTarget.next;
          if (nextTarget != null) {
            jump = calculateJump(nextTarget.point, speed);
          } else {
            state = 'enterTransform';
          }
        } else {
          circle.position += jump;
        }
        break;

      // enter transform
      case 'enterTransform':
        nextTarget = outputPath.segments[0];
        jump = calculateJump(nextTarget.point, speed) / 2;
        state = 'transform';
        circle.fillColor = 'white';
        circle.strokeColor = 'black';
        break;

      // transform payload in Symbiot
      case 'transform':
        var dist = nextTarget.point - circle.position;
        if (dist.length < jump.length) {
          state = 'enterOutput';
          circle.fillColor = strokeColor;
          circle.strokeColor = strokeColor;
        } else {
          circle.position += jump;
        }
        break;

      // enter output
      case 'enterOutput':
        nextTarget = nextTarget.next;
        jump = calculateJump(nextTarget.point, speed);
        state = 'out';
        break;

      // connect to output
      case 'out':
        var dist = nextTarget.point - circle.position;
        if (dist.length < jump.length) {
          nextTarget = nextTarget.next;
          if (nextTarget != null) {
            jump = calculateJump(nextTarget.point, speed);
          } else {
            circle.remove();
            state = 'end';
            outputThing.scale(hoverScale);
          }
        } else {
          circle.position += jump;
        }
        break;

      // flash output
      case 'end':
        if (endCount++ > 5) {
          outputThing.scale(1/hoverScale);
          return false;
        }
    }
    return true;
  }
}

//
// Setup and execute the animation
//
var symbiot = drawSymbiot();
var inputs = drawInputs(symbiot, Math.ceil(Math.random()*(maxInputs-minInputs)+minInputs-0.5));
var outputs = drawOutputs(symbiot, Math.ceil(Math.random()*(maxOutputs-minOutputs)+minOutputs-0.5));
var things = drawThings (inputs, outputs);
var currentMessages = [];

// hover effect on inputs
function registerMouseListener(raster, index){
  raster.onMouseEnter = function(event) {
    var randOutputId = Math.floor(Math.random()*outputs.length);
    raster.scale(hoverScale);
    currentMessages.push(
      new Stream(
        inputs[index],
        outputs[randOutputId],
        things.outputThings[randOutputId]
      ));
  }
  raster.onMouseLeave = function(event) {
    raster.scale(1/hoverScale);
  }
}
for (i=0; i<things.inputThings.length; i++) {
  registerMouseListener(things.inputThings[i],i);
}

// random input activated on click
var randInputId;
function onMouseDown(event) {
  randInputId = Math.floor(Math.random()*inputs.length);
  var randOutputId = Math.floor(Math.random()*outputs.length);
  things.inputThings[randInputId].scale(hoverScale);
  currentMessages.push(
    new Stream(
      inputs[randInputId],
      outputs[randOutputId],
      things.outputThings[randOutputId]
  ));
}
function onMouseUp(event) {
  things.inputThings[randInputId].scale(1/hoverScale);
}

// animation
function onFrame(event) {
  for (i=0; i<currentMessages.length; i++) {
    if (!currentMessages[i].liveYourLife()) {
      currentMessages.splice(i, 1);
    }
  }
}
