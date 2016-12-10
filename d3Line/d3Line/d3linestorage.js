var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
    .rangeRound([0, width]);


var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.Date_js); })
    .y(function(d) { return y(d.FXX); });


d3.json("KNMI_info.json", function(data) {
        data.forEach(function(d) {
        Letter = d.Date_js;
        Freq = +d.FXX;
        console.log(Letter)
        x.domain(d3.extent(data, function(d) { return Letter; }));
        y.domain(d3.extent(data, function(d) { return Freq; }));
         g.append("path")
          .datum(d)
          .attr("class", "line")
          .attr("d", line);
    });
console.log(Freq);
console.log("je moeder");
}, function(error, data) {
console.log("je moeder");
    if (error) throw error;
        console.log("je moeder");
        console.log(data);

        x.domain(d3.extent(data, function(d) { return d.Date_js; }));
        y.domain(d3.extent(data, function(d) { return d.FXX; }));

        console.log(d);

        g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .style("text-anchor", "end")
          .text("Windstoten (in 0.1 m/s)");

        g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

          console.log(data);

    }
);