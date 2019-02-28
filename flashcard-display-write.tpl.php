<div class="flashcard flashcard-<?php echo $card->cid; ?>"
  data:cid="<?php echo $card->cid; ?>"
  data:did="<?php echo $card->did; ?>"
  data:recdir="<?php echo $card->recdir; ?>"
  data:sound="<?php echo $card->sound; ?>"
  data:record="<?php echo $card->recording; ?>"
<?php $toReplace = array("\n", '。','，','？','！'); ?>
  data:original="<?php echo trim(strip_tags(str_replace($toReplace, '', $card->original))); ?>"
  data:play_plan="<?php echo $settings->play_mode; ?>"
  data:playbackRate="<?php echo $settings->playback_rate; ?>"
  data:autoplay="<?php echo $settings->autoplay ? 1 : 0; ?>"
  data:next_path="<?php echo $card->next_path;  ?>">
  <div class="card"<?php echo $card->recording ? ' data:recording="' . $card->recording . '"':''; ?>>
    <div class="original hidden"><?php echo $card->original; ?></div>
    <div class="original-input"><input name="original-input" size=40 /></div>
    <div class="transcript hidden"><?php echo $card->transcript; ?></div>
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
    echo $card->scores; 
    ?>
  </div>
</div>
