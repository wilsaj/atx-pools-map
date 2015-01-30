'use strict';

$(function () {
  var map = L.map('map', {
      scrollWheelZoom: false,
      center: [30.33, -97.7],
      zoom: 10
  });

  var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  });

  map.addLayer(layer);

  $.getJSON('./data/census/pop_total.geojson', function (data, status, xhr) {
    L.geoJson(data, {
        style: function (feature) {
            return {color: '#0000ff'};
        }
    }).addTo(map);
  });

});
