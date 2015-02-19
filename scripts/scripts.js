(function() {

  var INJECT_BUTTON_TRY_TIMES = 10;
  var INJECT_BUTTON_TRY_INTERVAL = 500;
  var injectCounter = 0;
  var fileObj = [];
  var positionFileMap = [];

  function injectButtons() {
    setTimeout(function() {
      var $commitFiles = $('.file-actions .show-file-notes');

      if ($('.minibutton.hide-add-content').length) {
        return;
      }

      if (!$commitFiles.length && injectCounter <= INJECT_BUTTON_TRY_TIMES) {
        injectCounter++;
        injectButtons();
      } else {
        $commitFiles.after('<button class="minibutton hide-add-content">Toggle +/-</button><button class="minibutton collapsable">Hide Diff</button><button class="minibutton hide-deletion">Hide Deletion</button>');

        $(window).trigger('GithuBubbaInjected')
          .trigger('DomUpdated');
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
    $(window).trigger('DomUpdated');
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

    $(window).trigger('DomUpdated');
  }

  function toggleDeletion() {
    var $button      = $(this);
    var $parent      = $button.parents('.js-details-container');
    var $codeDeleted = $parent.find('.blob-code-deletion');
    var $codeAdded   = $parent.find('.blob-code-addition');
    var $lineDeleted = $codeDeleted.parent();

    // if not delted line, do nothing
    if (!$codeDeleted.length) {
      return;
    }

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

    $(window).trigger('DomUpdated');
  }

  function updateFileReversePositions() {
    var pageHeight = document.body.getBoundingClientRect().height;
    var i = 0;

    // init each page pixel position to -1
    for (; i < pageHeight; i++) {
      positionFileMap[i] = -1;
    }

    $('#files .file').each(function(index, file) {
      var top    = file.offsetTop + 138;
      var bottom = top + file.getBoundingClientRect().height;
      var i      = top;

      // cache file meta jquery obj
      fileObj[index] = file;

      // cache position file map
      for (; i < bottom; i++) {
        positionFileMap[i] = index;
      }
    });
  }

  function setFixedFileHeader(i) {
    fileObj.forEach(function(file, index) {
      if (index === i) {
        file.classList.add('fixed-file-header');
      } else {
        file.classList.remove('fixed-file-header');
      }
    });
  }

  function bindfileScrollEvent() {
    $(window).on('scroll.file', function(e) {
      if (!(fileObj.length && positionFileMap.length)) {
        return;
      }
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      setTimeout(function() {
        setFixedFileHeader(positionFileMap[scrollTop]);
      }, 0);
    });
  }

  function unbindfileScrollEvent() {
    $(window).off('scroll.file');
  }

  $('body')
  .on('click', '.minibutton.collapsable', toggleCollapse)
  .on('click', '.minibutton.hide-add-content', toggleAddDeleteSymbol)
  .on('click', '.minibutton.hide-deletion', toggleDeletion);

  //-----------------------------------------------------------------------------
  // File Toggle Buttons Injecting
  //-----------------------------------------------------------------------------

  // inject buttons on file change tab button click
  $('body').on('click', '[data-container-id="files_bucket"], .details-collapse', function() {
    injectButtons();
  });

  // inject buttons on page load
  if ($('.file-actions .show-file-notes').length) {
    injectButtons();
  }

  //-----------------------------------------------------------------------------
  // File fixed header event binding
  //-----------------------------------------------------------------------------

  // bind scroll event at begining, be fine without supporting data
  bindfileScrollEvent();

  // refresh supporting data when dom update, delay a while to wait for page load ready
  $(window).on('DomUpdated', function() {
    setTimeout(function() {
      updateFileReversePositions();
    }, 1000);
  });

  $('body').on('click', '.js-add-line-comment, .diff-expander, [data-container-id="files_bucket"]', function() {
    setTimeout(function() {
      updateFileReversePositions();
    }, 1000);
  });


})();
