(function($) {
  Drupal.behaviors.flashcardList = {
    attach: function (context, settings) {

      $('.flashcard-play-btn').mouseup(function() {
        var audio = new Audio('/' + $(this).attr('data:sound'));
        audio.play();
      });

    },
  };
}(jQuery));
