// fires when the document is ready \(o.o)/ test
$(document).ready(function(){
  var bmusic = document.getElementById("bmusic");
  bmusic.volume = 0.5;

  // load svg files into all elements with the class lsvg and an svgsrc attr
  $(".lsvg").each(function(){
    src = $(this).attr('svgsrc');
    loadsvg(this, src);
  });

  /*********************
   * APP Event Handler *
   *********************/

  // Mute Click Event Handler
  $( "#mute" ).on( "click", function() {
    var bmusic = document.getElementById("bmusic");
    if(bmusic.muted == false) {
      bmusic.muted = true;
    } else {
      bmusic.muted = false;
    }
  });

  // make all classes "elements" draggable
  $( ".elements" ).draggable({ revert: "invalid", scroll: false });

  // make all classes droppable to droppable place
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

  // user tab/click event Handler
  $( ".Btn" ).on("tap",function(){
    var todo = $(this).attr('do');
    switch(todo){
      // switch back Main Menu
      case 'mainmenu':
        hideMenu();
        $('.mainMenuDiv').show();
      break;
      // switch to level selection
      case 'newgame':
        hideMenu();
        $('.gameMenuDiv').show();
      break;
      // TODO: settings is for DEBUG MODE (change this to real settings)
      case 'settings':
        hideMenu();
        $('.levelEngine').show();
      break;
      // switch to Game View
      case 'startlevel':
        hideMenu();
        $('.gameDiv').show();
      break;
      // TODO: Check for posible expetions
      default:

      break;
    }
  });
});

function hideMenu(){
  $('.menu').hide();
}


// Main SVG Loader Function
function loadsvg(obj, src){
  $(obj).load(src);
}

// TODO: Do we realy need this? NS
function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}
