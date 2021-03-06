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
        Drupal.behaviors.flashcard.keypress(e.which);
      });

      this.audioPlayNext();
    },
    keypress: function (keyCode) {
      var chr = String.fromCharCode(keyCode);
      var cid = $('.flashcard').attr('data:cid');
      switch(chr) {
        case ('h'): //h
          //this.nextcmd('h');
          var el = document.getElementById('flashcard-toggle-hide-link-' + cid);
          el.click();
          break;
        case 'j':
        case 'n':
          window.location = $('.flashcard').attr('data:next_path');
          break;
        // Play again:
        case 'p':  //P
          this.nowPlaying = 0;
          this.audioPlayNext();
          break;
        // Store for audio review
        case 'a': //a
          //this.nextcmd('a');
          var el = document.getElementById('flashcard-toggle-audio-link-' + cid);
          el.click();
          break;
        case 'w': //W
          //this.nextcmd('w');
          var el = document.getElementById('flashcard-toggle-write-link-' + cid);
          el.click();
          break;
        case 'q': //e
          //this.nextcmd('aw');
          var el = document.getElementById('flashcard-toggle-audio-link-' + cid);
          el.click();
          var el = document.getElementById('flashcard-toggle-write-link-' + cid);
          el.click();
          break;
        case 'e': //E
          this.playEn();
          break;
        case 'g': //g
          this.gtsel();
          break;
        case ' ':
          this.togglePlay();
          break;
        case 'r':
          var elclass = 'record';
          var el = document.getElementsByClassName(elclass);
          if (el[0]) {
            var evnt = new Event('mouseup');
            el[0].dispatchEvent(evnt);
          }
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
