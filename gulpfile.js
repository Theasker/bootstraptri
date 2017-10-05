// gulp-plumber — Keeps Gulp watch from dying when one of the tasks has an error

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webserver = require('gulp-webserver');
const plumber = require('gulp-plumber');
const gp_concat = require('gulp-concat');
const gp_rename = require('gulp-rename');
const gp_uglify = require('gulp-uglify');
const gp_sourcemaps = require('gulp-sourcemaps');

const sourcePaths = {
    styles: ['scss/**/*.scss']
};

const distPaths = {
    styles: './css'
};

const jss = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'
];

var server = {
    host: 'localhost',
    port: '8001'
};

gulp.task('sass', ()=>
    gulp.src(sourcePaths.styles)
        .pipe(plumber())
        .pipe(sass({
            // default: nested. expanded, compact, compressed
            outputStyle: 'expanded',
            sourceComments: true
        }))
        //.pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            versions: ['last 2 browsers']
        }))
        .pipe(gulp.dest(distPaths.styles))
);

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload:     true,
            //fallback:       './index.html', 
            directoryListing: false,
            open:           true,
            host:           server.host,
            port:           server.port,
            //path:           '/'
        }));
});

gulp.task('js-merge', function(){
    gulp.src(jss)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('vendor.js'))
        //.pipe(gulp.dest('./js'))
        //.pipe(gp_rename('vendor.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('./js'))
});

gulp.task('watch', () => {
    gulp.watch(sourcePaths.styles, ['sass']);
    //gulp.watch('./**/*.html', ['webserver']);
});

gulp.task('build', ['sass']);

gulp.task('default', ['build', 'js-merge', 'webserver', 'watch']);