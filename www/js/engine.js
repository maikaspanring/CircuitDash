
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
      var lineGraph = svgContainer.append("path")
                                  .attr("d", lineFunction(this.line))
                                  .attr("stroke", "yellow")
                                  .attr("stroke-width", 2)
                                  .attr("fill", "none");
    });

    $(obj_level.elements).each(function(index){
      //Draw the Rectangle
      var rectangle = svgContainer.append("rect")
                                    .attr("x", this.x)
                                    .attr("y", this.y)
                                    .attr("width", "10vh")
                                    .attr("height", "11vh")
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "grey")
                                    .attr("class", "drop");

      d3.xml("svg/elements/"+this.id+".svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        //console.log($(xml).find("g").html());
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
                          .on("end", dragended))
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
            left: parseInt(d3.select(this).attr("x")) - parseInt(this.getBBox().width / 2) ,
            top: parseInt(d3.select(this).attr("y")) - parseInt(this.getBBox().height / 2),
            right: parseInt(d3.select(this).attr("x")) + (this.getBBox().width * 0.2),
            bottom: parseInt(d3.select(this).attr("y")) + (this.getBBox().height * 0.2)
          };

  console.log(box1);
  var inscetion_obj;
  var insection_box;
  var intersect = false;
  $(".drop").each(function(index){
      if(intersect != true){
        box2 = {
              left: parseInt(d3.select(this).attr("x")),
              top: parseInt(d3.select(this).attr("y")),
              right: parseInt(d3.select(this).attr("x")) + this.getBBox().width,
              bottom: parseInt(d3.select(this).attr("y")) + this.getBBox().height
            };

        intersect = intersectRect(box1, box2);
      }
      if(intersect == true && inscetion_obj === undefined){
        insection_box = box2;
        inscetion_obj = this;
      }
  });

  if(intersect != true){
    d3.select(this)
        .transition()
          .duration(500)
            .attr("x", start_x)
            .attr("y", start_y)
            .attr("transform", "scale(0.2,0.2) translate(" + start_x + "," + start_y + ")");;
  } else {
    new_x = insection_box.left + ((insection_box.right - insection_box.left)/1.85);
    new_y = insection_box.top + ((insection_box.bottom - insection_box.top)/2.55);
    new_x = new_x - (dwidth * 0.08);
    new_y = new_y - (dheight * 0.03);
    d3.select(this)
        .transition()
          .duration(500)
            .attr("x", new_x)
            .attr("y", new_y)
            .attr("transform", "scale(0.2,0.2) translate(" + (new_x * 5 - 10) + "," + (new_y * 5) + ")");
  }
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
