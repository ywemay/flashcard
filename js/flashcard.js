(function($) {
  Drupal.behaviors.flashcard = {
    attach: function (context, settings) {
      var timer;
      var paused = false;

      $('#gt-sel').hide();

      $('.card .original').mouseout(function(){
        var txt = Drupal.behaviors.flashcard.getSelected();
        if (txt) {
          $('#gt-sel').attr('href', 'https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=' + txt);
          $('#gt-sel').text('Translate ' + txt);
          $('#gt-sel').show();
        }
        else {
          $('#gt-sel').hide();
        }

      });

      $('body').keypress(function(e){
        console.log('Key pressed...' + e.which);
        switch(e.which) {
          case 72: //H
          case 104: //h
            //hide card command
            var nextId = $('.nextcard').text();
            var suffix = "/h/" + $('#cid').text();
            window.location = '/flashcard/train/' + nextId + suffix;
            break;
          case 106: //j
          case 74: //J
            window.location = '/flashcard/train/' + $('.nextcard').text();
            break;
          // Play again:
          case 112: //p
          case 80:  //P
            Drupal.behaviors.flashcard.playOriginal();
            break;
          // Store for audio review
          case 65: //a
          case 97:  //A 
            Drupal.behaviors.flashcard.nextcmd('a');
            break;
          case 119: //w
          case 87: //W
            Drupal.behaviors.flashcard.nextcmd('w');
            break;
          case 101: //e
          case 69: //E
            Drupal.behaviors.flashcard.nextcmd('aw');
            break;
          case 116: //e
          case 84: //E
            Drupal.behaviors.flashcard.playEn();
            break;
          case 103: //g
          case 71: //G
            Drupal.behaviors.flashcard.gtsel();
            break;
        }
      });

      this.playOriginal();
    },
    gotonext: function () {
      var nextId = $('.nextcard').text();
      window.location = '/flashcard/train/' + nextId;
    },
    gotonextIfAuto: function () {
      if ($('#autoplay').text() == '1') {
        this.gotonext();
      }
    },
    playOriginal: function () {
      var audioFile = '/' + $('.sound').text();
      var audio = new Audio(audioFile);
      audio.addEventListener('ended', function() {
        var recordingUrl = $('.card').attr('data:recording');
        if (recordingUrl) {
          var audioRec = new Audio(recordingUrl);
          audioRec.addEventListener('ended', function() {
            var audio2 = new Audio(audioFile);
            audio2.play();
            audio2.addEventListener('ended', function() {
              Drupal.behaviors.flashcard.gotonextIfAuto();
            });
          });
          audioRec.play();
        }
        else {
          Drupal.behaviors.flashcard.gotonextIfAuto();
        }
      });
      audio.play();
    },
    // Next card with command attached:
    nextcmd: function(cmd) {
      var nextId = $('.nextcard').text();
      var suffix = "/" + cmd + "/" + $('#cid').text();
      window.location = '/flashcard/train/' + nextId + suffix;
    },
    playEn: function() {
      var msg = new SpeechSynthesisUtterance($('.translation').text());
      msg.rate = 0.9;
      msg.volume = 0.4;
      msg.pitch = 1;
      speechSynthesis.speak(msg);
    },
    getSelected: function () {
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    },

    gtsel: function () {
      var txt = this.getSelected();
      if (!txt) {
        alert("No text selected to translate in google...");
      }
      else {
        var win = window.open('https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=' + txt, 'translate');
        win.focus();
      }
    },
    showhideHotKeys: function(){
      var hotklegend = $('.hotkeys-legend');
      if (hotklegend.is(':visible')) {
        hotklegend.hide();
      }
      else hotklegend.show();
    },
  };
}(jQuery));
