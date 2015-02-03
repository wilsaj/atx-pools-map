'use strict';

var fs = require('fs');
var minimist = require('minimist');
var turf = require('turf');

var argv = minimist(process.argv.slice(2));
var populationPath = argv._[0];
var areasPath = argv._[1];

// name of population field in population file
var populationField = 'B01003001 - Total';

fs.readFile(populationPath, function (err, data) {
  var populationFC = JSON.parse(data);

  fs.readFile(areasPath, function (err, data) {
    var areaFC = JSON.parse(data);

    var perCapitaFC = perCapitafy(populationFC, areaFC);

    console.log(JSON.stringify(perCapitaFC));
  });
});


// adds per capita count and per capita area of features from areaFC to
// populationFC 
function perCapitafy(populationFC, areaFC) {
  var areaPointsFC = areaCentroids(areaFC);

  var aggregated = turf.aggregate(populationFC, areaPointsFC, [{
      aggregation: 'sum',
      inField: 'area',
      outField: 'area_sum'
    }, {
      aggregation: 'count',
      inField: '',
      outField: 'point_count'
    }]);

  // add per capita numbers to each population feature
  aggregated.features.forEach(function(feature) {
    var population = feature.properties[populationField];
    feature.properties.area_per_capita = feature.properties.area_sum / population;
    feature.properties.features_per_capita = feature.properties.point_count / population;
  });

  return aggregated;
}


// returns centroid with area of original feature for each feature in
// featureCollection
function areaCentroids (featureCollection) {
  var centroids = featureCollection.features.map(function (feature) {
    var centroid = turf.centroid(feature);
    centroid.properties.area = turf.area(feature);
    return centroid;
  });

  return turf.featurecollection(centroids);
}
