var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rupture = require('rupture');



gulp.task('jade', function() {
  gulp.src('./src/assets/views/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./public/'))
});

gulp.task('stylus', function () {
  return gulp.src('./src/assets/styles/*.styl')
    .pipe(stylus({
      use: [
        rupture()
      ]
    }))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public'));
});

gulp.task('lint', function () {
  return gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function () {
  return gulp.src('./src/**/*.js')
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('browserify', function () {
  return browserify('./src/app/app.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/'));
})

gulp.task('copy', ['browserify', 'stylus'], function () {
  gulp.src(['./src/**/*.html', './src/**/*.css'])
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
});

gulp.task('build', [ 'lint', 'jade', 'stylus', 'copy', 'scripts' ]);

gulp.task('browser-sync', ['build'], function () {
  browserSync.init({
    server: {
      baseDir: "./public",
      routes: {
        "/bower_components": "bower_components",
        "/node_modules": "node_modules"
      }
    }
  });
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch("./src/**/*.*", ["build"]);
  gulp.watch("./public/**/*.*").on('change', browserSync.reload);
})