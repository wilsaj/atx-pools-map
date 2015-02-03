'use strict';

$(function () {
  mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsc2FqIiwiYSI6InNRVHhMcTQifQ.ufmSZHZfDC0qWQQ65hmwLg';
  mapboxgl.util.getJSON('https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v6.json', function (err, style) {
    if (err) throw err;

    style.layers.push({
      "id": "censusBlocksFill",
      "type": "fill",
      "source": "censusBlocks",
      "paint": {
        "fill-opacity": .2,
        "fill-color": "#888",
      }
    });

    style.layers.push({
      "id": "censusBlocksLine",
      "type": "line",
      "source": "censusBlocks",
      "paint": {
        "line-color": "#888",
        "line-width": 2
      }
    });


    $.getJSON('./data/census/pop_total.geojson', function (data, status, xhr) {
      var map = new mapboxgl.Map({
        container: 'map',
        style: style,
        center: [30.5, -97.70],
        zoom: 9 
      });
      var censusBlocks = new mapboxgl.GeoJSONSource({data: data});
      map.addSource('censusBlocks', censusBlocks);
    });
  });

});
