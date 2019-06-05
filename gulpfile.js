const gulp = require('gulp'),
    inline = require('gulp-inline'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    imagemin = require('gulp-imagemin'),
    base64 = require('gulp-base64'),
    htmlmin = require('gulp-htmlmin');

gulp.task('production', async() => {
    gulp
        .src('src/index.html')
        .pipe(inline({
            base: './public/',
            js: function () {
                return uglify({mangle: false});
            },

            css: function(){
                return base64({maxImageSize: 9999999999});
            }, 
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', async() => {
    gulp
        .src('./src/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('base64', async() => {
    gulp
        .src('./src/css/main.css')
        .pipe(base64())
        .pipe(uglifycss({mangle: false}))
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('listensass', async() => {
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
});

gulp.task('imagesmin', async() => {
    gulp
        .src('./src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 5}))
        .pipe(gulp.dest('./public/img'));
});