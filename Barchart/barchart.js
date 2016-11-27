// set borders of barchart
var margin = {top: 20, right: 30, bottom: 70, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// space between bars
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);


var y = d3.scale.linear()
    .range([height, 20]);

// set x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// set Y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// set chart plane
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data
d3.json("barchart_info.json", function(datas) {
    x.domain(datas.map(function(d) { return d.Country; }));
    // The + converts the string into a number.
    y.domain([0, d3.max(datas, function(d) { return +d.data; })]);

    // The plus before d.data in the y.domain has been added to avoid a wrong pick of the d3.max function.
    // somehow the function kept returning 81 as max value, even though the max value is 736. Try it yourself!
    // I think I have figured it sort of out. The + converts the string into a number. Otherwise the max function
    // sort of works beacause it takes the first number of a the string, that why the values like 81 or 90
    // were overruling values like 746 or 200
    //    console.log(d3.max(datas, function(d) { return d.data;}));
    //    console.log(d3.max(datas, function(d) { return +d.data;}));

// add x axis values
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
     .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

// add y axis label
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
     .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Vehicles per 1000 Inhabitants")
        .style("font-size", "15px");

// add title
    chart.append("g")
        .attr("class", "Title")
       .append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .style("text-decoration", "underline")
            .text("Vehicles per 1000 Inhabitants per country");

// create var for data on hover
    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

// create bars
    chart.selectAll(".bar")
        .data(datas)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Country); })
            .attr("y", function(d) { return y(d.data); })
            .attr("height", function(d) { return height - y(d.data); })
            .attr("width", x.rangeBand())
            // create data appearing on hover
            .on("mouseover", function(d){return tooltip.style("visibility", "visible")
                .text(d.data);})
            .on("mousemove", function(){return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

// add x axis label
    chart.append("g")
        .attr("class", "x label")
        .append("text")
        .attr("y", height + 30)
        .attr("x", -55)
        .text("Country")
        .style("text-anchor", "start")
        .style("font-size", "15px");
});

    function type(d) {
      d.data = +d.data; // coerce to number
      return d;
}
