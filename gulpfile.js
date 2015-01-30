'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');


var appDir = './';

gulp.task('default', ['webserver']);

gulp.task('webserver', function() {
  gulp.src(appDir)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});


gulp.task('watch', function() {
  gulp.watch(['index.html', 'map.css', 'map.js'], 'webserver');
});

