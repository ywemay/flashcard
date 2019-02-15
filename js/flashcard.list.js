(function($) {
  Drupal.behaviors.flashcardList = {
    mediaRecorder: null,
    uploadAudio: function(fileBlob) {
    },
    attach: function (context, settings) {

      $('.flashcard-play-btn').mouseup(function() {
        Drupal.behaviors.flashcardList.play('/' + $(this).attr('data:sound'));
      });

      $('.flashcard .play').mouseup(function() {
        var sCid = $(this).parent().parent('.flashcard').attr('data:cid');
        var sndFile = $('.recdir').val() + '/' + sCid + '.mp3?' + Math.floor(Math.random() * 1000);
        console.log(sndFile);
        Drupal.behaviors.flashcardList.play(sndFile);
      });


      var record = document.querySelector('.record');
      var stop = document.querySelector('.stop');
      var nowRecording = 0;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
         console.log('getUserMedia supported.');
         navigator.mediaDevices.getUserMedia (
            // constraints - only audio needed for this app
            {
               audio: true
            })

            // Success callback
            .then(function(stream) {
              var mediaRecorder = new MediaRecorder(stream);
              //let stream = new Blob(audioChunks, {type: 'audio/x-mpeg-3'});      

              jQuery('.record').mouseup(function() {
                var recId = $(this).attr('data:cid');
                if (nowRecording >0) {
                  if (recId == nowRecording) {
                    mediaRecorder.stop();
                    console.log('Stop recording');
                    $(this).removeClass('recording');
                    return;
                  }
                  console.log('Now recording ' + nowRecording);
                  return;
                }
                nowRecording = recId;
                $(this).addClass('recording');
                mediaRecorder.start();
              });

              var chunks = [];

              mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
              }

              mediaRecorder.onstop = function(e) {
                console.log("recorder stopped");
                //var blob = new File(chunks, clipName + '.mp3', {'type' : 'audio/x-mpeg-3' });
                var iCid = '' + nowRecording;
                nowRecording = 0;

                var blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'});
                chunks = [];

                var oData = new FormData(audio_upload_form);
                oData.append("audiofile", blob, iCid + ".ogg");
                var oReq = new XMLHttpRequest();
                oReq.open("POST", '/flashcard/audioupload', true);
                oReq.onload = function(oEvent) {
                  if (oReq.status == 200) {
                    console.log("Uploaded!");
                    $('.flashcard-' + iCid +' .play').removeClass('recording-hide');
                    $('.flashcard-' + iCid + ' .delete').removeClass('recording-hide');
                  } else {
                    console.log("Error " + oReq.status + " occurred when trying to upload your file.");
                  }
                };
                oReq.send(oData);
              }
            })

            // Error callback
            .catch(function(err) {
               console.log('The following getUserMedia error occured: ' + err);
            }
         );
      } else {
         console.log('getUserMedia not supported on your browser!');
      }
    },
    play: function(audioFileUrl) {
      var audio = new Audio(audioFileUrl);
      audio.play();
    },
    record: function(){
    },
  };
}(jQuery));
