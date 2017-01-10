
var svgContainer;

d3.selection.prototype.moveToFront = function() {
 return this.each(function(){
   this.parentNode.appendChild(this);
 });
};
d3.selection.prototype.moveToBack = function() {
   return this.each(function() {
       var firstChild = this.parentNode.firstChild;
       if (firstChild) {
           this.parentNode.insertBefore(this, firstChild);
       }
   });
};

// This is the accessor function
var lineFunction = d3.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; });

var place_svg_html;
var elemnts_svg_html = [];
var obj_level;
var bomb_svg_html;
var win_triggert = 0;
var lost_triggert = 0;
var level_id = "";
// SVG Path function for leiterbahnen
function addLevel(id){

  place_svg_html = "";
  elemnts_svg_html = [];
  obj_level = undefined;
  Pline_map = [];
  Nline_map = [];
  Input_map = [];
  gamecontainer
  start_x = 0;
  start_y = 0;
  Gatter_map = [];
  Gatter_id_map = [];
  win_triggert = 0;
  lostTime = 0;
  lost_triggert = 0;
  level_id = id;

  d3.json("data/level/"+id+"level.json", function(error, data) {
    obj_level = data; // put data into obj_level

    d3.xml("svg/bombe.svg").mimeType("image/svg+xml").get(function(error, xml) {
      bomb_svg_html = $(xml).find("g").html();
    });

    var celements = obj_level.elements.length - 1;
    $(obj_level.elements).each(function(index){
      if(this.type == "drop"){
        var obname = this.obj;
        d3.xml("svg/elements/"+this.obj+".svg").mimeType("image/svg+xml").get(function(error, xml) {
          elemnts_svg_html[obname] = $(xml).find("g").html();
        });
      }
      if(celements == index){
        //load finishd
        d3.xml("svg/elements/place.svg").mimeType("image/svg+xml").get(function(error, xml) {
          place_svg_html = $(xml).find("g").html();
        });
      }
    });
    startInterval = setInterval(function(){
      start = 1;
      if(bomb_svg_html == undefined){
        start = 0;
      }
      $(obj_level.elements).each(function(index){
        if(elemnts_svg_html[this.obj] == undefined){
          start = 0;
        }
      });
      if(place_svg_html == undefined){
        start = 0;
      }
      if(start == 1){
        clearInterval(startInterval);
        // load function after assets are loaded
        start_first_render(obj_level);
      }
    }, 10);
  // load json end
  });
}

function addProcLevel(obj){

    place_svg_html = "";
    elemnts_svg_html = [];
    obj_level = undefined;
    Pline_map = [];
    Nline_map = [];
    Input_map = [];
    gamecontainer
    start_x = 0;
    start_y = 0;
    Gatter_map = [];
    Gatter_id_map = [];
    obj_level = obj; // put data into obj_level
    win_triggert = 0;
    lostTime = 0;
    lost_triggert = 0;

    d3.xml("svg/bombe.svg").mimeType("image/svg+xml").get(function(error, xml) {
      bomb_svg_html = $(xml).find("g").html();
    });

    var celements = obj_level.elements.length - 1;
    $(obj_level.elements).each(function(index){
      if(this.type == "drop"){
        var obname = this.obj;
        d3.xml("svg/elements/"+this.obj+".svg").mimeType("image/svg+xml").get(function(error, xml) {
          elemnts_svg_html[obname] = $(xml).find("g").html();
        });
      }
      if(celements == index){
        //load finishd
        d3.xml("svg/elements/place.svg").mimeType("image/svg+xml").get(function(error, xml) {
          place_svg_html = $(xml).find("g").html();
          // load function after assets are loaded
          start_first_render(obj_level);
        });
      }
    });

  }


/**
 * START Rendering after loading the assets
 */
var Pline_map = [];
var Nline_map = [];
var Input_map = [];
var Rightplace_map = [];
var gamecontainer;
var counter1;
var counter2;
var counter3;
var counter4;
function start_first_render(obj_level){
  // The SVG Container
  svgContainer = d3.select("engine").append("svg").append("g");

  gamecontainer = svgContainer.append("g")
                                .attr("transform", "translate(30, 130)");

  var cendponts = obj_level.endpoints.length;

  // render elements store field
  svgContainer.append("rect")
                 .attr("x", 0)
                 .attr("y", 0)
                 .attr("id", "storedrop")
                 .attr("type", "storedrop")
                 .attr("width", "75")
                 .attr("height", "100%")
                 .attr("stroke", "black")
                 .attr("stroke-width", 2)
                 .attr("fill", "")
                 .attr("fill-opacity", 0.39607843)
                 .moveToBack();

  var bombeC = svgContainer.append("g")
                            .attr("id", "bomb")
                            .html(bomb_svg_html)
                            .attr("transform", "scale(0.5) translate(270,0)");
  console.log(bombeC.node().getBBox().width);
  bwidth = bombeC.node().getBBox().width / 2;
  bombeC.attr("transform", "scale(0.5) translate("+(dwidth - bwidth + (30*2))+", 0)");

  createBombClock(obj_level.time);

  /**
   * Reander the endpoints
   */
  $(obj_level.endpoints).each(function(index){
    //Draw the Rectangle
    p_x = (dwidth / (cendponts + 1)) * (index + 1);
    p_y = 10;
    var id = this.id;
    var need = this.need;
    if(need == 0) endfill = "red";
    else  endfill = "lightgreen";
    var rectangle = gamecontainer.append("rect")
                                 .attr("x", p_x)
                                 .attr("y", p_y)
                                 .attr("id", id)
                                 .attr("class", "endpoints")
                                 .attr("type", "endpoint")
                                 .attr("need", this.need)
                                 .attr("width", "10")
                                 .attr("height", "10")
                                 .attr("stroke", "black")
                                 .attr("stroke-width", 2)
                                 .attr("fill", endfill);
  }); // each endponts

  var celements = obj_level.elements.length;
  var ebene = 0;
  var ebene_car = [];
  var ebene_max = 0;
  var next_calc_arr = [];
  var next_calc_arr_idx = [];
  var idx_ebene = 0;
  var tmp_y = 0;
  var tmp_x = 0;
  // count places per ebene
  $(obj_level.elements).each(function(index){
    if(this.type == "drop"){
      if(ebene_car[this.ebene] == undefined){
        ebene_car[this.ebene] = 1;
      }else{
        ebene_car[this.ebene] = parseInt(ebene_car[this.ebene]) + 1;
      }
      if(this.ebene > ebene_max) ebene_max = this.ebene;
      $(this.next).each(function(index){
        if(next_calc_arr[this.id] == undefined){
          next_calc_arr[this.id] = 1;
        }else{
          next_calc_arr[this.id] = parseInt(next_calc_arr[this.id]) + 1;
        }
      });
      Rightplace_map[this.id] = 0;
    }
  });
  $(obj_level.startpoints).each(function(index){
    $(this.next).each(function(index){
      if(next_calc_arr[this.id] == undefined){
        next_calc_arr[this.id] = 1;
      }else{
        next_calc_arr[this.id] = parseInt(next_calc_arr[this.id]) + 1;
      }
    });
  });

  $(obj_level.elements).each(function(index){
    if(this.type == "drop"){

      var id = this.id;
      var next = this.next;
      var this_ebene = this.ebene;

      if(ebene != this_ebene){
        ebene = this_ebene;
        tmp_y = ebene * 100; // new y position
        idx_ebene = 0;
      } else {
        idx_ebene = idx_ebene + 1;
      }

      tmp_x = (dwidth / (ebene_car[this_ebene] + 1)) * (idx_ebene + 1) - 28; // test idx_ebene

      var newplace =  gamecontainer.append("g")
                                    .attr("class","drop")
                                    .attr("id", id)
                                    .attr("drop", "0")
                                    .attr("x", tmp_x)
                                    .attr("y", tmp_y)
                                    .html(place_svg_html)
                                    .attr("transform", "scale(0.2) translate("+(tmp_x * 5)+","+(tmp_y * 5)+")");
      var cnext = next.length;
      var tmp_ind = undefined;
      $(next).each(function(index){
        placew = newplace.node().getBBox().width * 0.2 / 2;
        var linetoobj = $("#"+(this.id));
        lx = parseInt(linetoobj.attr("x"));
        ly = parseInt(linetoobj.attr("y"));

        if(linetoobj.attr("type") != "endpoint"){
          lw = d3.select("#"+this.id).node().getBBox().width * 0.2 / 2;
          lh = d3.select("#"+this.id).node().getBBox().height * 0.2;
        } else {
          lw = 5;
          lh = 10;
        }
        if(cnext > 1) {
           placew = ((newplace.node().getBBox().width / (cnext + 1)) * (index + 1)) * 0.2;
        }
        if(next_calc_arr[this.id] > 1) {
          if(next_calc_arr_idx[this.id] == undefined) next_calc_arr_idx[this.id] = 0;
          lw = ((d3.select("#"+this.id).node().getBBox().width / (next_calc_arr[this.id] + 1)) * (next_calc_arr_idx[this.id] + 1)) * 0.2;
          next_calc_arr_idx[this.id] = next_calc_arr_idx[this.id] + 1;
        }

        // define startpoints: stp, endpoints: enp
        lx_stp = lx + lw;
        ly_stp = ly + lh;
        lx_enp = tmp_x + placew;
        ly_enp = tmp_y;

        ldata = calc_line(lx_stp, ly_stp, lx_enp, ly_enp, this_ebene);
        if(Input_map[this.id] == undefined) Input_map[this.id] = [];
        if(Input_map[this.id][id] == undefined) Input_map[this.id][id] = [];
        Input_map[this.id][id][Input_map[this.id][id].length] = 0;
        var lineGraph = gamecontainer.append("path")
                                    .attr("d", lineFunction(ldata))
                                    .attr("stroke", "yellow")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none")
                                    .moveToBack();
        if(Nline_map[id] == undefined) Nline_map[id] = [];
        Nline_map[id][index] = lineGraph;
        var PlineGraph = gamecontainer.append("path")
                                   .attr("d", lineFunction(ldata))
                                   .attr("class", "pline"+id)
                                   .attr("stroke", "none")
                                   .attr("stroke-width", 2)
                                   .attr("fill", "none");
        if(Pline_map[id] == undefined) Pline_map[id] = [];
        Pline_map[id][index] = PlineGraph;

        poweronline(PlineGraph);
        $(".pline"+id).hide();
      }); // each next obj
      gamecontainer.append("g")
                    .attr("class","gatter")
                    .attr("obj", this.obj)
                    .attr("id","g"+index)
                    .attr("lx", -25)
                    .attr("ly", ((dwidth / (celements + 1)) * (index + 1) * 5) * 0.2)
                    .html(elemnts_svg_html[this.obj])
                    .attr("transform", "scale(0.2,0.2) translate(-120, "+((dwidth / (celements + 1)) * (index + 1) * 5)+")")
                      .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

      // each elements end
    } // if type drop
  }); // each elements

  /**
   * REANDER Startpoints and ther lines to the next gate
   */
  var cstartponts = obj_level.startpoints.length;
  // The endpoints we have
  $(obj_level.startpoints).each(function(index){
    //Draw the Rectangle
    tmp_x = (dwidth / (cstartponts + 1)) * (index + 1);
    tmp_y = (ebene_max + 1) * 100;
    var id = this.id;
    var on = this.on;
    var next = this.next;
    if(on == 0) {
      stafill = "red";
      stroke_color = "yellow";
    } else {
      stafill = "lightgreen";
      stroke_color = "blue";
    }
    var rectangle = gamecontainer.append("rect")
                                 .attr("x", tmp_x)
                                 .attr("y", tmp_y)
                                 .attr("id", id)
                                 .attr("class", "startpoints")
                                 .attr("type", "startpoints")
                                 .attr("width", "10")
                                 .attr("height", "10")
                                 .attr("stroke", "black")
                                 .attr("stroke-width", 2)
                                 .attr("fill", stafill);

    var cnext = next.length;
    $(next).each(function(index){
      placew = rectangle.node().getBBox().width / 2;
      var linetoobj = $("#"+(this.id));
      lx = parseInt(linetoobj.attr("x"));
      ly = parseInt(linetoobj.attr("y"));

      lw = d3.select("#"+this.id).node().getBBox().width * 0.2 / 2;
      lh = d3.select("#"+this.id).node().getBBox().height * 0.2;

      if(cnext > 1) {
        placew = ((rectangle.node().getBBox().width / (cnext + 1)) * (index + 1)) * 0.2;
      }
      if(next_calc_arr[this.id] > 1) {
       if(next_calc_arr_idx[this.id] == undefined) next_calc_arr_idx[this.id] = 0;
       lw = ((d3.select("#"+this.id).node().getBBox().width / (next_calc_arr[this.id] + 1)) * (next_calc_arr_idx[this.id] + 1)) * 0.2;
       next_calc_arr_idx[this.id] = next_calc_arr_idx[this.id] + 1;
      }

      // define startpoints: stp, endpoints: enp
      lx_stp = lx + lw;
      ly_stp = ly + lh;
      lx_enp = tmp_x + placew;
      ly_enp = tmp_y;

      ldata = calc_line(lx_stp, ly_stp, lx_enp, ly_enp, 0);
      // stroke-dashoffset
      // stroke-dasharray: 25;
      if(Input_map[this.id] == undefined) Input_map[this.id] = [];
      if(Input_map[this.id][id] == undefined) Input_map[this.id][id] = [];
      Input_map[this.id][id][Input_map[this.id][id].length] = on;
      var lineGraph = gamecontainer.append("path")
                                 .attr("d", lineFunction(ldata))
                                 .attr("stroke", stroke_color)
                                 .attr("stroke-width", 2)
                                 .attr("fill", "none")
                                 .moveToBack();
     if(Nline_map[id] == undefined) Nline_map[id] = [];
     Nline_map[id][index] = lineGraph;
      if(on != 0) {
        var PlineGraph = gamecontainer.append("path")
                                   .attr("d", lineFunction(ldata))
                                   .attr("class", "pline"+id)
                                   .attr("stroke", "lightblue")
                                   .attr("stroke-width", 2)
                                   .attr("fill", "none");
        poweronline(PlineGraph, ldata);
      } else {
        var PlineGraph = gamecontainer.append("path")
                                   .attr("d", lineFunction(ldata))
                                   .attr("class", "pline"+id)
                                   .attr("stroke", "none")
                                   .attr("stroke-width", 2)
                                   .attr("fill", "none");
      }
      if(Pline_map[id] == undefined) Pline_map[id] = [];
      Pline_map[id][index] = PlineGraph;
    });
    // was da lost
  });
  circelThrouLogic();
  // end of start level
}

var start_x = 0;
var start_y = 0;
function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
  start_x = d3.select(this).attr("x");
  start_y = d3.select(this).attr("y");
  //d3.select(this)
  //        .attr("lx", start_x)
  //        .attr("ly", start_y);
}

function dragged(d) {
  d3.select(this)
      .attr("x", d3.event.x)
      .attr("y", d3.event.y)
      .attr("transform", "scale(0.2,0.2) translate("+((d3.event.x * 5) - ((this.getBBox().width / 2) )) + "," + ((d3.event.y * 5) - ((this.getBBox().height / 2) )) + ")");
}

function dragended(d) {
  d3.select(this).classed("active", false);

  //console.log(parseInt(d3.select(this).attr("x")) - (this.getBBox().width / 2));
  //console.log(parseInt(d3.select(this).attr("y")) - (this.getBBox().height / 2));
  box1 = {
            left: parseInt(d3.select(this).attr("x")) - ((this.getBBox().width * 0.2) / 2 ),
            top: parseInt(d3.select(this).attr("y")) - ((this.getBBox().height * 0.2) / 2 ),
            right: parseInt(d3.select(this).attr("x")) + ((this.getBBox().width * 0.2) / 2),
            bottom: parseInt(d3.select(this).attr("y")) + ((this.getBBox().height * 0.2))
          };

  var inscetion_obj;
  var insection_box;
  var intersect = false;
  $(".drop").each(function(index){
      if(intersect != true){
        box2 = {
              left: parseInt(d3.select(this).attr("x")),
              top: parseInt(d3.select(this).attr("y")),
              right: parseInt(d3.select(this).attr("x")) + this.getBBox().width * 0.2,
              bottom: parseInt(d3.select(this).attr("y")) + this.getBBox().height * 0.2
            };
        intersect = intersectRect(box1, box2);
      }
      if(intersect == true && inscetion_obj === undefined){
        insection_box = box2;
        inscetion_obj = this;
      }
  });

  if(intersect != true || d3.select(inscetion_obj).attr("drop") != "0"){
    last_x = d3.select(this).attr("lx");
    last_y = d3.select(this).attr("ly");
    d3.select(this)
        .attr("x", last_x)
        .attr("y", last_y)
        .transition()
          .duration(500)
            .attr("transform", "scale(0.2,0.2) translate(" + last_x * 5 + "," + (last_y * 5 - 32) + ")");
    tmp_this = this;
    $('#storedrop').each(function(){
      place_gatter(tmp_this, this);
    });
  } else {
      new_x = insection_box.left;
      new_y = insection_box.top;
      d3.select(this)
          .attr("x", new_x)
          .attr("y", new_y)
          .transition()
            .duration(500)
              .attr("transform", "scale(0.2,0.2) translate(" + ((new_x) * 5) + "," + (new_y * 5 - 32) + ")");
      d3.select(".drop[drop="+'"'+d3.select(this).attr("id")+'"'+"]").attr("drop", "0")
      d3.select(inscetion_obj).attr("drop", d3.select(this).attr("id"));
      place_gatter(this, inscetion_obj);
  }
  $(".endpoints").each(function(index){
    tmp_this = this;
    $(".drop").each(function(index){
      if(Input_map[tmp_this.id] !== undefined){
        if(Input_map[tmp_this.id][this.id] == 1){
          if(d3.select('#'+tmp_this.id).attr("need") != Input_map[tmp_this.id][this.id]){
            clockTime  = clockTime - 30;
            Materialize.toast('- 30 Seconds !!!', 1000) // 4000 is the duration of the toast
          }
        }
      }
    });
  });
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

var Gatter_map = [];
var Gatter_id_map = [];
// check dependecie and update logigater/power mode
function place_gatter(gatter, place){
  ptmp_id = d3.select(place).attr("id");
  $(obj_level.elements).each(function(index){
    if(this.type == "drop"){
      Rightplace_map[this.id] = 0;
      if(this.id == ptmp_id){
        if(Gatter_id_map[d3.select(gatter).attr("id")] != this.id){
          Gatter_map[Gatter_id_map[d3.select(gatter).attr("id")]] = undefined;
          Gatter_id_map[d3.select(gatter).attr("id")] = this.id;
          Gatter_map[this.id] = d3.select(gatter).attr("obj");
        } else {
          Gatter_id_map[d3.select(gatter).attr("id")] = this.id;
          Gatter_map[this.id] = d3.select(gatter).attr("obj");
        }
      }
    }
  });
  if( "storedrop" == ptmp_id) {
    d3.select(".drop[drop="+'"'+d3.select(gatter).attr("id")+'"'+"]").attr("drop", "0")
    Gatter_map[Gatter_id_map[d3.select(gatter).attr("id")]] = undefined;
    clockTime  = clockTime - 5;
    Materialize.toast('- 5 Seconds', 1000) // 4000 is the duration of the toast
  }
  win = 1;
  $(obj_level.elements).each(function(index){
    if(Gatter_map[this.id] == this.obj){
      Rightplace_map[this.id] = 1;
    }
    if(Rightplace_map[this.id] == 0){
      win = 0;
    }
  });

  if(win == 1){
    //triggerWin();
  }
  circelThrouLogic();
}

function circelThrouLogic(){
  $(obj_level.elements).reverse().each(function(index){
    tmp_this = this;
    tmp_input = [];
    $(obj_level.startpoints).each(function(index){
      if(Input_map[tmp_this.id] !== undefined){
        if(Input_map[tmp_this.id][this.id] !== undefined){
          $.each(Input_map[tmp_this.id][this.id], function(index, data){
            tmp_input[tmp_input.length] = data;
          });
        }
      }
    });
    $(obj_level.elements).each(function(index){
      if(Input_map[tmp_this.id] !== undefined){
        if(Input_map[tmp_this.id][this.id] !== undefined){
          //$.each(Input_map[tmp_this.id][this.id], function(index, data){
            tmp_input[tmp_input.length] = Input_map[tmp_this.id][this.id];
          //});
        }
      }
    });

    result = 0;
    switch (Gatter_map[this.id]) {
      case "and":
        result = 1;
        $.each(tmp_input, function(index, val){
          if(val == 0){
            result = 0;
          }
        });
        break;
      case "or":
        result = 0;
        $.each(tmp_input, function(index, val){
          if(val == 1){
            result = 1;
          }
        });
        break;
      case "xor":
        result = 0;
        $.each(tmp_input, function(index, val){
          if(!result ^ !val) result = 1;
          else result = 0;
        });
        if(tmp_input.length == 2) {
          if(!tmp_input[0] ^ !tmp_input[1]) result = 1;
          else result = 0;
        }
        if(tmp_input.length == 3) {
          if((tmp_input[0] ^ tmp_input[1] ^ tmp_input[2]) && !(tmp_input[0] && tmp_input[1] && tmp_input[2])) result = 1;
          else result = 0;
        }
        break;
      default:
        result = 0;
      break;
    }
    renew = 0;
    $(tmp_this.next).each(function(index){
      if(Input_map[this.id][tmp_this.id] != result){
        renew = 1;
      }
      Input_map[this.id][tmp_this.id] = result;
    });

    if(result == 1){
      $(".pline"+tmp_this.id).show();
      $(Pline_map[tmp_this.id]).each(function(){
        this.attr("stroke", "lightblue")
      });
      $(Nline_map[tmp_this.id]).each(function(){
        this.attr("stroke", "blue");
      });
    } else {
      $(".pline"+tmp_this.id).hide();
      $(Nline_map[tmp_this.id]).each(function(){
        this.attr("stroke", "yellow");
      });
    }
    if(renew == 1){
      circelThrouLogic();
    }
  });

  var otherway_win = 1;
  $(obj_level.elements).reverse().each(function(index){
    tmp_this = this;
    $(obj_level.endpoints).each(function(index){
      if(Input_map[this.id] !== undefined){
        if(Input_map[this.id][tmp_this.id] !== undefined){
          if(this.need == 1 && Input_map[this.id][tmp_this.id] == 0){
            otherway_win = 0;
            console.log("Input_map: no power for endpoint [",this.id,"]!");
          }
          if(this.need == 0 && Input_map[this.id][tmp_this.id] == 1){
            otherway_win = 0;
            console.log("Input_map: ther is power for endpoint [",this.id,"]!");
          }
        }
      }
    });
    if(Gatter_map[tmp_this.id] == undefined){
      otherway_win = 0;
      console.log("Gatter_map: not all elements placed!");
    }
  });

  if(otherway_win == 1){
    triggerWin();
  }
}

function triggerWin(){
  if(win_triggert == 0){
    //alert("OMG YOU ARE A WINNER!");
  }
  win_triggert = 1;
  localStorage[level_id + "win"] = 1;
  localStorage[(parseInt(level_id) + 1) + "open"] = 1;
  stopTime();
  hideMenu();
  $('#levelWinLost').html("You Win!");
  $('.winloseMenuDiv').show();
}
function triggerLost(){
  if(lost_triggert == 0){
    //alert("OMG YOU ARE A LOOSER!");
  }
  lost_triggert = 1;
  stopTime();
  hideMenu();
  $('#levelWinLost').html("Game Over!");
  $('.winloseMenuDiv').show();
}

var tmp_ebene = 'null';
var multi = 0;
function calc_line(lx_stp, ly_stp, lx_enp, ly_enp, ebene){
  // make angular lines between
  if(tmp_ebene != ebene) {
    tmp_ebene = ebene;
    multi = 0;
  } else {
    multi++;
  }

  multi = 0;

  lx_a1 = lx_stp;
  ly_a1 = (ly_enp + ly_stp) / 2;

  lx_a2 = lx_enp;
  ly_a2 = ly_a1 + 25;

  ldata = [
            { "x": lx_stp,  "y": ly_stp},
            { "x": lx_a1,   "y": ly_a1 - (multi * 6) - 15},
            { "x": lx_a2,   "y": ly_a2 - (multi * 6) - 15},
            { "x": lx_enp,  "y": ly_enp}
          ];
  return ldata;
}

function poweronline(obj){
  obj.attr("stroke-dasharray", "2,15")
      .attr("stroke-dashoffset", "0%")
      .transition()
        .duration(20000)
        .ease(d3.easeLinear)
          .attr("stroke-dashoffset", "100%")
          .on("end",  function() { poweronline(obj); });
}

var clockInterval;
var clockTime;
var lostTime = 0;
function createBombClock(time){
  clockTime = time;
  if(clockInterval != undefined) clearInterval(clockInterval);
  // make number for bomb
  bcounter1 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 1), 42, 0.14, 'grey');
  bcounter2 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 2), 42, 0.14, 'grey');
  bcounter3 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 3) + 4, 42, 0.14, 'grey');
  bcounter4 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 4) + 4, 42, 0.14, 'grey');

  svgContainer.append("rect")
                .attr("x", ((dwidth / 2) + 30.5) + (21.5 * 3))
                .attr("y", 48)
                .attr("width", 2)
                .attr("height", 3)
                .attr("fill", "#cc1010");

  svgContainer.append("rect")
                .attr("x", ((dwidth / 2) + 30.5) + (21.5 * 3))
                .attr("y", 48 + 17)
                .attr("width", 2)
                .attr("height", 3)
                .attr("fill", "#cc1010");

  counter1 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 1), 42, 0.14, '#cc1010');
  counter2 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 2), 42, 0.14, '#cc1010');
  counter3 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 3) + 3, 42, 0.14, '#cc1010');
  counter4 = createDigit(8, ((dwidth / 2) + 31) + (21.5 * 4) + 3, 42, 0.14, '#cc1010');

  clockInterval = setInterval(function(){
    if(clockTime > 0) {
      clockTime--;
      min10 = Math.floor(clockTime / 60 / 10);
      min1 = Math.floor(clockTime / 60 % 10);
      sec10 = Math.floor((clockTime - ((min10 * 10 + min1) * 60)) / 10);
      sec1 = Math.floor((clockTime - ((min10 * 10 + min1) * 60)) % 10);
      counter1 = changeDigit(counter1, (min10), 0.14, '#cc1010');
      counter2 = changeDigit(counter2, (min1), 0.14, '#cc1010');
      counter3 = changeDigit(counter3, (sec10), 0.14, '#cc1010');
      counter4 = changeDigit(counter4, (sec1), 0.14, '#cc1010');
    } else {
      lostTime = 1;
      counter1 = changeDigit(counter1, 0, 0.14, '#cc1010');
      counter2 = changeDigit(counter2, 0, 0.14, '#cc1010');
      counter3 = changeDigit(counter3, 0, 0.14, '#cc1010');
      counter4 = changeDigit(counter4, 0, 0.14, '#cc1010');
    }
    if(lostTime == 1){
      triggerLost();
    }
  }, 1000);
}

function  stopTime(){
  clearInterval(clockInterval);
}

/**
 * NUMBER GENERATOR
 */
var data_digit = [];

data_digit['add_x'] = [];
data_digit['add_y'] = [];
data_digit['width'] = [];
data_digit['height'] = [];

data_digit['add_x'][0] = 20;
data_digit['add_y'][0] = 0;
data_digit['width'][0] = 100;
data_digit['height'][0] = 10;

data_digit['add_x'][1] = 10;
data_digit['add_y'][1] = 0;
data_digit['width'][1] = 10;
data_digit['height'][1] = 100;

data_digit['add_x'][2] = 120;
data_digit['add_y'][2] = 0;
data_digit['width'][2] = 10;
data_digit['height'][2] = 100;

data_digit['add_x'][3] = 20;
data_digit['add_y'][3] = 110;
data_digit['width'][3] = 100;
data_digit['height'][3] = 10;

data_digit['add_x'][4] = 10;
data_digit['add_y'][4] = 130;
data_digit['width'][4] = 10;
data_digit['height'][4] = 100;

data_digit['add_x'][5] = 120;
data_digit['add_y'][5] = 130;
data_digit['width'][5] = 10;
data_digit['height'][5] = 100;

data_digit['add_x'][6] = 20;
data_digit['add_y'][6] = 220;
data_digit['width'][6] = 100;
data_digit['height'][6] = 10;

function createDigit(number, x, y, size, color){
  dig_arr = makeDigit(number);
  var obj = generateDigit(dig_arr, x, y, size, color);
  return obj;
}

function changeDigit(obj, to_number, size, color){
    dig_arr = makeDigit(to_number);
    pos_x = parseInt(obj.attr("x"));
    pos_y = parseInt(obj.attr("y"));
    obj.remove();
    var nobj = generateDigit(dig_arr, pos_x, pos_y, size, color);
    return nobj;
}

function generateDigit(dig_arr, x, y, size, color){

  digitContainerG = svgContainer.append("g")
                                  .attr("x", x)
                                  .attr("y", y)
                                  .attr("transform", "translate("+x+","+y+")")
                                  .style('fill-opacity', 1);
  var digitContainer = [];
  // oben
  for (var i = 0; i < 10; i++) {
    if(dig_arr[i] == 1)
    digitContainer[digitContainer.length] = digitContainerG.append("rect")
                                                          .attr("x", (data_digit['add_x'][i]) * size)
                                                          .attr("y", (data_digit['add_y'][i]) * size)
                                                          .attr("width", (data_digit['width'][i]) * size)
                                                          .attr("height", (data_digit['height'][i]) * size)
                                                          .attr("size", size)
                                                          .attr("fill", color);
  }

  return digitContainerG;
}

function makeDigit(number){
  /*
    0: oben
    1: links oben
    2: rechts oben
    3: mitte
    4: links unten
    5: rechts unten
    6: unten
  */
  var res = [];
  switch(number){
    case 0:
      res[0] = 1;
      res[1] = 1;
      res[2] = 1;
      res[3] = 0;
      res[4] = 1;
      res[5] = 1;
      res[6] = 1;
      break;
    case 1:
      res[0] = 0;
      res[1] = 0;
      res[2] = 1;
      res[3] = 0;
      res[4] = 0;
      res[5] = 1;
      res[6] = 0;
      break;
    case 2:
      res[0] = 1;
      res[1] = 0;
      res[2] = 1;
      res[3] = 1;
      res[4] = 1;
      res[5] = 0;
      res[6] = 1;
      break;
    case 3:
      res[0] = 1;
      res[1] = 0;
      res[2] = 1;
      res[3] = 1;
      res[4] = 0;
      res[5] = 1;
      res[6] = 1;
      break;
    case 4:
      res[0] = 0;
      res[1] = 1;
      res[2] = 1;
      res[3] = 1;
      res[4] = 0;
      res[5] = 1;
      res[6] = 0;
      break;
    case 5:
      res[0] = 1;
      res[1] = 1;
      res[2] = 0;
      res[3] = 1;
      res[4] = 0;
      res[5] = 1;
      res[6] = 1;
      break;
    case 6:
      res[0] = 1;
      res[1] = 1;
      res[2] = 0;
      res[3] = 1;
      res[4] = 1;
      res[5] = 1;
      res[6] = 1;
      break;
    case 7:
      res[0] = 1;
      res[1] = 0;
      res[2] = 1;
      res[3] = 0;
      res[4] = 0;
      res[5] = 1;
      res[6] = 0;
      break;
    case 8:
      res[0] = 1;
      res[1] = 1;
      res[2] = 1;
      res[3] = 1;
      res[4] = 1;
      res[5] = 1;
      res[6] = 1;
      break;
    case 9:
      res[0] = 1;
      res[1] = 1;
      res[2] = 1;
      res[3] = 1;
      res[4] = 0;
      res[5] = 1;
      res[6] = 1;
      break;
  }
  return res;
}

function rainbowNumber(obj){
  obj.selectAll("rect").transition()
                        .duration(1000)
                        .attr("fill", function() { return d3.hsl(Math.random() * 360, 1, .5); })
                        .on("end",  function() { rainbowNumber(obj); });
}
