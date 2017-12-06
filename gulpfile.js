var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

gulp.task('sass', function(){
  	return gulp.src('./css/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css'))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function () {
	return gulp.src(['./js/vendor/*.js', './js/build/*.js'])
	.pipe(concat('main.js'))
  .pipe(gulp.dest('./js'))
  .pipe(concat('main.min.js'))
	.pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}}))
  .pipe(gulp.dest('./js'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})

gulp.task('watch', ['browserSync', 'sass', 'scripts'], function(){
  gulp.watch('css/**/*.scss', ['sass']); 
  gulp.watch('js/**/*.js', ['scripts']);
  // Reloads the browser whenever HTML, CSS or JS files change
  gulp.watch('*.css', browserSync.reload); 
  gulp.watch('*.html', browserSync.reload); 
  gulp.watch('*.js', browserSync.reload);
})