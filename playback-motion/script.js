var video = document.getElementById('video');
var canvas = document.getElementById('motion');
var score = document.getElementById('score');
var audio = document.getElementById('audio');
var source = document.getElementsByTagName('source')[0];
var body = document.getElementsByTagName('body')[0];

var playing = false;
var someonePresent = false;
var sounds = ['sounds/xylophone.mp3', 'sounds/Rocket1.mp3', 'sounds/Penelope1.mp3', 'sounds/Jesse1.mp3', 'sounds/Rocket2.mp3', 'sounds/Penelope2.mp3', 'sounds/Jesse2.mp3', 'sounds/glenda.mp3', 'sounds/Rocket3.mp3',
  'sounds/Penelope3.mp3', 'sounds/Jesse3.mp3'
];
var soundsIndex = 0;


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
    if (soundsIndex < sounds.length) {
      soundsIndex++;
    } else {
      soundsIndex = 0;
    }
    playing = false;
  };

  //   <audio id="audio" controls>
  // 		<source src="sounds/xylophone.mp3" type="audio/mpeg" id="source">
  // 			Your browser does not support the audio element.
  // 	</audio>
  //
  //   source.setAttribute("src", sounds[soundsIndex]);
  //   console.log('playAudio called * source.src is: ' + source.src);
  //   audio.play();
  //   audio.onended = function() {
  //     console.log("The audio has ended");
  //     if (soundsIndex < sounds.length){
  //       soundsIndex++;
  //     } else {
  //       soundsIndex = 0;
  //     }
  //     playing = false;
  //   };
}

DiffCamEngine.init({
  video: video,
  motionCanvas: canvas,
  initSuccessCallback: initSuccess,
  initErrorCallback: initError,
  captureCallback: capture
});
