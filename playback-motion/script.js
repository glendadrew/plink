var video = document.getElementById('video');
var canvas = document.getElementById('motion');
var score = document.getElementById('score');
var audio = document.getElementById('audio');
var source = document.getElementsByTagName('source')[0];
var body = document.getElementsByTagName('body')[0];

var playing = false;
var someonePresent = false;

function initSuccess() {
  DiffCamEngine.start();
  video.style.display = 'none';
  motion.style.display = 'none';
  console.log(scoreThreshold);
}

function initError() {
  //alert('Something went wrong.');
}

function capture(payload) {
  score.textContent = payload.score;
  //console.log('payload.score is: ' + payload.score + ', someonePresent: ' + someonePresent);
  if (payload.score > 20) {
    someonePresent = true;
    if (!playing) {
      playAudio();
    } else {
      someonePresent = false;
    }
  }
}

function playAudio() {
  playing = true;

  console.log('playAudio called * source.src is: ' + source.src);
  audio.play();
  audio.onended = function() {
    console.log("The audio has ended");
    playing = false;
  };
}

DiffCamEngine.init({
  video: video,
  motionCanvas: canvas,
  initSuccessCallback: initSuccess,
  initErrorCallback: initError,
  captureCallback: capture
});
