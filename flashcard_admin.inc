<?php

/**
 * Function flashcard.admin_form_wrapper().
 */
function flashcard_admin_form_wrapper($mode, $deck, $card = NULL) {
  if (!$card) $card = flashcard_create($deck->did);
  if ($mode == 'add') $mode = 'edit';
  return drupal_get_form('flashcard_admin_' . $mode . '_form', $deck, $card);
}

/**
 * Function flashcard_admin_edit_form().
 */
function flashcard_admin_edit_form($form, $form_state, $deck, $card) {

  $card = (object) $card;

  $form['card']['#tree'] = TRUE;

  $form['card']['iid'] = array(
    '#title' => t('Image'),
    '#type' => 'managed_file',
    '#default_value' => $card->iid,
    '#upload_location' => 'public://flashcard/img/',
  );

  $form['card']['original'] = array(
    '#title' => t('Original'),
    '#type' => 'textfield',
    '#size' => 60,
    '#required' => TRUE,
    '#default_value' => $card->original,
    '#autocomplete_path' => FALSE,
    '#description' => t('The text for the phrase to learn.'),
  );

  $form['card']['transcript'] = array(
    '#title' => t('Transcript'),
    '#type' => 'textfield',
    '#size' => 60,
    '#default_value' => $card->transcript,
    '#autocomplete_path' => FALSE,
    '#description' => t('Transcription for the original text.'),
  );

  $form['card']['translation'] = array(
    '#title' => t('Translation'),
    '#type' => 'textfield',
    '#size' => 60,
    '#required' => TRUE,
    '#default_value' => $card->translation,
    '#autocomplete_path' => FALSE,
  );

  $form['card']['sid'] = array(
    '#title' => t('Sound'),
    '#type' => 'managed_sound_file',
    '#default_value' => $card->sid,
  );

  /*
  $form['card']['sound'] = array(
    '#type' => 'hidden',
    '#default_value' => $card->sound,
    '#description' => 'The sound recording suitable for the learning/original text.',
  );

  $form['card']['record'] = array(
    '#type' => 'hidden',
    '#default_value' => $card->recording,
    '#description' => 'Translation/explanation audio.',
  );
   */
  $form['actions']['save'] = array(
    '#type' => 'submit', 
    '#value' => t('Save'),
  );

  return $form;
}


/**
 * Function flashcard_admin_edit_form_submit().
 */
function flashcard_admin_edit_form_submit($form, $form_state) {
  $values = $form_state['values'];
  $deck = $form_state['build_info']['args'][0];
  $card = $oldCard = $form_state['build_info']['args'][1];
  $c = $values['card'];

  $card->did = $deck->did;
  foreach ($values['card'] as $k => $v) {
    $card->{$k} = $v;
  }

  dpm($oldCard);
  dpm($card);

  flashcard_adjust_file_usage($card, $oldCard, 'iid');
  flashcard_adjust_file_usage($card, $oldCard, 'sid');
  if (flashcard_save($card)) {
    drupal_set_message(t('Record saved successfully...'));
  }
  else {
    drupal_set_message(t('Failed to save the record...'), 'error');
  }
}

/**
 * Function flashcard_admin_delete_form().
 */
function flashcard_admin_delete_form($form, &$form_state, $card) {
  return confirm_form($form,
    t('Are you sure you want to delete %title?', array('%title' => $card->original)),
    'company/' . $card->cid,
    t('This action cannot be undone.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * Function flashcard_admin_delete_form_submit().
 */
function flashcard_admin_delete_form_submit($form, &$form_state) {
  if ($form_state['values']['confirm']) {
    $card = $form_state['build_info']['args'][0];
    card_delete($card);
    $arr = array('%title' => $card->original);
    watchdog('card', 'card %title deleted.', $arr);
    drupal_set_message(t('card %title deleted.', $arr));
  }
  $form_state['redirect'] = 'flashcard/deck/' . arg(2); 
}


