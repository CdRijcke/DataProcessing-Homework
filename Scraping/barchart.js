window.onload = function() {
var dataArray = [
        { "Country": "Afghanistan", "data": "28" },
        { "Country": "Albania", "data": "124" },
        { "Country": "Algeria", "data": "114" },
        { "Country": "Angola", "data": "38" },
        { "Country": "Antigua and Barbuda", "data": "230" },
        { "Country": "Argentina", "data": "314" },
        { "Country": "Armenia", "data": "101" },
        { "Country": "Australia", "data": "736" },
        { "Country": "Austria", "data": "578" },
        { "Country": "Azerbaijan", "data": "112" },
        { "Country": "Bahamas", "data": "81" },
        { "Country": "Bahrain", "data": "537" },
        { "Country": "Bangladesh", "data": "3" },
        { "Country": "Barbados", "data": "469" },
        { "Country": "Belarus", "data": "362" }];

        var margin = {top: 20, right: 30, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var chart = d3.select(".chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json("short_json.json", function(error, data) {
            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, d3.max(data, function(d) { return d.value; })]);

            chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", x.rangeBand());
});

        var width = 500
        var height = 500

        var widthScale = d3.scale.linear()
                        .domain([0, height ])
                        .range([0, width]);

        var axis = d3.svg.axis()
                    .ticks(5)
                    .scale(widthScale);

        var canvas = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(50,50)");


//        var circle = canvas.append("circle")
//                .attr("cx", 0)
//                .attr("cy", 0)
//                .attr("r", 50)
//                .attr("fill", "red");

        var bars = canvas.selectAll("rect")
                    .data(dataArray)
                    .enter()
                        .append("rect")
                        .attr("width", 50)
                        .attr("height", function(d){ return widthScale(d["data"]);})
                        .attr("x", function(d, i) {return i * 100})
                        .attr("y", 0);

        canvas.append("g")
            .attr("transform", "translate(0,400)")
            .call(axis);
}