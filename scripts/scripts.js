(function() {

  var INJECT_BUTTON_TRY_TIMES = 10;
  var INJECT_BUTTON_TRY_INTERVAL = 500;
  var injectCounter = 0;

  function injectButtons() {
    setTimeout(function() {
      var $commitFiles = $('.actions .show-file-notes');

      if ($('.minibutton.hide-add-content').length) {
        return;
      }

      if (!$commitFiles.length && injectCounter <= INJECT_BUTTON_TRY_TIMES) {
        injectCounter++;
        injectButtons();
      } else {
        $commitFiles.after('<button class="minibutton hide-add-content">Toggle +/-</button><button class="minibutton collapsable">Hide Diff</button><button class="minibutton hide-deletion">Hide Deletion</button>');
      }
    }, INJECT_BUTTON_TRY_INTERVAL);
  }

  function toggleCollapse() {
    var $button      = $(this);
    var $diffContent = $button.parents('.js-details-container').find('.highlight.blob-wrapper');

    if ($diffContent.hasClass('closed')) {
      $diffContent.removeClass('closed');
      $button.text('Hide Diff');
    } else {
      $diffContent.addClass('closed');
      $button.text('Show Diff');
    }
  }

  function toggleAddDeleteSymbol() {
    var $button   = $(this);
    var $lineDiff = $button.parents('.js-details-container').find('.blob-code-addition, .blob-code-deletion');

    $lineDiff.each(function() {
      var $line    = $(this);
      var lineHtml = $line.html();

      if ($line.is('.blob-code-addition')) {
        if (/Add line comment"><\/b>\+/.test(lineHtml)) {
          $line.html(lineHtml.replace('"Add line comment"></b>+', '"Add line comment"></b>'));
        } else {
          $line.html(lineHtml.replace('"Add line comment"></b>', '"Add line comment"></b>+'));
        }
      } else {
        if (/Add line comment"><\/b>\-/.test(lineHtml)) {
          $line.html(lineHtml.replace('"Add line comment"></b>-', '"Add line comment"></b>'));
        } else {
          $line.html(lineHtml.replace('"Add line comment"></b>', '"Add line comment"></b>-'));
        }
      }
    });
  }

  function toggleDeletion() {
    var $button      = $(this);
    var $parent      = $button.parents('.js-details-container');
    var $codeDeleted = $parent.find('.blob-code-deletion');
    var $codeAdded   = $parent.find('.blob-code-addition');
    var $lineDeleted = $codeDeleted.parent();

    $lineDeleted.toggleClass('closed');

    if ($lineDeleted.is('.closed')) {
      $button.text('Show Deletion');
      $codeAdded.each(function() {
        var $line    = $(this);
        var lineHtml = $line.html();

        if (/Add line comment"><\/b>\+/.test(lineHtml)) {
          $line.html(lineHtml.replace('"Add line comment"></b>+', '"Add line comment"></b>'));
        }
      });
    } else {
      $button.text('Hide Deletion');
      $codeAdded.each(function() {
        var $line    = $(this);
        var lineHtml = $line.html();

        if (/Add line comment"><\/b>/.test(lineHtml)) {
          $line.html(lineHtml.replace('"Add line comment"></b>', '"Add line comment"></b>+'));
        }
      });
    }
  }

  $('body')
  .on('click', '.minibutton.collapsable', toggleCollapse)
  .on('click', '.minibutton.hide-add-content', toggleAddDeleteSymbol)
  .on('click', '.minibutton.hide-deletion', toggleDeletion);

  // inject buttons on file change tab button click
  $('body').on('click', '[data-container-id="files_bucket"]', function() {
    injectButtons();
  });

  // inject buttons on page load
  if ($('.actions .show-file-notes').length) {
    injectButtons();
  }

})();
