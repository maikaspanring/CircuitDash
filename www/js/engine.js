
var svgContainer;

// SVG Path function for leiterbahnen
function addLevel(id){
  var obj_level;
  d3.json("data/level/"+id+"level.json", function(error, data) {
    obj_level = data; // put data into obj_level

    // This is the accessor function
    var lineFunction = d3.line()
                             .x(function(d) { return d.x; })
                             .y(function(d) { return d.y; });

    // The SVG Container
    svgContainer = d3.select("engine").append("svg");

    // The line SVG Path we draw
    $(obj_level.circuit).each(function(index){
      $(this.line).each(function(index){
        var lineGraph = svgContainer.append("path")
                                    .attr("d", lineFunction(this.path))
                                    .attr("stroke", "yellow")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none");
      });
    });

    $(obj_level.elements).each(function(index){
      var tmp_x = this.x;
      var tmp_y = this.y;
      d3.xml("svg/elements/place.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        svgContainer.append("g")
                      .attr("class","drop")
                      .attr("id","drop"+index)
                      .attr("drop", "0")
                      .attr("x", tmp_x)
                      .attr("y", tmp_y)
                      .html($(xml).find("g").html())
                      .attr("transform", "scale(0.2,0.2) translate("+(tmp_x * 5)+","+(tmp_y * 5)+")");
      });

      d3.xml("svg/elements/"+this.id+".svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        svgContainer.append("g")
                      .attr("class","gatter")
                      .attr("id","g"+index)
                      .attr("x", 0)
                      .attr("y", 0)
                      .html($(xml).find("g").html())
                      .attr("transform", "scale(0.2,0.2)")
                        .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended));

      });
      // each elements end
    });
  // load json end
  });
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
  console.log({start_x, start_y });
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
    console.log({last_x, last_y});
    d3.select(this)
        .transition()
          .duration(500)
            .attr("x", last_x)
            .attr("y", last_y)
            .attr("transform", "scale(0.2,0.2) translate(" + last_x * 5 + "," + (last_y * 5 - 32) + ")");
  } else {
      new_x = insection_box.left;
      new_y = insection_box.top;
      d3.select(this)
          .transition()
            .duration(500)
              .attr("x", new_x)
              .attr("y", new_y)
              .attr("transform", "scale(0.2,0.2) translate(" + (new_x * 5) + "," + (new_y * 5 - 32) + ")");
      d3.select(".drop[drop="+'"'+d3.select(this).attr("id")+'"'+"]").attr("drop", "0")
      d3.select(inscetion_obj).attr("drop", d3.select(this).attr("id"));
  }
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
