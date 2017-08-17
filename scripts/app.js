var firebaseRoot = 'tmp';

// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

// set up basic variables for app

var restart = document.getElementById('restart');
var restartImg = document.querySelector('.restartImg');

var record = document.getElementById('record');
var recordImg = document.querySelector('.recordImg');
var recordingImg = document.querySelector('.recordingImg');

var playingImg = document.querySelector('.playingImg');

var stop = document.getElementById('stop');
var stopImg = document.querySelector('.stopImg');

var save = document.getElementById('save');
var saveImg = document.querySelector('.saveImg');
var savedImg = document.querySelector('.savedImg');

var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');

var audio;

var restartTimeout;
var TimerRestart = 15000;

// var recordInterval;
// var rt = 0;

// disable stop button while not recording

// inits

restart.style.display = "none";
stop.style.display = "none";
save.style.display = "none";

restart.disabled = true;
record.disabled = false;
stop.disabled = true;
save.disabled = true;

// canvas.style.display = "none";
recordImg.style.opacity = "1";

// grey out disabled buttons
// stop.style.background = "gray";
// save.style.background = "gray";

// visualiser setup - create web audio api context and canvas

var audioCtx = new(window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

// disable dragging to avoid weird highlighting (only a problem in Chrome)
document.onselectstart = function(e) {
  e.preventDefault();
  return false;
};

//main block for doing the audio recording

if (navigator.getUserMedia) {
  console.log('getUserMedia supported.');

  var types = ["video/webm",
    "audio/webm",
    "video/webm\;codecs=vp8",
    "video/webm\;codecs=daala",
    "video/webm\;codecs=h264",
    "video/mpeg",
    "audio/ogg",
    "audio/webm\;codecs=opus",
    "audio/ogg\;codecs=opus"
  ];

  for (var i in types) {
    console.log("Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :("));
  }

  var constraints = {
    audio: true
  };
  var chunks = [];

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    // mades blob and audioURL local to onSuccess to we can it from save.onclick to upload and then delete
    var blob;
    var audioURL;

    var recordTimeout;
    var TimerRecord = 180000;

    var thxTimeout;
    var TimerThx = 5000;

    // visualize(stream);

    // doesn't work...trying to call a the restart on init...ask Spencer
    // console.log('about to call restart.click');
    // restart.click();

    restart.onclick = function() {
      console.log("restart clicked");
      // record.style.background = "";
      // stop.style.background = "gray";
      // save.style.background = "gray";
      // mediaRecorder.requestData();

      //stop playing audio
      audio.pause();

      restart.style.display = "none";
      restartImg.style.transitionDelay = '0s';
      restartImg.style.opacity = "0";

      record.style.display = "block";
      recordingImg.style.transitionDelay = '0s';
      recordImg.style.opacity = "1";
      //console.log('recordImg.style.opacity: ' + recordImg.style.opacity);

      stop.style.display = "none";
      stopImg.style.transitionDelay = '0s';
      stopImg.style.opacity = "0";

      playingImg.style.transitionDelay = '0s';
      playingImg.style.opacity = "0";

      save.style.display = "none";
      saveImg.style.transitionDelay = '0s';
      saveImg.style.opacity = "0";
      savedImg.style.transitionDelay = '0s';
      savedImg.style.opacity = "0";

      restart.disabled = true;
      record.disabled = false;
      stop.disabled = true;
      save.disabled = true;

      // Clear the timelimit timeout
      clearTimeout(restartTimeout);
      restartTimeout = null;
      // console.log('restartTimeout: ' + restartTimeout);

      clearTimeout(thxTimeout);
      thxTimeout = null;
      // console.log('thxTimeout: ' + thxTimeout);

      // clearInterval(recordInterval);
      // recordInterval = null;
      // rt = 0;
    }

    record.onclick = function() {
      // console.log('record clicked');
      mediaRecorder.start();
      console.log('mediaRecorder.state:' + mediaRecorder.state);
      console.log('mediaRecorder.mimeType:' + mediaRecorder.mimeType);

      visualize(stream);

      //record.style.background = "red";
      //save.style.background = "gray";
      //stop.style.background = "";
      restart.style.display = "none";
      restartImg.style.opacity = "0";

      record.style.display = "none";
      recordImg.style.opacity = "0";
      recordingImg.style.opacity = "1";

      stop.style.display = "block";
      stopImg.style.transitionDelay = '.5s';
      stopImg.style.opacity = "1";

      save.style.display = "none";
      saveImg.style.opacity = "0";

      canvas.style.transitionDelay = '.8s';
      canvas.style.opacity = "1";

      restart.disabled = true;
      record.disabled = true;
      stop.disabled = false;
      save.disabled = true;

      deleteLastClip();

      // Set timeout to enforce recording time limit by simulating click on stop button
      recordTimeout = setTimeout(function() {
        stop.click()
      }, TimerRecord);

      // recordInterval = setInterval(updateWidth, 10);
      //
      // function updateWidth() {
      //   rt++;
      // }
    }

    stop.onclick = function() {
      // console.log("stop clicked");
      mediaRecorder.stop();
      console.log('mediaRecorder.state:' + mediaRecorder.state);

      // record.style.background = "";
      // record.style.color = "";
      // stop.style.background = "gray";
      // save.style.background = "";
      // mediaRecorder.requestData();

      restart.style.display = "block";
      restartImg.style.transitionDelay = '1.8s';
      restartImg.style.opacity = "1";

      record.style.display = "none";

      recordImg.style.opacity = "0";
      recordingImg.style.transitionDelay = '0s';
      recordingImg.style.opacity = "0";

      stop.style.display = "none";
      stopImg.style.transitionDelay = '0s';
      stopImg.style.opacity = "0";

      playingImg.style.transitionDelay = '.5s';
      playingImg.style.opacity = "1";

      save.style.display = "block";
      saveImg.style.transitionDelay = '1s';
      saveImg.style.opacity = "1";

      canvas.style.transitionDelay = '0s';
      canvas.style.opacity = "0";

      restart.disabled = false;
      record.disabled = true;
      stop.disabled = true;
      save.disabled = false;

      // Clear the timelimit timeout
      clearTimeout(recordTimeout);
      recordTimeout = null;
      // console.log('recordTimeout: ' + recordTimeout);

      // clearInterval(recordInterval);
      // recordInterval = null;
      // rt = 0;

      // Set timeout to enforce recording time limit by simulating click on stop button
      // audio.ended = (function() {
      //   restartTimeout = setTimeout(function() {
      //     restart.click()
      //   }, TimerRestart);
      // });
    }

    save.onclick = function() {
      // console.log('save clicked');
      // record.style.background = "";
      // stop.style.background = "gray";
      // save.style.background = "gray";
      // mediaRecorder.requestData();

      restart.style.display = "block";
      restartImg.style.opacity = "1";

      record.style.display = "none";
      recordImg.style.transitionDelay = '0s';
      recordImg.style.opacity = "0";

      stop.style.display = "none";
      stopImg.style.opacity = "0";

      playingImg.style.transitionDelay = '0s';
      playingImg.style.opacity = "0";

      save.style.display = "none";
      saveImg.style.transitionDelay = '0s';
      saveImg.style.opacity = "0";
      savedImg.style.transitionDelay = '.5s';
      savedImg.style.opacity = "1";

      restart.disabled = true;
      record.disabled = false;
      stop.disabled = true;
      save.disabled = true;

      thxTimeout = setTimeout(function() {
        restart.click()
      }, TimerThx);

      // Save to Firebase
      console.log("Saving to Firebase");
      var d = new Date();
      var year = d.getFullYear();
      var month = ('0' + (d.getMonth() + 1)).slice(-2);
      var day = ('0' + d.getDate()).slice(-2);
      var hour = d.getHours();
      var min = d.getMinutes();
      var sec = d.getSeconds();
      var time = `${year}-${month}-${day}-${hour}-${min}-${sec}`;

      var name = time + ".webm";
      // for whatever reason blob, which is local to parent function onSuccess, is
      console.log("Uploading blob of size", blob.size, "and type", blob.type);
      let storageRef = firebase.storage().ref(firebaseRoot);
      let uploadTask = storageRef.child(name).put(blob);

      deleteLastClip();

      // from https://firebase.google.com/docs/storage/web/upload-files, see also https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask
      // Register three observers:
      // 1. 'state_changed' (firebase.storage.TaskEvent.STATE_CHANGED) observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
        console.log('Upload failed!');
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log("File uploaded: (" + uploadTask.snapshot.totalBytes, "bytes)", downloadURL);

        // Store reference to Database
        let data = {
          time: time,
          downloadURL: downloadURL,
          date: d.toISOString(),
          name: name
        }

        let databaseRef = firebase.database().ref(firebaseRoot).push(data);

        // create new clip element referencing the data on firebase
        clipName = d.toISOString();
        //console.log(clipName);
        //var blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
        //chunks = [];
        audioURL = downloadURL;
        createClip(clipName, audioURL);
      });
    }

    function deleteLastClip() {
      var clip = soundClips.lastElementChild; // when used lastElement then got text node of comments, even though soundClips.children.length was 0! Looks like childElementCount would be better
      if (clip) {
        window.URL.revokeObjectURL(clip.firstChild.src); // this should be equal to audioURL at this point, not a problem if we end up calling on a URL that is not a blob
        soundClips.removeChild(clip); // should not throw error even if there is no last child
        // we might be tempted to null blob here, but not necessary since we're reusing the blob variable
      }
    }

    // triggered when stop button stops the MediaRecorder
    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var clipName = ''; //prompt('Enter a name for your sound clip?','My unnamed clip');
      //console.log(clipName);
      blob = new Blob(chunks, {
        'type': 'audio/webm; codecs=opus'
      });
      chunks = [];
      audioURL = window.URL.createObjectURL(blob);
      createClip(clipName, audioURL).play();
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  function createClip(clipName, audioURL) {
    // clipName was here
    var clipContainer = document.createElement('article');
    var clipLabel = document.createElement('p');
    audio = document.createElement('audio');
    var deleteButton = document.createElement('button');

    clipContainer.classList.add('clip');
    audio.setAttribute('controls', '');

    audio.onended = (function() {
      // console.log('audio ended');
      restartTimeout = setTimeout(function() {
        restart.click()
      }, TimerRestart);
    });

    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.style.display = "none";

    if (clipName === null) {
      clipLabel.textContent = 'My unnamed clip';
    } else {
      clipLabel.textContent = clipName;
    }

    // clipContainer.appendChild(audio);
    // clipContainer.appendChild(clipLabel);
    // clipContainer.appendChild(deleteButton);
    // soundClips.appendChild(clipContainer);

    audio.controls = true;
    // blob was here
    // audioURL was here
    audio.src = audioURL;
    // console.log("recorder stopped");

    deleteButton.onclick = function(e) {
      evtTgt = e.target;
      evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);

      // added to allow garbage collection of blobs
      // variable binding seems to occur and persist, so we can reference audioURL and deleteButton
      // and they will refer to the values current on binding!?
      // we'd also want to null blob if there were more references to it around
      // all three ways of obtaining src are equivalent and equal to originally audioURL
      // note must get src before removing elements but not if using audioURL
      //let src = evtTgt.parentNode.querySelector("audio").src;
      //let src = this.parentNode.querySelector("audio").src;
      //let src = deleteButton.parentNode.querySelector("audio").src;
      // console.log(src, audioURL);
      // if (src.includes("blob")) {
      //   window.URL.revokeObjectURL(src);
      // }
      if (audioURL.includes("blob")) {
        window.URL.revokeObjectURL(audioURL);
      }
    }

    clipLabel.onclick = function() {
      var existingName = clipLabel.textContent;
      var newClipName = prompt('Enter a new name for your sound clip?');
      if (newClipName === null) {
        clipLabel.textContent = existingName;
      } else {
        clipLabel.textContent = newClipName;
      }
    }
    return audio;
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.getUserMedia(constraints, onSuccess, onError);
} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  // console.log('visualize stream');
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  draw()

  function draw() {
    requestAnimationFrame(draw);

    // console.log('rt: ' + rt);

    // WIDTH = (rt / (45.3)); // 397 divided by 180000 * 100

    // console.log('WIDTH: ' + WIDTH);

    // recordInterval = setInterval(updateWidth, 1);
    //
    // function updateWidth() {
    //   console.log('rt: ' + rt);

    //   if (rt > 1000) {
    //     cancelAnimationFrame(draw);
    //     clearInterval(recordInterval);
    //     recordInterval = null;
    //     rt = 0;
    //   } else {
    //     WIDTH = (rt / 397) * 4.;
    //     rt++;
    //     // from original code
    //     requestAnimationFrame(draw);
    //   }
    //  }

    analyser.getByteTimeDomainData(dataArray);

    // if (rt > 0) {
    //   canvasCtx.fillStyle = 'rgba(20, 204, 247, 1)';
    // } else {
    //   // resets canvas bkgd to white
    //   canvasCtx.fillStyle = 'rgba(255, 255, 255, 1)';
    //   canvasCtx.fillRect(0, 0, 397, HEIGHT);
    // }

    canvasCtx.fillStyle = 'rgba(255, 255, 255, 1)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(212, 239, 15)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;


    for (var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

  }
}
