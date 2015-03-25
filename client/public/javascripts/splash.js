(function(){
  $('#header').css('width', $(window).width());
  $('#header').css('height', $(window).height());

  $(window).resize(function() {
    $('#header').css('width', $(window).width());
    $('#header').css('height', $(window).height());
  });
})();