const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');

gulp.task('sass', () => {
    return gulp.src('./css/**/*.scss')
    .pipe(plumber())
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

gulp.task('scripts', () => {
  return gulp.src(['./js/vendor/*.js', './js/build/*.js'])
  .pipe(plumber())
  .pipe(babel({presets: ['es2015']}))
	.pipe(concat('main.js'))
  .pipe(gulp.dest('./js'))
  .pipe(concat('main.min.js'))
	.pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}}))
  .pipe(gulp.dest('./js'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('image', () =>
gulp.src('./images/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{
        removeViewBox: false,
        removeUselessStrokeAndFill: false,
        removeEmptyAttrs: true,
      }],
    }))
    .pipe(gulp.dest('./images'))
);

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})

gulp.task('watch', ['browserSync', 'sass', 'scripts'], () => {
  gulp.watch('css/**/*.scss', ['sass']); 
  gulp.watch('js/vendor/*.js', ['scripts']);
  gulp.watch('js/build/*.js', ['scripts']);
  // Reloads the browser whenever HTML, CSS or JS files change
  gulp.watch('*.css', browserSync.reload); 
  gulp.watch('*.html', browserSync.reload); 
  gulp.watch('*.js', browserSync.reload);
})