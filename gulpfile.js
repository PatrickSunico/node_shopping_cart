//Packages
// ======================================================
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    imagemin = require('gulp-imagemin');

var reload = browserSync.reload;

//Build In
var rawPaths = {
    scss: './build/stylesheets/**/*.scss*',
    templates: './views/**/*.{hbs,jade,pug,ejs}',
    image: './build/images/**/*.{svg,png,jpeg,jpg,gif}',
    js: './build/javascripts/*.js',
    vendor: './build/vendor/js/**/*{.js,.css}'
};

// Build Out 
var buildOut = {
    cssOut: './public/stylesheets',
    js: './public/javascripts/',
    compressed_images_build: './public/images/',
    vendor: './public/vendor/'
};

var gulp_options = {
    browsers: [
        'last 2 versions',
        '> 5%',
        'Firefox ESR',
        'safari 5',
        'ie 8',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4'
    ],
    image_min: {
        'interlaced': true,
        'progressive': true,
        'optimizationLevel': 5,
        'svgoPlugins': [{ removeViewBox: true }]
    }
};

// Browser-sync config
gulp.task('browser-sync', function() {
    browserSync({
        proxy: '127.0.0.1:3000',
        port: 3000,
        open: true,
        notify: false
    });
});

// SCSS
gulp.task('sass', function() {
    return gulp.src(rawPaths.scss)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(rename('style.min.css'))
        .pipe(autoprefixer(gulp_options.browsers))
        .pipe(gulp.dest(buildOut.cssOut))

});

// Uglify JS
gulp.task('uglify', function() {
    return gulp.src(rawPaths.js)
        .pipe(uglify())
        // .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest(buildOut.js))
});

// Imagemin 
gulp.task('imagemin', function() {
    return gulp.src(rawPaths.image)
        .pipe(imagemin(gulp_options.image_min))
        .pipe(gulp.dest(buildOut.compressed_images_build)) // dist 
});

gulp.task('watch', function() {
    gulp.watch(rawPaths.templates).on('change', browserSync.reload);
    gulp.watch(rawPaths.scss, ['sass']).on('change', browserSync.reload);
    gulp.watch(rawPaths.js).on('change', browserSync.reload);
    // gulp.watch(rawPaths.index).on('change', browserSync.reload);
});

// Dist Build System
gulp.task('dist', ['imagemin', 'sass', 'uglify']);
// Build System
gulp.task('default', ['browser-sync', 'sass', 'watch']);