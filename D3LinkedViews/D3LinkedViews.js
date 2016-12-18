// set borders of barchart
var margin = {top: 20, right: 30, bottom: 70, left: 110},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// space between bars
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);


var y = d3.scale.linear()
    .range([height, 20]);

// set x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat("");

// set Y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// set chart plane
var chart = d3.select("#barchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("import_meat.json", function(datas) {

    // set x and y domains
    x.domain(datas.map(function(d) { return d[Object.keys(d)]["country"]}));
    // The + converts the string into a number.
    y.domain([0, d3.max(datas, function(d) { return +d[Object.keys(d)]["2015"]; })]);

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
        .text("")
        .style("font-size", "15px");

// add title
    chart.append("g")
        .attr("class", "Title")
       .append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 4))
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .style("text-decoration", "underline")
            .text("Meat import per country in US$ in 2015");

     chart.append('text')
        .attr("x", width/2 )
        .attr("y", height + 30)
        .style("text-anchor", "middle")
        .text("Countries")

       chart.append('text')
       .attr("transform", "rotate(-90)")
      .attr("y_gb", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Meat import in US$");

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
            .attr("id", function(d) { return Object.keys(d); })
            .attr("x", function(d) { return x(d[Object.keys(d)]["country"]); })
            .attr("y", function(d) { return y(+d[Object.keys(d)]["2015"]); })
            .attr("height", function(d) { return height - y(+d[Object.keys(d)]["2015"]); })
            .attr("width", x.rangeBand())
              .on("mouseover", function(d){highlight_bargraph_on(Object.keys(d), 1); highlight_country('.datamaps-subunit.'+Object.keys(d)) ;
                return tooltip.style("visibility", "visible")
                .text(d[Object.keys(d)]["country"] + ": " + (d[Object.keys(d)]["2015"]).toLocaleString() );})
            .on("mousemove", function(){return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(d){highlight_bargraph_off(Object.keys(d), 0);reset_opacity(); return tooltip.style("visibility", "hidden");})

    function highlight_bargraph_on(country_code){
    var for_select = "#"+ country_code;
    d3.select(for_select)
        .style("fill" , "red")
        .style("margin", "10px 1 px")
        }

    function highlight_bargraph_off(country_code){
        var for_select = "#"+ country_code;
        d3.select(for_select)
            .style("fill" , "steelblue")
            .style("margin", "10px 1 px")
            }

    // create map
    var map = new Datamap({
        scope: 'world',
        // get container to fill map with
        element: document.getElementById('container1'),
        projection: 'mercator',
        height: 500,
        // for legenda use only
        fills: {
          defaultFill: 'black',
          "< 2.000.000" : '#ffffa0',
          "2.000.000 - 3.000.000" : "#fed976",
          " 3.000.000 - 4.000.000" : "#feb24c",
          "4.000.000 - 6.000.000" : "#fd8d3c",
          "6.000.000 - 8.000.000" : '#fc4e2a',
          "8.000.000- 20.000.000" : '#e31a1c',
          "> 20.000.000" : "#b10026"
        },

        // Data is kept empty for now
        data: {
        },

        // map option
        geographyConfig: {
            dataUrl: null,
            hideAntarctica: true,
            hideHawaiiAndAlaska : false,
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: 'black',
            // popup properties and enablement
            popupTemplate: function(geography, data) {
              return ['<div class="hoverinfo"><strong>' + geography.properties.name + '</strong>',
              '<br/>Meat import: ' + getData(geography.id, 3).toLocaleString() + ' USD' +'<br/>',
               '</div>'].join('');
            },
            popupOnHover: true,
            highlightOnHover: false,
            highlightFillColor: 'red',
            highlightBorderColor: 'black',
            highlightBorderWidth: 3,
            highlightBorderOpacity: 1,
            done: function(d) {map.svg.selectAll('.datamaps-subunit').on("mousehover", console.log("je moeder"))

            }},

        done: function(map){
            map.svg.selectAll('.datamaps-subunit').on('mouseenter', function(geo) {
            highlight_bargraph_on(geo.id)
            highlight_country(this)

            }),
            map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
            country_pick(geo.id)
            highlight_country(this)

            }),

            map.svg.selectAll('.datamaps-subunit').on('mouseleave', function(geo) {
            highlight_bargraph_off(geo.id),
            reset_opacity(),
            function(d, i) {
                d3.selectAll('path')
                        .style({
                            'fill-opacity':1.0,
                            'highlight': "red"
                        });
                }
            })},
    })


    var bin_data = []
    // add data from json file and output their colour based on their population
    for (key in datas) {
        var data = {};
        bin_data.push(+datas[key][Object.keys(datas[key])][2015])
        data[Object.keys(datas[key])] = getDataColor(datas[key][Object.keys(datas[key])][2015]);
        map.updateChoropleth(data);
        }


    bin_data.sort() // sort the array in ascending order




        // takes number as input and outputs a colour value
    function getDataColor(data){
        if(data == "None") {
        return "black"}
        else if(data < bin_data[parseInt(((bin_data.length * 1) / 7), 0)]){
        return '#fee5d9'}
        else if(data < bin_data[parseInt(((bin_data.length * 2) / 7), 0)]){
        return "#fcbba1"}
        else if(data < bin_data[parseInt(((bin_data.length * 3) / 7), 0)]){
        return "#fc9272"}
        else if(data < bin_data[parseInt(((bin_data.length * 4) / 7), 0)]){
        return "#fb6a4a"}
        else if(data < bin_data[parseInt(((bin_data.length * 5) / 7), 0)]){
        return "#ef3b2c"}
        else if(data < bin_data[parseInt(((bin_data.length * 6) / 7), 0)]){
        return "#cb181d"}
        else
        return "#99000d"

    }

    // takes a State name as input and outputs their corresponding population value
   function getData(country_id){
        for (country in datas){
            if(Object.keys(datas[country]) == country_id){
                return Number(datas[country][Object.keys(datas[country])][2015]);
            }
        }
   }


    function highlight_country(country_id){

                var currentState = country_id
                var thoseStates = d3
                        .selectAll('path')[0]
                        .filter(function(state) {
                            return state !== currentState;
                        });
                d3.selectAll(thoseStates)
                        .style({
                            'fill-opacity':.3
                        });
                d3.select(currentState)
                        .style({
                            'fill-opacity':1.0,
                            'stroke-width' : 3,
                            'stroke' : "red"
                        });
                }

                function reset_opacity(){
            d3.selectAll('path')
                    .style({
                        'fill-opacity':1.0,
                        'stroke-width' : 1,
                        'stroke' : "black"
                    })
        };

var margin_gb = {top: 20, right: 30, bottom: 70, left: 110},
    width_gb = 900 - margin_gb.left - margin_gb.right,
    height_gb = 700 - margin_gb.top - margin_gb.bottom;

var svg_gb = d3.select("#grouped_barchart")
    .attr("width", width_gb + margin_gb.left + margin_gb.right)
    .attr("height", height_gb + margin_gb.top + margin_gb.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_gb.left + "," + margin_gb.top + ")")

var counter = 0

var years = d3.keys(datas[0][Object.keys(datas[0])]).filter(function(key) { return key !== "country"; });

function country_pick(country_id){
counter += 1
svg_gb.selectAll("*").remove();
    for(each in datas){
        if(Object.keys(datas[each])[0] == country_id && counter == 1){
        datas.country_data = years.map(function(name) {console.log(Object.values(datas[each])[0]) ;return {year: name, value: +Object.values(datas[each])[0][name], country: Object.values(datas[each])[0]["country"] }; });
        datas.countrys_picked =[]
        datas.countrys_picked.push(Object.values(datas[each])[0]["country"])
        }
        else if(Object.keys(datas[each])[0] == country_id && counter == 2){
         datas.country_data = datas.country_data.concat(years.map(function(name) {console.log(Object.values(datas[each])[0]) ;return {year: name, value: +Object.values(datas[each])[0][name], country: Object.values(datas[each])[0]["country"]}; }));

        datas.countrys_picked.push(Object.values(datas[each])[0]["country"])

        console.log(datas.country_data)
        console.log(datas.countrys_picked)
        counter = 0
        bargraph_years(datas.country_data, datas.countrys_picked)
        }
}
}

var x0_gb = d3.scale.ordinal()
    .rangeRoundBands([0, width_gb], .1);

var x1_gb = d3.scale.ordinal();

var y_gb = d3.scale.linear()
    .range([height_gb, 70]);

var xAxis_gb = d3.svg.axis()
    .scale(x0_gb)
    .orient("bottom");

var yAxis_gb = d3.svg.axis()
    .scale(y_gb)
    .orient("left")

function bargraph_years(years_values, countrys_picked){
svg_gb.selectAll("*").remove();

    x0_gb.domain(countrys_picked.map(function(d) {console.log(d);  return d; }));
    x1_gb.domain(years).rangeRoundBands([0, x0_gb.rangeBand()]);
    y_gb.domain([0, d3.max(years_values, function(d) {console.log(d.value) ; return +d.value; })]);

svg_gb.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_gb)

      svg_gb.append("g")
      .attr("class", "y axis")
      .call(yAxis_gb)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Meat import in US$");

      var country = svg_gb.selectAll(".country")
      .data(countrys_picked)
    .enter().append("g")
      .attr("class", "country")
      .attr("transform", function(d) {console.log(d) ; return "translate(" + x0_gb(d) + ",0)"; })


// two bargrapgh are made.
// note that in both bargraphs all the values are plotted. I failed to succeed to split the values into 2.
country.selectAll(".grouped_bar")
      .data(years_values)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x1_gb.rangeBand())
      .attr("x", function(d, i) {console.log(i); return x1_gb(d.year); })
      .attr("y", function(d, i) {console.log(d); return y_gb(+d.value); })
      .attr("height", function(d) { return height_gb - y_gb(+d.value); })
      }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//              linegraph

