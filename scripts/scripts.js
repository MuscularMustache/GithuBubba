var fileTitle = $('.js-selectable-text');

fileTitle.on('click', function(){
  var $self = $(this);
  var diffContent = $self.parents('.js-details-container').find('.highlight.blob-wrapper');
  if ($self.hasClass('closed')) {
    $self.removeClass('closed');
    diffContent.css('display', 'block');
  } else {
    $self.addClass('closed');
    diffContent.css('display', 'none');
  }  
});