<?php
/*

Template Name: Group Results

*/
?>

<link rel="stylesheet" type="text/css" href="<?php echo get_theme_file_uri('/dist/datatables.min.css'); ?>">
<link rel="stylesheet" type="text/css" href="<?php echo get_theme_file_uri('/dist/buttons.dataTables.min.css'); ?>">

<?php get_header(); ?>

<main class="container">

  <h4 id="page-header" class="center-align">Results for:</h4>

  <div class="row">
    <div class="col s12 m6 offset-m3">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text center-align db-stats">
          <span class="card-title">Times Ranked</span>
          <div id="count-lists" class="count">...</div>
        </div>
      </div>
    </div>
  </div>
  <div class="divider-sm"></div>
  <div class="options-section"></div>

  <div id="rankings-table-wrapper"></div>

</main>

<script src="<?php echo get_theme_file_uri('/dist/groupresults-bundle.js'); ?>"></script>

<?php get_footer(); ?>