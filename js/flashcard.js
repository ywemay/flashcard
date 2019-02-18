(function($) {
  Drupal.behaviors.flashcard = {
    audio: false,
    audioPause: false,
    playPlan: [1,1,1],
    nowPlaying: 0,
    attach: function (context, settings) {
      var timer;
      var paused = false;

      $('#gt-sel').hide();
      this.playPlan = $('.flashcard').attr('data:play_plan').split(':');

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
        Drupal.behaviors.flashcard.keypress(e.which);
      });

      this.audioPlayNext();
    },
    keypress: function (keyCode) {
      switch(keyCode) {
        case 72: //H
        case 104: //h
          this.nextcmd('h');
          break;
        case 106: //j
        case 74: //J
          window.location = $('.flashcard').attr('data:next_path');
          break;
        // Play again:
        case 112: //p
        case 80:  //P
          this.playOriginal();
          break;
        // Store for audio review
        case 65: //a
        case 97:  //A 
          this.nextcmd('a');
          break;
        case 119: //w
        case 87: //W
          this.nextcmd('w');
          break;
        case 101: //e
        case 69: //E
          this.nextcmd('aw');
          break;
        case 116: //e
        case 84: //E
          this.playEn();
          break;
        case 103: //g
        case 71: //G
          this.gtsel();
          break;
        case 32:
          this.togglePlay();
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
          p.audio = new Audio(audioFile);
          p.audio.addEventListener('ended', Drupal.behaviors.flashcard.audioPlayNext);
          p.audio.play();
        }
      }
      else if ($('.flashcard').attr('data:autoplay') == '1') {
        p.gotonext();
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
