
var readyStyle = {
  color: "#ffffff"
};
var invalidatedStyle = {
  color: "#d7d7d8"
};
var doneStyle = {
  color: "#ecb731"
};
var validatedStyle = {
  color: "#8ec06c"
};
var removedStyle = {
  opacity: 0.0,
  color: "#000000"
};



function listTasks(element, index, array) {
  var project_id = element;
  d3.json("http://tasks.osmcanada.ca/project/" + project_id + "/tasks.json", function(object){
    buildProjectSection(project_id, object);
  });
}

function buildProjectSection(project_id, tasksObject) {
  console.log(tasksObject);
  var countof0 = 0;
  var countof1 = 0;
  var countof2 = 0;
  var countTotal = 0;

  $.each(tasksObject.features, function(index, feature){
    // console.log(index);
    // console.log(feature);
    var thisState = feature.properties.state;
    countTotal++
    if (thisState === 2) {
      countof2++
    }
  })
console.log(countof0);
console.log(countTotal)
var percentComplete = Math.round((countof2/countTotal)*100);
console.log(percentComplete)

  var sectionHtml = '<div class="row row-task"' + ' id="row' + project_id + '"' + '>' +
    '<div class="col-md-6">' +
      '<div class="">' +
        '<h4>Task #' + project_id + '</h4>' +
        '<p>' + ' ' + percentComplete + '% ' + 'complete'+ '</p>' +
      '</div>' +
   '</div>' +
    '<div class="col-md-6">' +
      '<div class="map"' + ' id="map' + project_id + '"' + '></div>' +
    '</div>' +
  '</div>';
  $("#tasksBlock").append(sectionHtml);








  // create basic leaflet map
  // ========================
  // tile layer for base map
  var hotUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    hotAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles from <a href="http://hot.openstreetmap.org/" target="_blank">H.O.T.</a>',
    hotLayer = L.tileLayer(hotUrl, {attribution: hotAttribution});
  // initialize map w options
  var thisMapContainer = 'map' + project_id.toString();
  var thisMap = L.map(thisMapContainer, {
      layers: [hotLayer],
      center: new L.LatLng(0,0),
      zoom: 2,
      minZoom: 2,
      scrollWheelZoom: false
    });

  // add the task squares to the map
  var thisLayer = L.geoJson(tasksObject.features, {
      style: function(feature) {
          switch (feature.properties.state) {
              case -1: return removedStyle;
              case 0: return readyStyle;
              case 1: return invalidatedStyle;
              case 2: return doneStyle;
              case 3: return validatedStyle;
          }
      }
  }).addTo(thisMap);

  var bounds = thisLayer.getBounds();
  thisMap.fitBounds(bounds);

}

settings.tasks.forEach(listTasks);





// for each task
// generate a section with a map
// map each task square - the json returned is a feature collection
// color based on object.properties.state
