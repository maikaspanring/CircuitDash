
var svgContainer;

// SVG Path function for leiterbahnen
function addLevel(id){
  var obj_level;
  d3.json("data/"+id+"level.json", function(error, data) {
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
                                    .attr("width", "15vh")
                                    .attr("height", "11vh")
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "grey");

      d3.xml("svg/elements/"+this.id+".svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        svgContainer.append("g")
                      .attr("class","gatter")
                      .attr("id","g"+index)
                      .html($(xml).contents().html())
                        .select("image")
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

var
function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this)
      .attr("x", d3.event.x - (dwidth * 0.08))
      .attr("y", d3.event.y - (dheight * 0.03));
}

function dragended(d) {
  d3.select(this).classed("active", false);
  d3.select(this)
      .transition()
        .duration(500)
          .attr("x", 300)
          .attr("y", 300);
}
