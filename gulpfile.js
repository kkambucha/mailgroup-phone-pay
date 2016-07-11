'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rigger = require('gulp-rigger');
var browserSync = require('browser-sync');

/* dev-version */

/* server */

gulp.task('serve', function() {

  browserSync.init(['*.html'], {
    server: {
      baseDir: 'build',
      directory: true,
      routes: {
        "/node_modules": "node_modules",
        "/js": "build/js"
      }
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    host: process.env.HOST || "10.0.100.20",
    port: process.env.PORT || "8889",
    open: false
  });
  
});

/* main dev-task*/

gulp.task('dev', ['sass:build-dev', 'js:build-dev', 'html:build-dev', 'watch:build-dev', 'serve']);

/* sass */

gulp.task('sass:build-dev', function () {

  gulp.src('./src/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());

});

/* javascript */

gulp.task('js:build-dev', function () {

  gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());

});

/* html */

gulp.task('html:build-dev', function () {

    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());

});

/* dev-watch task */

gulp.task('watch:build-dev', function () {

  gulp.watch('./src/sass/**/*.sass', ['sass:build-dev']);
  gulp.watch('./src/js/**/*.js', ['js:build-dev']);
  gulp.watch('./src/**/*.html', ['html:build-dev']);

});
