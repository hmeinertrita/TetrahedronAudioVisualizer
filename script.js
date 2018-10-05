const edgeLength = 100;
const toRad = Math.PI/180;
const edgeCount = 3;
const edgeBaseAngle = 360/edgeCount*toRad;
const edgeCircumRadius = 0.5*edgeLength/Math.sin(0.5*edgeBaseAngle);
const edgeInRadius = 0.5*edgeLength/Math.tan(0.5*edgeBaseAngle);
const edgeAngle = Math.asin(edgeCircumRadius/edgeLength);
const cubeEdgeLength = edgeLength/Math.sqrt(2);
const faceHeight = edgeInRadius + edgeCircumRadius;
const faceInRadius = edgeCircumRadius*Math.tan(Math.asin(edgeInRadius/faceHeight));
const faceCircumRadius = Math.sqrt(Math.pow(faceInRadius,2) + Math.pow(edgeCircumRadius, 2));

function setEdgeLength(addedLength, vertex) {
  const height = faceCircumRadius + faceInRadius + addedLength;
  const length = Math.sqrt(Math.pow(edgeCircumRadius,2) + Math.pow(height,2));
  
  $('.vertex__'+vertex+':not(.base) .edge').css('--length',length+'px');
}

function setEdgeAngle(addedLength, vertex) {
  const height = faceCircumRadius + faceInRadius + addedLength;
  const angle =(1/2)*Math.PI + Math.atan(edgeCircumRadius/height);
  $('.vertex__'+vertex+':not(.base) .edge').css('--angle',angle+'rad');
}

function setVertexTranslate(addedLength, vertex) {
  const height = faceCircumRadius + addedLength;
  $('.vertex__'+vertex+':not(.base)').css('--translate',height+'px');
}

function updateVertex(addedLength, vertex) {
  setEdgeLength(addedLength, vertex);
  setEdgeAngle(addedLength, vertex);
  setVertexTranslate(addedLength, vertex);
}

//GET FILE
var input = document.getElementById('input');
var audioElement;
var contextClass = (window.AudioContext || window.webkitAudioContext);
var audioContext = new contextClass();
var source;
var audioBuffer;
var analyzer;
var frequencyData = new Uint8Array(1024);

input.onchange = function(e){
  audioElement = new Audio();
  audioElement.src = URL.createObjectURL(this.files[0]);
  source = audioContext.createMediaElementSource(audioElement);
  //playSound();
  //revoke URL
}
//AUDIO VISUALIZATION
function createAnalyser() {
  analyser = audioContext.createAnalyser();
}
function connectAnalyser(source) {
  //connect to source
  source.connect(analyser);
  //pipe to speakers
  analyser.connect(audioContext.destination);
}
function playSound() {
  //passing in file
  //source.buffer = audioBuffer;
  createAnalyser();
  //creating source node
  connectAnalyser(source);
  //start playing
  audioElement.play();
  update();
}

//Visualizer

function update() {
  //constantly getting feedback from data
  window.requestAnimationFrame(update);
  analyser.getByteFrequencyData(frequencyData);
  for (var i = 0; i < 4; i++) {
    const key = i*128;
    updateVertex(frequencyData[key]/4, i);
  }
}
