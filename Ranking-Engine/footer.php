<footer class="footer page-footer">
    <div class="footer-copyright">
      Designed by Brian Casey | v<?php echo getRankingEngineVersion() ?> | © 2019 Pub Meeple
    </div>
    <div class="footer-links">
      <a class="grey-text text-lighten-4 right" href="https://www.pubmeeple.com/about">About</a>
      <a class="grey-text text-lighten-4 right" href="https://www.pubmeeple.com/contact">Contact</a>
      <a class="grey-text text-lighten-4 right" href="https://www.pubmeeple.com/support-us">Support Us</a>
    </div>
  </footer>
</div>

    <?php wp_footer(); ?>

  <script type="text/javascript">
    const getUserID = () => {
      return <?php echo get_current_user_id(); ?>;
    }

    const getThemePath = () => {
      return '<?php echo get_theme_file_uri(); ?>'
    }

    const getFilePath = (file) => {
      const themePath = '<?php echo get_theme_file_uri(); ?>'
      return `${themePath}${file}`
    }
  </script>
  </body>
</html>