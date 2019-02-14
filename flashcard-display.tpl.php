<div class="card">
  <div class="original"><?php echo $card->original; ?></div>
  <div class="transcript"><?php echo $card->transcript; ?></div>
  <div class="translation"><?php echo $card->translation; ?></div>
  <div class="sound hidden-element"><?php echo $card->sound; ?></div>
</div>
<?php 
  $original = str_replace("\n", ' ', strip_tags($card->original));
?>
<div class="views-count">
  <a href="https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=<?php echo $original; ?>" target="translate">GT</a>
  <a href="/" id="gt-sel" title="Google translate selection" target="translate">GTSEL</a> 
<?php 
    echo l(t('Next'), 'flashcard/train/' . $nextCard->cid, array(
      'attributes' => array(
        'id' => 'btn-next',
      ),
    ));
?>
</div>
 
<div class="hidden-element">
<?php if ($nextCard) {?>
  <div id="nextcard" class="nextcard"><?php $nextCard->cid; ?></div>
<?php } ?>
  <div id="cid"><?php echo $card->cid; ?></div>
  <div id="autoplay"><?php echo $settings->autoplay ? 1 : 0; ?></div>
</div>

<p>
<div class="hotkeys-legend element-hidden">
  h - hide card<br />
  j - next card<br /> 
  p - play audio<br />
  a - append to audio group indicating need to study using audio files<br />
  w - append to write group - need to study writting<br />
  e - add to audio and write groups<br />
  x - toggle autoplay<br />
</div>
</p>

<a href="javascript:Drupal.behaviors.flashcard.showhideHotKeys();">Hotkeys</a>
