<div class="flashcard flashcard-<?php echo $card->cid; ?>"
  data:cid="<?php echo $card->cid; ?>"
  data:did="<?php echo $card->did; ?>"
  data:recdir="<?php echo $card->recdir; ?>"
  data:sound="<?php echo $card->sound; ?>"
  data:record="<?php echo $card->recording; ?>"
  data:play_plan="<?php echo $settings->play_mode; ?>"
  data:autoplay="<?php echo $settings->autoplay ? 1 : 0; ?>"
  data:next_path="<?php echo $card->next_path;  ?>">
  <div class="card"<?php echo $card->recording ? ' data:recording="' . $card->recording . '"':''; ?>>
    <div class="original"><?php echo $card->original; ?></div>
    <div class="transcript"><?php echo $card->transcript; ?></div>
    <div class="translation"><?php echo $card->translation; ?></div>
    <?php 
      $original = str_replace("\n", ' ', strip_tags($card->original));
    ?>
  </div>
  <div class="views-count">
    <a href="https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=<?php echo $original; ?>" target="translate">GT</a>
    <a href="/" id="gt-sel" title="Google translate selection" target="translate">GTSEL</a> 
  <?php 
      echo l(t('Next'), $card->next_path, array(
        'attributes' => array(
          'id' => 'btn-next',
        ),
      ));
      echo $card->hide_link;
      echo $card->audioreview_link;
      echo $card->writereview_link;
      $card->classRecord = $card->recording ? 'recording-show' : 'recording-hide';
  ?>
      <span class="record" data:cid="<?php echo $card->cid; ?>">&ofcir;</span>
      <span class="play-rec <?php echo $card->classRecord; ?>" data:cid="<?php echo $card->cid; ?>">&rtrif;</span>
      <?php echo $card->delete_recording_link; ?>
  </div>
</div>
<p>
<div class="hotkeys-legend element-hidden">
  h - hide card<br />
  j - next card<br /> 
  p - play audio<br />
  a - append to audio group indicating need to study using audio files<br />
  w - append to write group - need to study writting<br />
  e - add to audio and write groups<br />
</div>
</p>

<a href="javascript:Drupal.behaviors.flashcard.showhideHotKeys();">Hotkeys</a>
