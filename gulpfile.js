var gulp = require('gulp');
gutil = require('gulp-util');
coffee = require('gulp-coffee');
browserify = require('gulp-browserify');
compass = require('gulp-compass');
connect = require('gulp-connect');
gulpif = require('gulp-if');
uglify = require('gulp-uglify');
minHTML = require('gulp-minify-html');
minJSON = require('gulp-jsonminify');
imagemin = require('gulp-imagemin');
pngcrush = require('imagemin-pngcrush');
concat = require('gulp-concat');
cleanCSS = require('gulp-clean-css');
pngCompr = require('imagemin-optipng');
newer = require('gulp-newer');



const jpegCompr = require('imagemin-jpegtran');


var env,
coffeeSources,
jsSources,
htmlSources,
jsonSources,
outputDir,
sassStyle,
sassComments;








//Setting up envionment condition
env = process.env.NODE_ENV || 'development';

if (env==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
    sassComments = 'true';
    } else {
        outputDir = 'builds/production/';
        sassStyle = 'compressed';
        sassComments = 'false';
    }





    /* -------Sources Location----------*/
    coffeeSources = ['components/coffee/tagline.coffee'];
    jsSources = ['components/scripts/*.js','components/scripts/**'];
    imageSources = ['../04-media/images/non-compressed/**'];
    pngSources = ['../04-media/images/non-compressed/**'];
    jpegSources = ['../04-media/images/non-compressed/**'];
    imageDest = ['../04-media/images/compressed/']

    sassSources = ['components/sass/custom.scss'];
    htmlSources = [outputDir + '*.html'];
    jsonSources = [outputDir + 'js/*.json'];





    /* -------Gulp-Minify Image----------*/
    gulp.task('images', function() {
        return gulp.src(imageSources)
        .pipe(newer('../04-media/images/compressed/'))
        .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false}],
        use: [pngcrush()]
        }))
        .pipe(gulp.dest('../04-media/images/compressed/'));
        });

    /* -------Gulp-Compress-PNG----------*/
    gulp.task('png', function () {
        return gulp.src(pngSources)
        .pipe(pngCompr({optimizationLevel: 3})())
        .pipe(gulp.dest('../04-media/images/compressed'));
        });

    /* -------Gulp-Compress-JPEG----------*/
    gulp.task('jpeg', () => {
        return gulp.src(jpegSources)
        .pipe(jpegCompr({progressive: true})())
        .pipe(gulp.dest('../04-media/images/compressed'));
        });

    /* -------Gulp-Coffee----------*/
    gulp.task('coffee', function(){
       gulp.src(coffeeSources)
       .pipe(coffee({bare: true})
          .on('error', gutil.log))
       .pipe(gulp.dest('components/scripts'))
       });

    /* -------Gulp-concat----------*/
    gulp.task('js', function() {
     gulp.src(jsSources)
     .pipe(concat('script.js'))
     .pipe(browserify())
     .pipe(uglify())
     .pipe(gulp.dest('../TBG-Intgrserver2012/omega/js'))
     .pipe(gulp.dest('../TBG-AWSPRODUCTIOn/js'))
     .pipe(connect.reload())
     });


    /* -------Gulp-uglify----------*/
    gulp.task('jsMinify', function() {
      return gulp.src("../04-media/js/*.js")
      .pipe(uglify())
      .pipe(gulp.dest("../04-media/js/"));
      });

    /* -------Gulp-clean-css----------*/
    gulp.task('cssMinify', function() {
      return gulp.src('../04-media/css/*.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('../04-media/css/'));
      });

    /* -------Gulp-Compass----------*/
    gulp.task('compass', function() {
      gulp.src(sassSources)
      .pipe(compass({
        css: outputDir + 'css',

        // Use to export css to sftp
        css: '../TBG-Intgrserver2012/omega/css', 
        css: '../TBG-AWSPRODUCTIOn/omega/css',
        //css: '../TBG-AWS-Clone/omega/css',
        // ******
        sass: 'components/sass',
        image: outputDir + 'images',
        style: 'compressed',
        comments: sassComments
        }))    
      .on('error', gutil.log)
      .pipe(gulp.dest(outputDir + 'css'))
      .pipe(connect.reload())
      });

    

    /* -------Gulp-Connect----------*/
    gulp.task('connect', function(){
        connect.server({
            root: outputDir,
            livereload: true
            })
        });

    /* -------Gulp-Connect-HTML----------*/
    gulp.task('html', function() {
      gulp.src('builds/development/*.html')
      .pipe(gulpif(env==='production', minHTML()))
      .pipe(gulpif(env==='production', gulp.dest(outputDir)))
      .pipe(connect.reload())
      }); 
    
    /* -------Gulp-Connect-JSON----------*/
    gulp.task('json', function() {
      gulp.src('builds/development/js/*.json')
      .pipe(gulpif(env==='production', minJSON()))
      .pipe(gulpif(env==='production', gulp.dest('builds/production/js')))
      .pipe(connect.reload())
      });


    /* -------Gulp-Watch----------*/
    gulp.task('watch', function(){
    // image minify
    gulp.watch(imageSources, ['images']);
    });

    /* -------Gulp-Default----------*/
    gulp.task('default', ['images', 'watch']);