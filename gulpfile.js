// gulp-plumber — Keeps Gulp watch from dying when one of the tasks has an error

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webserver = require('gulp-webserver');
const plumber = require('gulp-plumber');

var sourcePaths = {
    styles: ['scss/**/*.scss']
};

var distPaths = {
    styles: './css'
};

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

gulp.task('watch', () => {
    gulp.watch(sourcePaths.styles, ['sass']);
    //gulp.watch('./**/*.html', ['webserver']);
});

gulp.task('build', ['sass']);

gulp.task('default', ['build', 'webserver', 'watch']);