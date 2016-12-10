//d3Linegraph
//Data processing
//Chris de Rijcke
//10645012

// create svg
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"
    );

// create function to convert data to js data
// create function to fit found datapoint between list of data points, index place is returned
var parseTime = d3.timeParse("%Y%m%d"),
    bisectDate = d3.bisector(function(d) { return d.Date_js; }).left;

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


// function to create line
var line = d3.line()
        .x(function(d) {return x(d.Date_js); })
        .y(function(d) {return y(d.FXX); });

// Title
    svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 40 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Wind gusts(0.1 m/s) in Lelystad, 2014 and 2015");


// load data from json file
d3.json("KNMI_info.json", function(error, data) {
  if (error) throw error;

    // convert data to js date data and js numbers
    data.forEach(function(d){
        d.Date_js = parseTime(d.Date_js);
        d.FXX = +d.FXX;
        return d;
    });

    // set the x and y domain
    x.domain(d3.extent(data, function(d) {return d.Date_js; }));
      y.domain([
        d3.min(data, function(d) { return d.FXX; }),
        d3.max(data, function(d) { return d.FXX; })
      ]);

    // create x axis
      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

    // create Y axis with label
        g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .style("text-anchor", "end")
          .text("Windgusts (in 0.1 m/s)");

    // create line with data
        g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line)
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("fill", "none");

    // create variable for interactivity
    var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    // add  cricle characteristic to interactivity
  focus.append("circle")
      .attr("r", 4.5);

    // add tex to interactivity
  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

    // add an overlay on top of the graph in which interactivity circles can be placed
  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    // create interactivity function
  function mousemove() {
    console.log(d3.mouse(this)[0])
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.Date_js > d1.Date_js - x0 ? d1 : d0,
        xcircle = x(d.Date_js) + margin.left,
        ycircle = y(d.FXX) + margin.top;
        // adjusted variable adjustments to fit the interactivity point to the transformed graph
        console.log(d)
    focus.attr("transform", "translate(" + xcircle + "," + ycircle  + ")");
    focus.select("text").text(d.FXX + "(0.1m/s)");
  }
});