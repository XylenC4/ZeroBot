// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas,
c, // c is the canvas' context 2D
container, 
canvWidth, 
canvHeight,
leftPointerID = -1, 
leftPointerPos = new Vector2(0,0),
leftPointerStartPos = new Vector2(0,0),
leftVector = new Vector2(0,0); 

var temperature;
var voltage;
var slider;
var socket = io(); // comment this out for better debugging
var sendFlag = false;

setupCanvas();

//setInterval(draw, 1000/30); // draw app at 30fps
//setInterval(sendControls, 1000/1); // send control input at 20fps

var pointers = [];


//setInterval(draw, 1000/5); 
//requestAnimFrame(draw);


setInterval(draw, 1000/30); // draw app at 30fps
setInterval(sendControls, 1000/20); // send control input at 20fps


canvas.addEventListener( 'pointerdown', onPointerDown, false );
canvas.addEventListener( 'pointermove', onPointerMove, false );
canvas.addEventListener( 'pointerup', onPointerUp, false );
window.onorientationchange = resetCanvas;  
window.onresize = resetCanvas;  

function resetCanvas (e) {
  // resize the canvas - but remember - this clears the canvas too. 
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight;

  canvWidth = canvas.width;
  canvHeight = canvas.height;

  //make sure we scroll to the top left.
  window.scrollTo(0,0); 
}

var rawLeft, rawRight, MaxJoy = 255, MinJoy = -255, MaxValue = 255,
	MinValue = -255, RawLeft, RawRight, ValLeft, ValRight;
var leftMot = 0, rightMot = 0;
function Remap(value, from1, to1, from2, to2){
	return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}
//source: http://www.dyadica.co.uk/basic-differential-aka-tank-drive/
function tankDrive(x, y){

	// First hypotenuse
	var z = Math.sqrt(x * x + y * y);
	// angle in radians
	var rad = Math.acos(Math.abs(x) / z);

	if (isNaN(rad)) rad = 0;
	// and in degrees
	var angle = rad * 180 / Math.PI;
	
	// Now angle indicates the measure of turn
    // Along a straight line, with an angle o, the turn co-efficient is same
    // this applies for angles between 0-90, with angle 0 the co-eff is -1
    // with angle 45, the co-efficient is 0 and with angle 90, it is 1
    var tcoeff = -1 + (angle / 90) * 2;
	var turn = tcoeff * Math.abs(Math.abs(y) - Math.abs(x));

	turn = Math.round(turn * 100) / 100;
	// And max of y or x is the movement
	var move = Math.max(Math.abs(y), Math.abs(x));

	// First and third quadrant
	if ((x >= 0 && y >= 0) || (x < 0 && y < 0)){
		rawLeft = move;
		rawRight = turn;
	} else {
		rawRight = move;
		rawLeft = turn;
	}
	// Reverse polarity
	if (y < 0) {
		rawLeft = 0 - rawLeft;
		rawRight = 0 - rawRight;
	}

	RawLeft = rawLeft;
    RawRight = rawRight;

	leftMot = Remap(rawLeft, MinJoy, MaxJoy, MinValue, MaxValue);
	rightMot = Remap(rawRight, MinJoy, MaxJoy, MinValue, MaxValue);
	
}

function init(){

}

function draw() {

  c.clearRect(0,0,canvas.width, canvas.height); 


  for(var id in pointers) {

    var pointer = pointers[id]; 

    if(pointer.pointerId == leftPointerID){
      c.beginPath(); 
      c.strokeStyle = "cyan"; 
      c.lineWidth = 6; 
      c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 40,0,Math.PI*2,true); 
      c.stroke();
      c.beginPath(); 
      c.strokeStyle = "cyan"; 
      c.lineWidth = 2; 
      c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 60,0,Math.PI*2,true); 
      c.stroke();
      c.beginPath(); 
      c.strokeStyle = "grey"; 
      c.lineWidth = 1; 
      c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 200,0,Math.PI*2,true); 
      c.stroke();
      c.beginPath(); 
      c.strokeStyle = "cyan"; 
      c.arc(leftPointerPos.x, leftPointerPos.y, 40, 0,Math.PI*2, true); 
      c.stroke(); 

      } 
  }
 
  // socket.on('temp', function(msg){
    // document.getElementById("temp").innerHTML = parseInt(msg) + '°C';
    // temperature = msg;
  // });

  // socket.on('volt', function(msg){
    // document.getElementById("volt").innerHTML = msg.toFixed(2) + 'V';
    // voltage = msg;
  // });
  
  
  // socket.on('slider', function(msg){
    // document.getElementById("slider").value = parseInt(msg);
    // slider = msg;
  // });
  
  // socket.on('cam', function(msg){
    // document.getElementById("stream").innerHTML = img;
	// location.reload();
  // });
}

function onPointerDown(e) {
  sendFlag = true;
  pointers[e.pointerId] = {x: e.clientX, y: e.clientY,
      pointerId: e.pointerId, pointerType: e.pointerType};

  for(var id in pointers) {
    var pointer = pointers[id]; 
    if((leftPointerID<0) && (pointer.x<canvWidth))
    {
      leftPointerID = pointer.pointerId; 
      leftPointerStartPos.reset(pointer.x, pointer.y); 	
      leftPointerPos.copyFrom(leftPointerStartPos); 
      leftVector.reset(0,0); 
      continue; 		
      }
  }
}

function onPointerMove(e) {
  sendFlag = true;
  // Prevent the browser from doing its default thing (scroll, zoom)
  var pointer = pointers[e.pointerId];
  if (pointer) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }

  for(var id in pointers) {
    var pointer = pointers[id]; 
    if(leftPointerID == pointer.pointerId)
    {
      leftPointerPos.reset(pointer.x, pointer.y); 
      leftVector.copyFrom(leftPointerPos); 
      leftVector.minusEq(leftPointerStartPos); 	
      break; 		
    }		
  }


} 

function onPointerUp(e) { 
  sendFlag = true;
  delete pointers[e.pointerId];
  var length = 0;
  for (var id in pointers) { length += 1; }

  leftPointerID = -1; 
  leftVector.reset(0,0); 
}


function setupCanvas() {

  canvas = document.createElement( 'canvas' );
  canvas.setAttribute( 'touch-action', 'none' );
  c = canvas.getContext( '2d' );
  container = document.createElement( 'div' );
  container.className = "container";

  document.body.appendChild( container );
  container.appendChild(canvas);	

  resetCanvas(); 

  c.strokeStyle = "#ffffff";
  c.lineWidth =2;	
}

function mouseOver(minX, minY, maxX, maxY){
	// return(mouseX>minX&&mouseY>minY&&mouseX<maxX&&mouseY<maxY);
}

function sendControls(){
	if(sendFlag == true){
		
		
		
		leftVector.x = Math.min(Math.max(parseInt(leftVector.x), -255), 255);
		leftVector.y = Math.min(Math.max(parseInt(leftVector.y), -255), 255);
		
		tankDrive(leftVector.x, -leftVector.y);
		if(leftMot > 0) leftMot += 90;
		if(leftMot < 0) leftMot -= 90;
		if(rightMot > 0) rightMot += 90;
		if(rightMot < 0) rightMot -= 90;
		
		leftMotComp = 1;
		rightMotComp = 1;

		if(document.getElementById("slider").value < 0) {
		 leftMotComp =  1 - Math.abs(document.getElementById("slider").value)/100;
		 // console.log("leftMotComp:", leftMotComp);
		}
		
		if(document.getElementById("slider").value > 0) {
		 rightMotComp = 1 - Math.abs(document.getElementById("slider").value)/100;
		 // console.log("rightMotComp:", rightMotComp);
		}

		leftMot = Math.min(Math.max(parseInt(leftMot), -255), 255);
		rightMot = Math.min(Math.max(parseInt(rightMot), -255), 255);
		
		
		// console.log("leftMot:", leftMot, "comp" , leftMotComp*leftMotComp);
		// console.log("rightMot:", rightMot, "comp" , rightMotComp*rightMotComp);
		
		socket.emit('pos', leftMot*leftMotComp, rightMot*rightMotComp);
		sendFlag = false;
	}
}