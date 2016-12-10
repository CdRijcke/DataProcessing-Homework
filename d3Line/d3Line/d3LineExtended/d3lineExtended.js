//d3Linegraph extended
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
        .x(function(d) {return x(d.date); })
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
d3.json("KNMI_info_2.json", function(error, data) {
  if (error) throw error;

    // convert data to js date data and js numbers
    data.forEach(function(d){
        d.Date_js = parseTime(d.Date_js);
        d.FXX = +d.FXX;
        d.NG = +d.NG;
        d.TXX = +d.TXX;
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

        var city = svg.selectAll(".city")
            .data(data)
            .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d);})
            .style("stroke", "black")
            .attr("fill", "black");

      city.append("text")
      .datum(function(d) {
        return {
          name: d.City,
          date: d.Date_js,
          value: d.FXX
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.date) + "," + y(d.value) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.name;
      });

 var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

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

// mouse over effects
var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

// create vertical stroke that follows mouse
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

// for each line
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

// create blue circles on the lines
    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return "blue";
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

// append a rect to catch mouse movements on canvas
    mouseG.append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() {
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() {
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() {
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        // get data per line
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {

            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.FXX, xDate);

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }

            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));

            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });


});