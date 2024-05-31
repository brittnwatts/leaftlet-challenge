// declare url for daya retrieval
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// connect to D3
d3.json(queryURL).then(function(data){
    createFeatures(data.features);
});

// Define a function to run for each feature
// Give each feature a popup that describes the earthquake
function createFeatures(earthquakeData){
    // this popup displays the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p`);
    };
    // this function determines the marker size based on the earthquake's magnitude
    function markerSize(magnitude){
        return magnitude * 4;
    };
    // this function determines the marker color based on the depth of the earthquake
    function markerColor(depth){
        return depth > 90 ? 'red' : depth > 70 ? 'darkorange' : depth > 50 ? 'orange' : depth > 30 ? 'gold': depth > 10 ? 'yellow' : 'yellowgreen';
    };
// create a GeoJSON layer that contains the features array and run the onEachFeature
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, coordinates){
            return L.circleMarker(coordinates,{
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                fillOpacity: 1,
                opacity: 1,
                weight: 0.5
            });
        },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}

// create the map function and layers
function createMap(earthquakes){

    // create base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
      // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };
      // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });
      // Create a layer control.
      // Pass it our baseMaps and overlayMaps.
      // Add the layer control to the map.
    L.control.layers(baseMaps,overlayMaps,{
        collapsed:false
    }).addTo(myMap);

      let legend = L.control({ position: "bottomright" });

      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        depths = [-10, 10, 30, 50, 70, 90];
        colors = ['yellowgreen','yellow', 'gold', 'orange', 'darkorange', 'red'];
        labels = [];
    
    
        div.innerHTML = "<h4>Depth</h4>";
    
        for(let i = 0; i < depths.length; i++){
            div.innerHTML +=
                '<i style="background: '+ colors[i]+'"></i>'+depths[i] + (depths[i+1]?'&ndash;'+depths[i+1]+'<br>':'+');
        }
        return div;
      };
      // Adding the legend to the map
      legend.addTo(myMap);
    }
