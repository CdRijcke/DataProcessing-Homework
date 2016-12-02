// load json file with states, their abbreviations and populations
d3.json("USA_data.json", function(datas) {

    // create map
    var map = new Datamap({
        scope: 'usa',
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
              '<br/>Population: ' + getData(geography.properties.name, 3).toLocaleString() + ' Citizens' +'<br/>',
               '</div>'].join('');
            },
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: 'yellow',
            highlightBorderColor: 'black',
            highlightBorderWidth: 4,
            highlightBorderOpacity: 1
            },
        })
    // add data from json file and output their colour based on their population
    for (key in datas) {
        var data = {};
        data[datas[key]["brief"]] = getDataColor(datas[key]["Population"]);
        map.updateChoropleth(data);
        }

        // takes population number as input and outputs a colour value
    function getDataColor(data){
        if(data == "None") {
        return "black"}
        else if(data < 2000000){
        return '#ffffa0'}
        else if(data < 3000000){
        return "#fed976"}
        else if(data < 4000000){
        return "#feb24c"}
        else if(data < 6000000){
        return "#fd8d3c"}
        else if(data < 8000000){
        return "#fc4e2a"}
        else if(data < 20000000){
        return "#e31a1c"}
        else
        return "#b10026"
    }

    // takes a State name as input and outputs their corresponding population value
    function getData(country_name){
        for (key in datas){
            if (datas[key]["State"] == country_name){
                return datas[key]["Population"]
            }
        }
    };

    //create legend
    map.legend()

});



