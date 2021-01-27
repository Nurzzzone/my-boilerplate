// ========================================
// ============== Gulp START ==============
// ========================================
const gulp = require('gulp');
const { src, parallel, series, dest } = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sprites = require('gulp-svg-sprite');
const cleanCSS = require('gulp-clean-css');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const browserSync = require('browser-sync').create();


// ================================
// Html
// ================================
const html = () => {
  return src('./src/**/*.html')
    .pipe(gulp.dest('./build'))
};

// ================================
// Scripts
// ================================
const scripts = () => {
  return src('./src/js/**/*.js')
    .pipe(gulp.dest('./build/js'))
};

// ================================
// CSS, SCSS/SASS
// ================================
const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({
        compatibility: 'ie8',
        level: 1
    }))
    .pipe(concat('main.css'))
    // .pipe(rename({
    //     suffix: '.min'
    // }))
    .pipe(dest('./build/css'))
    .pipe(browserSync.stream());
}

// ================================
// Fonts
// ================================
const fonts = () => {
  src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./build/fonts'))
  return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./build/fonts'))
}

// ================================
// Images
// ================================
const imageMin = () => {
  return src(
    ['./src/assets/**'],
    { base: './src/assets' })
    .pipe(dest('./build/assets'))
}

// ================================
// svg => sprites
// ================================
const svgSprites = () => {
  return src('./src/assets/icons/**.svg')
    .pipe(sprites({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest('./build/assets/icons'))
    .pipe(browserSync.stream());
}

// ================================
// browser sync
// ================================
const sync = () => {
  browserSync.init({
    index: "index.html",
    server: {
      baseDir: './build'
    }
  });

  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/index.html', html);
  gulp.watch('./src/index.html').on('change', browserSync.reload);
  gulp.watch('./src/assets/images/**.jpg', imageMin);
  gulp.watch('./src/assets/images/**.png', imageMin);
  gulp.watch('./src/assets/images/**.jpeg', imageMin);
  gulp.watch('./src/assets/icons**.svg', svgSprites);
  gulp.watch('./src/fonts/**.ttf', fonts);
}

exports.styles = styles
exports.default = series(fonts, imageMin, svgSprites, styles, scripts, html, sync);

// ======================================
// ============== Gulp END ==============
// ======================================
