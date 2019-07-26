const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    log = require('./logger'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

const $vendors = './node_modules',
    $cssVendorsFolder = './public/css/vendors',
    $bootstrap = `${$vendors}/bootstrap/dist/css/bootstrap.css`,
    $cssVendors = [$bootstrap];

////////////////////
// Error FUNCTION //
////////////////////
function displayError(error) {
    log(error.toString(), 'red');
    this.emit('end');
}
////////////
// Stylus //
////////////
gulp.task('stylus', () => {
    return gulp
        .src('./src/stylus/main.styl')
        .pipe(sourcemaps.init())
        .pipe(
            stylus({
                compress: true
            })
        )
        .on('error', displayError)
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: true
            })
        )
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .on('end', () => {
            log('Stylus Compilado', 'green');
        });
});
////////////////
// CSS Vendors//
////////////////
gulp.task('css-vendors', () => {
    return gulp
        .src($cssVendors, { base: $vendors })
        .pipe(concat('cssVendors.css'))
        .pipe(minify())
        .pipe(rename('css-vendors.min.css'))
        .pipe(gulp.dest('./public/css/vendors'))
        .on('end', () => {
            log('Vendors (CSS) Concatenados y minificados', 'blue');
        });
});
////////////
// DEV JS //
////////////
gulp.task('js', function() {
    return gulp
        .src('./src/scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', displayError)
        .pipe(concat('main.min.js'))
        .pipe(
            uglify({
                mangle: {
                    eval: true
                }
            })
        )
        .on('error', displayError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .on('end', () => {
            log('JS Compilado', 'yellow');
        });
});
////////////
// VENDORS//
////////////
// gulp.task('vendors', function() {
//     return gulp
//         .src('./dev-js-vendors/**/*.js')
//         .pipe(concat('vendors.min.js'))
//         .pipe(gulp.dest('./js/vendors'))
//         .on('end', () => {
//             log('Vendors Concatenados', 'blue');
//         });
// });
//////////////
// WATCHERS //
//////////////
gulp.task('watchers', done => {
    log('Watchers Corriendo', 'yellow');
    gulp.watch('./src/stylus/**/*.styl', gulp.series('stylus'));
    gulp.watch('./src/scripts/**/*.js', gulp.series('js'));
    // gulp.watch('./dev-js-vendors/**/*.js', gulp.series('vendors'));
    done();
});

gulp.task(
    'dev',
    gulp.series('stylus', 'css-vendors', 'js', gulp.parallel('watchers'))
);
