//external js file that colors land tiles in svg1.html by function changeColor
//
//Data Visualisation, SVG
//Chris de Rijcke
//10645012

window.onload = function() {
    id_france = document.getElementById("fra");
    id_spain = document.getElementById("esp");
    id_sweden = document.getElementById("swe");
    id_croatia = document.getElementById("hro");
 	changeColor(id_france, "white");
 	changeColor(id_croatia, "green");
 	changeColor(id_spain, "gold");
 	changeColor(id_sweden, "brown");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */

function changeColor(id, color) {
    //
    var country = id;
    country.style.fill =  color;
}