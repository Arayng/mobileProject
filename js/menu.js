$(function(){
  $('.nav-btn').on('click',function(){
    $('.nav').toggleClass('menuOn')
  });
  $(document).on('mouseup', e => {
    if ($('.nav').has(e.target).length == 0) {
      $('.nav').removeClass('menuOn')
    };
  });
});

