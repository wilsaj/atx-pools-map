'use strict';

$(function () {
  mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsc2FqIiwiYSI6InNRVHhMcTQifQ.ufmSZHZfDC0qWQQ65hmwLg';
  mapboxgl.util.getJSON('https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v6.json', function (err, style) {
    if (err) throw err;
    var key = 'area_per_capita';
    var featureName = 'pools';
    var populationKey = 'B01003001 - Total';
    var populationErrorKey = 'B01003001 - Total, Error';

    var messagePre= 'This is a map of ' + featureName + ' per capita\n' +
                    'in Travis County, TX.\n\n' +
                    'This data comes from the <a href="ftp://ftp.ci.austin.tx.us/GIS-Data/Regional/coa_gis.html">City of \n' +
                    'Austin</a>. It is derived from LiDar \n' +
                    'data collected in 2013.\n\n' +
                    'Population data comes from the US\n' +
                    'Census ACS 2013.\n\n';

    var filename = './data/processed/' + featureName + '-per-capita.geojson';

    $.getJSON(filename, function (data, status, xhr) {

      var breaks = turf.jenks(data, key, 10);
      var colors = chroma.scale('Blues').domain([0,1], breaks.length - 1).colors();

      colors.forEach(function (color, i) {
        var filter = [
            "all",
            [">=", key, breaks[i]],
            ["<", key, breaks[i+1]]
          ];

        if (i == colors.length - 1) {
          filter[2][0] = "<=";
        }

        style.layers.push({
          "id": "censusBlocksFill"+i,
          "type": "fill",
          "source": "censusBlocks",
          "interactive": true,
          "filter": filter,
          "paint": {
            "fill-opacity": .8,
            "fill-color": color,
          }
        });
      });

      data.features.forEach(function (feature, featureIndex) {
        feature.properties.featureIndex = featureIndex;
        var hilightStyle = {
          "id": "censusBlockOutline" + featureIndex,
          "type": "line",
          "source": "censusBlocks",
          "filter": ["==", "featureIndex", featureIndex],
          "paint": {
            "line-color": "#888",
            "line-width": 0.5
          }
        };
        var paintClass = "paint.hilight" + featureIndex;
        hilightStyle[paintClass] = {
          "line-color": "#FFE545",
          "line-width": 2
        };
        style.layers.push(hilightStyle);
      });

      var map = new mapboxgl.Map({
        container: 'map',
        style: style,
        center: [30.3, -97.70],
        zoom: 9
      }).on('hover', function(e) {
          map.featuresAt(e.point, {radius: 5}, function(err, features) {
              if (err) throw err;

              if (features.length > 0) {
                var feature = features[0];
                debugger;
                var str = "Number of " + featureName + " per capita:  " + round(feature.properties.features_per_capita, 2) + '\n' +
                          "Total sq ft per capita:      " + round(feature.properties.area_per_capita * 10.7639, 2) + '\n' +
                          "Population:                  " + feature.properties[populationKey] + '\n' +
                          "Pop. error:                  " + feature.properties[populationErrorKey] + '\n';
                document.getElementById('features').innerHTML = messagePre + str;
                map.style.setClassList(['hilight' + feature.properties.featureIndex]);
              }
              else {
                document.getElementById('features').innerHTML = messagePre + 'Hover over a census block \n' +
                                                                'to see more.';
                map.style.setClassList([]);
              }
          });
      });

      var censusBlocks = new mapboxgl.GeoJSONSource({data: data});
      map.addSource('censusBlocks', censusBlocks);
    });
  });
});


function round(number, places) {
  var d = Math.pow(10, places);
  return parseFloat(Math.round(number * d) / d).toFixed(places);
}

