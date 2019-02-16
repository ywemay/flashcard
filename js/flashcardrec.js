(function($) {
  Drupal.behaviors.flashcardrec = {
    attach: function (context, settings) {
      $('.play-rec').mouseup(function() {
        var sCid = $(this).attr('data:cid');
        if (!sCid) {
          sCid = $(this).parent().parent('.flashcard').attr('data:cid');
        }
        var sndFile = $('.recdir').val() + '/' + sCid + '.mp3?' + Math.floor(Math.random() * 1000);
        var audio = new Audio(sndFile);
        audio.play();
      });

      var record = document.querySelector('.record');
      var nowRecording = 0;

      if (!$("#audio_upload_form").length) {
        console.log('append audio form');
        $('body').append('<form id="audio_upload_form"></form>');
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
         console.log('getUserMedia supported.');
         navigator.mediaDevices.getUserMedia ({audio: true})
           .then(function(stream) {
              var mediaRecorder = new MediaRecorder(stream);
              jQuery('.record').mouseup(function() {
                var recId = $(this).attr('data:cid');
                if (nowRecording >0) {
                  if (recId == nowRecording) {
                    mediaRecorder.stop();
                    $(this).removeClass('recording');
                    return;
                  }
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
                    $('.flashcard-' + iCid +' .play-rec').removeClass('recording-hide');
                    $('.flashcard-' + iCid + ' .delete').removeClass('recording-hide');
                  } else {
                    console.log("Error " + oReq.status + " occurred when trying to upload your file.");
                  }
                };
                oReq.send(oData);
              }
            })

            .catch(function(err) {
               console.log('The following getUserMedia error occured: ' + err);
            }
         );
      } else {
         console.log('getUserMedia not supported on your browser!');
      }
    },
  };
}(jQuery));
