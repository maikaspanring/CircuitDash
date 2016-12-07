// fires when the document is ready \(o.o)/
$(document).ready(function(){
  var bmusic = document.getElementById("bmusic");
  bmusic.volume = 0.5;

  $(".lsvg").each(function(){
    $(this).load($(this).attr('svgsrc'));
  });
});

// Mute Click Handler
$( "#mute" ).on( "click", function() {
  var bmusic = document.getElementById("bmusic");
  if(bmusic.muted == false) {
    bmusic.muted = true;
  } else {
    bmusic.muted = false;
  }
});

$( ".elements" ).draggable({ revert: "invalid", scroll: false });

$( ".droppable" ).droppable({
  accept: ".elements",
  classes: {
    "ui-droppable-active": "ui-state-active",
    "ui-droppable-hover": "ui-state-hover"
  },
  // bei drop immer nur in bestimmte Regionen zulassen und immer auf diese zurückswitchen
  drop: function( event, ui ) {
    $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
    if($(this).attr('do') == 'accept'){
      $(this).droppable('option', 'accept', ui.draggable);
    }
  },
  out: function(event, ui){
    $(this).droppable('option', 'accept', '.elements');
  }
});

// touch feedback start
$('.Btn').bind('touchstart', function() {
    d3.select(this).select('svg').select('#layer2').select('path').style('fill', "white");
});
// touch feedback end
$('.Btn').bind('touchend', function() {
    d3.select(this).select('svg').select('#layer2').select('path').style('fill', "black");
});

// what to do when a tap is fired
$( ".Btn" ).on("tap",function(){
  var todo = $(this).attr('do');
  switch(todo){
    // switch to Main Menu
    case 'mainmenu':
      $('.mainMenuDiv').show();
      $('.gameMenuDiv').hide();
      $('.gameDiv').hide();
    break;
    // switch to level selection
     case 'newgame':
      $('.mainMenuDiv').hide();
      $('.gameMenuDiv').show();
      $('.gameDiv').hide();
    break;
    // switch to Game View
    case 'startlevel':
      $('.gameMenuDiv').hide();
      $('.gameDiv').show();
    break;
    // TODO: Check for posible expetions
    default:

    break;
  }
});

// Main SVG Loader Function
function loadsvg(src){
  $(this).html($.get(src));
}

// TODO: Do we realy need this? NS
function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}
