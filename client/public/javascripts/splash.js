(function(){
  fitToWindow($('section'));

  $(window).resize(function() {
    fitToWindow($('section'));
  });

  function fitToWindow(node) {
    var windowHeight = $(window).height();
    var minHeight = node.css('min-height');
    var height = windowHeight;
    if (windowHeight < minHeight) {
      height = minHeight;
    };
    node.css('width', $(window).width());
    node.css('height', height);
  };
})();