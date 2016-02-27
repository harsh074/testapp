var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');

var paths = {
  sass: ['./scss/**/*.scss'],
  js:['./www/js/**/**/*.js'],
  templates:['./www/views/**/*.html']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('scripts', function() {
  gulp.src(paths.js)
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./www/builds'));
});

gulp.task('templateJs', function () {
  gulp.src(paths.templates)
    .pipe(templateCache())
    .pipe(gulp.dest('./www/builds'));
});

gulp.task('minify', ['scripts','templateJs']);