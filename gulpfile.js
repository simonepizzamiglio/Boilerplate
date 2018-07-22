const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const browserify = require('browserify');
const watchify = require('watchify');
const assign = require('lodash.assign');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');

gulp.task('sass', () => {
    gulp.src('./css/**/*.scss')
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
    const customOpts = {
      entries: ['./js/build/app.js'],
      debug: true
    };
    const opts = assign({}, watchify.args, customOpts);
    const b = watchify(browserify(opts));

    b
    .transform(babelify)
    .bundle()
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
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
  gulp.watch('js/**/*.js', ['scripts']);
  // Reloads the browser whenever HTML, CSS or JS files change
  gulp.watch('*.css', browserSync.reload); 
  gulp.watch('*.html', browserSync.reload); 
  gulp.watch('*.js', browserSync.reload);
})