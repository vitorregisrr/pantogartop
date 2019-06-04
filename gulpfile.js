const gulp = require('gulp'),
    inline = require('gulp-inline'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin');

gulp.task('production', async() => {
    gulp
        .src('public/index.html')
        .pipe(inline({
            base: './public/',
            js: function () {
                return uglify({mangle: false});
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', async() => {
    gulp
        .src('./src/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('listensass', async() => {
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
});

gulp.task('imagesmin', async() => {
    gulp
        .src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'));
});