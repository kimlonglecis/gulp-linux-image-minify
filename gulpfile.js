var gulp = require('gulp');
gutil = require('gulp-util');
gulpif = require('gulp-if');
imagemin = require('gulp-imagemin');
pngcrush = require('imagemin-pngcrush');
pngCompr = require('imagemin-optipng');




const jpegCompr = require('imagemin-jpegtran');

/* -------Sources Location----------*/
imageSources = ['media/images/non-compressed/**'];
imageDest = ['media/images/compressed/'];

/* -------Gulp-Minify Image----------*/
gulp.task('images', function () {
    return gulp.src(imageSources)
        .pipe(newer(imageDest))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(imageDest));
});

/* -------Gulp-Compress-PNG----------*/
gulp.task('png', function () {
    return gulp.src(pngSources)
        .pipe(pngCompr({
            optimizationLevel: 3
        })())
        .pipe(gulp.dest(imageDest));
});

/* -------Gulp-Compress-JPEG----------*/
gulp.task('jpeg', () => {
    return gulp.src(jpegSources)
        .pipe(jpegCompr({
            progressive: true
        })())
        .pipe(gulp.dest(imageDest));
});


/* -------Gulp-Watch----------*/
gulp.task('watch', function () {
    // image minify
    gulp.watch(imageSources, ['images']);
});

/* -------Gulp-Default----------*/
gulp.task('default', ['images', 'watch']);