if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

$('.actions .show-file-notes').after('<button class="minibutton collapsable">Hide Diff</button>');
$('.actions .show-file-notes').after('<button class="minibutton hide-add-content">Toggle +</button>');

$('body').on('click', '.minibutton.collapsable', function(){
  var $self = $(this);
  var diffContent = $self.parents('.js-details-container').find('.highlight.blob-wrapper');
  if (diffContent.hasClass('closed')) {
    diffContent.removeClass('closed');
    $self.text('Hide Diff');
  } else {
    diffContent.addClass('closed');
    $self.text('Show Diff');
  }
});

$('body').on('click', '.minibutton.hide-add-content', function(){
  var button = $(this);
  var addContent = button.parents('.js-details-container').find('.highlight.blob-wrapper .blob-code.blob-code-addition');

  addContent.each(function(){
    var $self = $(this); // each code addition line
    var origText = $self.text();
    if (origText.startsWith('+')) {
      $self.text($self.text().substring(1));
    } else {
      $self.text('+' + origText);
    }
  });

});
