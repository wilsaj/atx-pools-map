'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');


var appDir = './app';
 
gulp.task('default', ['webserver']);

gulp.task('webserver', function() {
  gulp.src(appDir)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});
