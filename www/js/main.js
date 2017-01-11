var dwidth = 0;
var dheight = 0;
// fires when the document is ready \(o.o)/
$(document).ready(function(){
  localStorage["1open"] = 1; // open first level
  dwidth = $(document).width();
  dheight = $(document).height();

  var bmusic = document.getElementById("bmusic");
  bmusic.play();
  bmusic.volume = 0.5;
  if(localStorage.muted == "true") {
    bmusic.muted = true;
  }

  // load svg files into all elements with the class lsvg and an svgsrc attr
  $(".lsvg").each(function(){
    src = $(this).attr('svgsrc');
    loadsvg(this, src);
  });

  if(localStorage.theme == 1){
    $('.BackgroundScroll').css("background","url('img/backgroundB.png')");
    $('.BackgroundScroll2').css("background","url('img/background2B.png')");
  }

  /*********************
   * APP Event Handler *
   *********************/

  // Mute Click Event Handler
  $( "#mute" ).on( "click", function() {
    var bmusic = document.getElementById("bmusic");
    if(bmusic.muted == false) {
      localStorage.muted = true;
      bmusic.muted = true;
    } else {
      localStorage.muted = false;
      bmusic.muted = false;
    }
  });

  $("#colorchange").on("click", function(){
    if(localStorage.theme == 0) {
      localStorage.theme = 1;
      $('.BackgroundScroll').css("background","url('img/backgroundB.png')");
      $('.BackgroundScroll2').css("background","url('img/background2B.png')");
    } else {
      localStorage.theme = 0;
      $('.BackgroundScroll').css("background","url('img/background.png')");
      $('.BackgroundScroll2').css("background","url('img/background2.png')");
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
    var from = $(this).attr('from');
    var level = $(this).attr('level');
    stopTime();
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
        $(".levelBtn").each(function(){
          var levelname = $(this).attr("level");
          var obj = $(this).find("svg").find("text").find("tspan");
          obj.html(levelname);
          $(this).find("tspan").html("test");
          $(this).find("tspan").html(levelname);
        });
        getLevelList();
      break;
      // switch to settings menu
      case 'settings':
        hideMenu();
        $('.settingsMenuDiv').show();
      break;
      // switch to help menu
      case 'help':
        hideMenu();
        $('.helpMenuDiv').show();
      break;
      case 'showlevel':
        hideMenu();
        showLevel(level);
        $('.levelDetailMenuDiv').show();
      break;
      // switch to Game View
      case 'startlevel':
        hideMenu();
        closeLevel();
        // TODO: [change this to level selector] Start Level
        addLevel(level);
        $('.gameDiv').show();
      break;
      // switch to stats menu
      case 'stats':
        hideMenu();
        $('.statsMenuDiv').show();
      break;
      case 'reset':
        localStorage.clear();
        localStorage["1open"] = 1; // open first level
      case 'loosGame':
        triggerLost();
      break;
      break;
      // TODO: Check for posible expetions
      default:

      break;
    }
    if(from == "gameDiv"){
      closeLevel();
    }
  });

  // TODO: delete next lines after debug mode:
  //var level_obj = makeNewLevel(123);
  //hideMenu();
  //addProcLevel(level_obj);
  //$('.gameDiv').show();
// end document ready function
});

// Hide all div with the class menuDiv
function closeLevel(){
  $('engine').html('');
}

// Hide all div with the class menuDiv
function hideMenu(){
  $('.menuDiv').hide();
}

// Main SVG Loader Function
function loadsvg(obj, src){
  $(obj).load(src);
}

var openAllLevels = 0;
function getLevelList(){
  $(".levelBtn").each(function(){
    level = $(this).attr("level");
    if(localStorage[level + "win"] == 1 || localStorage[level + "open"] == 1 || openAllLevels == 1){
      console.log(level, " is finishd/open");
      $(this).css("pointer-events", "auto");
      $(this).css("opacity", 1);
    } else {
      $(this).css("pointer-events", "none");
      $(this).css("opacity", 0.5);
    }
  });
}

function showLevel(id){
  d3.json("data/level/"+id+"level.json", function(error, data) {
    $('#levelDetailName').html(data.name);
    min10 = Math.floor(data.time / 60 / 10);
    min1 = Math.floor(data.time / 60 % 10);
    sec10 = Math.floor((data.time - ((min10 * 10 + min1) * 60)) / 10);
    sec1 = Math.floor((data.time - ((min10 * 10 + min1) * 60)) % 10);
    $('#levelDetailTime').html(min10 + "" + min1 + ":" + sec10 + "" + sec1 );
    $('#levelDetailDesc').html(data.desc);
    $('#levelDetailID').attr("level", id);

    stats = '';
    if(localStorage[id+'winN'] != undefined) stats+= 'Wins: '+localStorage[id+'winN'] + '<br>';
    if(localStorage[id+'time'] != undefined) stats+= 'Best time left: '+localStorage[id+'time']+' sec. <br>';
    if(localStorage[id+'lostN'] != undefined) stats+= 'Lost: '+localStorage[id+'lostN'];
    $('#levelDetailStats').html(stats);
  });
}

// use only manual with the chromium console
function makeNewLevel(id){
  console.log("Start Procedural Level Module!");
  var plg = new PLG(id);
  console.log(plg.res());
  return plg.json;
}

// TODO: Do we realy need this? NS
function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}
