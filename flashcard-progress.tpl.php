<?php $p = $stats->percent; ?>
<div class="stats">
  <svg viewBox="0 0 64 64" class="pie" title="Total: <?php echo $stats->total_cards; ?>">
    <circle r="25%" cx="50%" cy="50%"
        style="stroke: green; stroke-dasharray: <?php echo $p->hiden_cards; ?> 100; stroke-dashoffset: 0;">
    </circle>
    <circle r="25%" cx="50%" cy="50%"
        style="stroke: yellow; stroke-dasharray: <?php echo $p->common; ?> 100; stroke-dashoffset: <?php $offset = -$p->hiden_cards; echo $offset; ?>;">
    </circle>
    <circle r="25%" cx="50%" cy="50%"
        style="stroke: orange; stroke-dasharray: <?php echo $p->to_audioreview;; ?> 100; stroke-dashoffset: <?php $offset -= $p->common; echo $offset; ?>;">
    </circle>
    <circle r="25%" cx="50%" cy="50%"
        style="stroke: blue; stroke-dasharray: <?php echo $p->to_writereview;; ?> 100; stroke-dashoffset: <?php $offset -= $p->to_audioreview; echo $offset; ?>;">
    </circle>
  </svg>
  <div class="stats-legend">
    <div class="pie-total-cards"><span>&nbsp;</span> <?php echo t('Total cards:') . ' ' . $stats->total_cards; ?></div>
    <div class="pie-hiden-cards"><span>&nbsp;</span> <?php echo t('Hidden cards:') . ' ' . $stats->hiden_cards . '/' . $p->hiden_cards . '%'; ?></div>
    <div class="pie-review-both"><span>&nbsp;</span> <?php echo t('Styding both, pronunciation and writing:') . ' ' . $stats->common . '/' . $p->common . '%'; ?></div>
    <div class="pie-review-audio"><span>&nbsp;</span> <?php echo t('Styding prononciation:') . ' ' . $stats->to_audioreview . '/' . $p->to_audioreview . '%'; ?></div>
    <div class="pie-review-writing"><span>&nbsp;</span> <?php echo t('Styding writing:') . ' ' . $stats->to_writereview . '/' . $p->to_writereview . '%'; ?></div>
  </div>
</div>
