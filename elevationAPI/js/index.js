// Load the Visualization API and the columnchart package.
// @ts-ignore TODO(jpoehnelt) update to newest visualization library
google.load("visualization", "1", { packages: ["columnchart"] });

function initMap() {
  // The following path marks a path from Mt. Whitney, the highest point in the
  // continental United States to Badwater, Death Valley, the lowest point.
  const path = [
    { lat: 37.5693121, lng: 126.977547 },
    { lat: 37.5689907, lng: 126.9826215 },
    { lat: 37.5685464, lng: 126.9852515 },
    { lat: 37.5682444, lng: 126.9874186 },
    { lat: 37.5682009, lng: 126.9886659 },
    { lat: 37.5684772, lng: 126.9930084 },
  ]; 
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: path[2],
    mapTypeId: "terrain",
  });
    
  
  // Create an ElevationService.
  const elevator = new google.maps.ElevationService();

  // Draw the path, using the Visualization API and the Elevation service.
  displayPathElevation(path, elevator, map);

  
}


function displayPathElevation(path, elevator, map) {
  // Display a polyline of the elevation path.
  new google.maps.Polyline({
    path: path,
    strokeWeight: 5,
    strokeColor: "#0002CC",
    strokeOpacity: 1,
    map: map,
  });
  // Create a PathElevationRequest object using this array.
  // Ask for 256 samples along that path.
  // Initiate the path request.
  elevator
    .getElevationAlongPath({
      path: path,
      samples: 256,
    })
    .then(plotElevation)
    .catch((e) => {
      const chartDiv = document.getElementById("elevation_chart");

      // Show the error code inside the chartDiv.
      chartDiv.innerHTML = "Cannot show elevation: request failed because " + e;
    });
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation({ results }) {
  const chartDiv = document.getElementById("elevation_chart");
  // Create a new chart in the elevation_chart DIV.
  const chart = new google.visualization.ColumnChart(chartDiv);
  // Extract the data from which to populate the chart.
  // Because the samples are equidistant, the 'Sample'
  // column here does double duty as distance along the
  // X axis.
  const data = new google.visualization.DataTable();

  data.addColumn("string", "Sample");
  data.addColumn("number", "Elevation");

  for (let i = 0; i < results.length; i++) {
    data.addRow(["", results[i].elevation]);
  }

  // Draw the chart using the data within its DIV.
  chart.draw(data, {
    height: 200,
    legend: "none",
    // @ts-ignore TODO(jpoehnelt) update to newest visualization library
    titleY: "Elevation (m)",
  });
}


window.initMap = initMap;