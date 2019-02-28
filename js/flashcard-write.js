
(function($) {
  Drupal.behaviors.flashcard = {
    audio: false,
    audioPause: false,
    playPlan: [1,1,1],
    nowPlaying: 0,
    attach: function (context, settings) {

      this.playPlan = $('.flashcard').attr('data:play_plan').split(':');

      $('.original-input input').focus();

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
        Drupal.behaviors.flashcard.keypress(e.which);
      });

      var expectedVal = $('.flashcard').attr('data:original');
      console.log(expectedVal);
      $('.original-input input').keyup(function(){
        if ($(this).val() == expectedVal || $(this).val() == "？") {
          $('.card .original').removeClass('hidden');
          $('.card .transcript').removeClass('hidden');
        }
        if ($(this).val() == expectedVal) {
          $('.card .original').addClass('done');
          setTimeout(function() {
            if ($('.flashcard').attr('data:autoplay') == '1') {
              Drupal.behaviors.flashcard.gotonext();
            }
          }, 3000);
        }
      });
      this.audioPlayNext();
    },
    keypress: function (keyCode) {
      var chr = String.fromCharCode(keyCode);
      var cid = $('.flashcard').attr('data:cid');
      switch(chr) {
        case '-':
          window.location = $('.flashcard').attr('data:next_path');
          break;
        case '=':  //P
          this.nowPlaying = 0;
          this.audioPlayNext();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          var elclass = 'flashcard-score-link-' + cid + '-' + chr;
          var el = document.getElementsByClassName(elclass);
          if (el[0]) el[0].click();
          break;
      }
    },
    togglePlay: function(){
      this.audioPause = !this.audioPause;
      if (!this.audioPause) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    audioPlayNext: function() {
      var p = Drupal.behaviors.flashcard;
      if (p.audioPause) return;
      if (p.nowPlaying < p.playPlan.length) {
        p.nowPlaying += 1;

        var audioFile = $('.flashcard').attr('data:sound');
        if (p.playPlan[p.nowPlaying - 1] == '2') {
          var audioFile = $('.flashcard').attr('data:record');
        }
        if (!audioFile || audioFile == 0) {
          p.audioPlayNext();
        }
        else {
          var playbackRate = $('.flashcard').attr('data:playbackRate');
          p.audio = new Audio(audioFile);
          p.audio.playbackRate = playbackRate ? playbackRate : 1.0;
          p.audio.addEventListener('ended', Drupal.behaviors.flashcard.audioPlayNext);
          p.audio.play();
        }
      }
    },
    gotonext: function () {
      window.location = $('.flashcard').attr('data:next_path');
    },
    // Next card with command attached:
    nextcmd: function(cmd) {
      var loc = $('.flashcard').attr('data:next_path');
      loc += '/' + cmd + '/' + $('.flashcard').attr('data:cid');
      window.location = loc;
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
