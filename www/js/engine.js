
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
// SVG Path function for leiterbahnen
function addLevel(id){
  d3.json("data/level/"+id+"level.json", function(error, data) {
    obj_level = data; // put data into obj_level


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

  // load json end
  });
}

/**
 * START Rendering after loading the assets
 */
var Pline_map = [];
var Nline_map = [];
var Input_map = [];
function start_first_render(obj_level){
  // The SVG Container
  svgContainer = d3.select("engine").append("svg").append("g");

  var cendponts = obj_level.endpoints.length;

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
    var rectangle = svgContainer.append("rect")
                                 .attr("x", p_x)
                                 .attr("y", p_y)
                                 .attr("id", id)
                                 .attr("type", "endpoint")
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

      var newplace =  svgContainer.append("g")
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

        ldata = calc_line(lx_stp, ly_stp, lx_enp, ly_enp);
        if(Input_map[this.id] == undefined) Input_map[this.id] = [];
        if(Input_map[this.id][id] == undefined) Input_map[this.id][id] = [];
        Input_map[this.id][id][Input_map[this.id][id].length] = 0;
        var lineGraph = svgContainer.append("path")
                                    .attr("d", lineFunction(ldata))
                                    .attr("stroke", "yellow")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none")
                                    .moveToBack();
        if(Nline_map[id] == undefined) Nline_map[id] = [];
        Nline_map[id][index] = lineGraph;
        var PlineGraph = svgContainer.append("path")
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

      svgContainer.append("g")
                    .attr("class","gatter")
                    .attr("obj", this.obj)
                    .attr("id","g"+index)
                    .attr("x", 0)
                    .attr("y", 0)
                    .html(elemnts_svg_html[this.obj])
                    .attr("transform", "scale(0.2,0.2)")
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
    var rectangle = svgContainer.append("rect")
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

      ldata = calc_line(lx_stp, ly_stp, lx_enp, ly_enp);
      // stroke-dashoffset
      // stroke-dasharray: 25;
      if(Input_map[this.id] == undefined) Input_map[this.id] = [];
      if(Input_map[this.id][id] == undefined) Input_map[this.id][id] = [];
      Input_map[this.id][id][Input_map[this.id][id].length] = on;
      var lineGraph = svgContainer.append("path")
                                 .attr("d", lineFunction(ldata))
                                 .attr("stroke", stroke_color)
                                 .attr("stroke-width", 2)
                                 .attr("fill", "none")
                                 .moveToBack();
     if(Nline_map[id] == undefined) Nline_map[id] = [];
     Nline_map[id][index] = lineGraph;
      if(on != 0) {
        var PlineGraph = svgContainer.append("path")
                                   .attr("d", lineFunction(ldata))
                                   .attr("class", "pline"+id)
                                   .attr("stroke", "lightblue")
                                   .attr("stroke-width", 2)
                                   .attr("fill", "none");
        poweronline(PlineGraph, ldata);
      } else {
        var PlineGraph = svgContainer.append("path")
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
  d3.select(this)
          .attr("lx", start_x)
          .attr("ly", start_y);
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
  } else {
      new_x = insection_box.left;
      new_y = insection_box.top;
      d3.select(this)
          .attr("x", new_x)
          .attr("y", new_y)
          .transition()
            .duration(500)
              .attr("transform", "scale(0.2,0.2) translate(" + (new_x * 5) + "," + (new_y * 5 - 32) + ")");
      d3.select(".drop[drop="+'"'+d3.select(this).attr("id")+'"'+"]").attr("drop", "0")
      d3.select(inscetion_obj).attr("drop", d3.select(this).attr("id"));
      place_gatter(this, inscetion_obj);
  }
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

  $(obj_level.elements).each(function(index){
    if(this.type == "drop"){
      if(this.id == d3.select(place).attr("id")){
        if(this.obj == d3.select(gatter).attr("obj")){
          // element is ok
          console.log("gatter is on the right place");
        } else {
          // element is wrong
          console.log("gatter is on the wrong place");
        }
        if(Gatter_id_map[d3.select(gatter).attr("id")] != this.id){
          Gatter_map[Gatter_id_map[d3.select(gatter).attr("id")]] = undefined;
          Gatter_id_map[d3.select(gatter).attr("id")] = this.id;
          Gatter_map[this.id] = d3.select(gatter).attr("obj");
        } else {
          Gatter_id_map[d3.select(gatter).attr("id")] = this.id;
          Gatter_map[this.id] = d3.select(gatter).attr("obj");
        }
        /*
        $(Pline_map[this.id]).each(function(){
          this.attr("stroke", "lightblue")
          poweronline(this);
        });
        $(Nline_map[this.id]).each(function(){
          this.attr("stroke", "blue");
        });
        */
      }
    }
  });
  circelThrouLogic();
}

function circelThrouLogic(){
  $(obj_level.elements).reverse().each(function(index){
    tmp_this = this;
    tmp_input = [];
    $(obj_level.startpoints).each(function(index){
      if(Input_map[tmp_this.id][this.id] !== undefined){
        $.each(Input_map[tmp_this.id][this.id], function(index, data){
          tmp_input[tmp_input.length] = data;
        });
      }
    });
    $(obj_level.elements).each(function(index){
      if(Input_map[tmp_this.id][this.id] !== undefined){
        //$.each(Input_map[tmp_this.id][this.id], function(index, data){
          tmp_input[tmp_input.length] = Input_map[tmp_this.id][this.id];
        //});
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
}

function calc_line(lx_stp, ly_stp, lx_enp, ly_enp){
  // make angular lines between
  lx_a1 = lx_stp;
  ly_a1 = (ly_enp + ly_stp) / 2;

  lx_a2 = lx_enp;
  ly_a2 = ly_a1;

  ldata = [
            { "x": lx_stp,  "y": ly_stp},
            { "x": lx_a1,   "y": ly_a1},
            { "x": lx_a2,   "y": ly_a2},
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
