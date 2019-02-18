<?php

/**
 * Function flashcard_decks().
 */
function flashcard_decks() {

  $build = array();
  
  $header = array(
    'name' => t('Deck name'),
    'description' => t('Description'),
    'author' => t('Author'),
    'actions' => t('Actions'),
  );
  
  $query = db_select('flashcard_decks', 't')
    ->extend('PagerDefault');
  
  $query->fields('t', array('name', 'description', 'author', 'did'));

  $query->leftJoin('users', 'u', 't.uid = u.uid');
  $query->fields('u', array('name' => 'author')); 
  
  $result = $query
      ->limit(30)
      ->orderBy('t.name')
      ->execute();
  
  $rows = array();
  foreach ($result as $row) {
    $did = $row->did;
    unset($row->did);
    $row->actions = array(
      'data' => 'Actions',
    );
    $rows[] = array(
      'data' => (array) $row,
    );
  }
  
  $build['pager_table'] = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => t('There are no records found in the db'),
  );
  
  $build['pager_pager'] = array(
    '#theme' => 'pager',
  );
  return $build;
}

/**
 * Function flashcard_deck_load().
 */
function flashcard_deck_load($did) {
  $query = db_select('flashcard_decks', 't');
  $query->fields('t');
  $query->condition('t.did', $did, is_array($did) ? 'IN' : '=');
  $result = $query->execute();
  
  $rows = array();
  foreach ($result as $row) {
    $rows[] = $row;
  }
  
  return is_array($did) ? $rows : current($rows);
}

/**
 * Function flashcard_deck_create().
 */
function flashcard_deck_create() {
  global $user;
  $deck = array(
    'isNew' => TRUE,
    'name' => '',
    'description' => '',
    'uid' => $user->uid,
  );
  return $deck;
}

/**
 * Function flashcard_deck_form_wrapper().
 */
function flashcard_deck_form_wrapper($mode, $deck = NULL) {
  if ($mode == 'create') {
    $deck = flashcard_deck_create();
    $mode = 'edit';
  }
  if ($mode == 'edit') {
    return drupal_get_form('flashcard_deck_edit_form', $deck);
  }
  if ($mode == 'delete') {
    return drupal_get_form('flashcard_deck_delete_form', $deck);
  }
}

/**
 * Function flashcard_deck_edit_form().
 */
function flashcard_deck_edit_form($form, $form_state, $deck = NULL) {

  $form['name'] = array(
    '#title' => t('Deck name'),
    '#type' => 'textfield',
    '#size' => 30,
    '#required' => TRUE,
    '#default_value' => $deck->name,
    '#autocomplete_path' => FALSE,
    '#description' => t('The name of the deck. Shall be unique.'),
  );

  $form['description'] = array(
    '#title' => t('Description'),
    '#type' => 'text',
    '#default_value' => $deck->description,
    '#cols' => 60,
    '#rows' => 5,
  );

  $form['actions']['save'] = array(
    '#type' => 'submit', 
    '#value' => t('Save'),
  );

  return $form;
}

/**
 * Function flashcard_edit_deck_submit().
 */
function flashcard_deck_edit_form_submit($form, $form_state) {
  $values = $form_state['values'];
  $deck = $form_state['build_info']['args'][0];
  if (flashcard_deck_save($deck)) {
    drupal_set_message(t('Record saved successfully...'));
  }
  else {
    drupal_set_message(t('Failed to save the record...'), 'error');
  }
}

/**
 * Function flashcard_deck_delete_form().
 */
function flashcard_deck_delete_form($form, &$form_state, $deck) {
  return confirm_form($form,
    t('Are you sure you want to delete %title?', array('%title' => $deck->name)),
    'flashcard/decks',
    t('This action cannot be undone.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * Function flashcard_delete_form_submit().
 */
function flashcard_deck_delete_form_submit($form, &$form_state) {
  if ($form_state['values']['confirm']) {
    $deck = $form_state['build_info']['args'][0];
    flashcard_deck_delete($deck);
    $arr = array('%title' => $deck->name);
    watchdog('deck', 'deck %title deleted.', $arr);
    drupal_set_message(t('deck %title deleted.', $arr));
  }
  $form_state['redirect'] = 'flashcard'; 
}

/**
 * Function flashcard_deck_delete().
 */
function flashcard_deck_delete($deck) {
  db_delete('flashcard_decks')
    ->condition('t.did', $deck->did, 'IN')
    ->execute();
}

