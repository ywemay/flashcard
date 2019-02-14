<?php
$modpath = drupal_get_path('module', 'flashcard');
$soundpath = $modpath . '/audio';
$toReplace = array("/^\[(sound\:)/", "/\]$/");

foreach($rows as $card) {
  $card->sound = $soundpath . '/' . preg_replace($toReplace, '', trim($card->sound));
  $card->classRecord = $card->recording ? 'recording-show' : 'recording-hide';
?>
<div class="flashcard flashcard-<?php echo $card->cid; ?>" data:cid="<?php echo $card->cid; ?>">
  <div class="flashcard-original"><?php echo $card->original; ?></div>
  <div class="flashcard-play"><span class="flashcard-play-btn" data:sound="<?php echo $card->sound; ?>">&#9658;</span></div>
  <div class="flashcard-transcript"><?php echo $card->transcript; ?></div>
  <div class="flashcard-translation"><?php echo $card->translation; ?></div>
  <div class="flashcard-user-data">
    <span class="flashcard-views"><?php echo $card->views_count; ?></span>
    <?php echo $card->hide_link; ?>
    <?php echo $card->audioreview_link; ?>
    <?php echo $card->writereview_link; ?>
    <span class="record" data:cid="<?php echo $card->cid; ?>">&ofcir;</span>
    <span class="play <?php echo $card->classRecord; ?>">&rtrif;</span>
    <?php echo $card->delete_recording_link; ?>
  </div>
</div>
<?php
}
?>
<form id="audio_upload_form"></form>
<input type="hidden" id="recdir" class="recdir" value="<?php echo $recdir; ?>" />
