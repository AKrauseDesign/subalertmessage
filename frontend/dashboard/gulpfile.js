var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');

gulp.task('sass', function() {
  return gulp.src('./sass/*.sass')
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sass({indentedSyntax: true}))
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  return gulp.src('./js/*.js')
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function() {
    browserSync.init(['dist/*.css', 'dist/*.js', './index.html'], {
      server: {
        baseDir: './'
      }
    });
});

gulp.task('watch', function() {
   gulp.watch('./sass/main.sass', ['sass']);

   gulp.watch('./js/*.js', ['js']);

   livereload.listen();
   gulp.watch(['dist/**', 'index.html']).on('change', livereload.changed);
});

gulp.task('default', ['watch', 'browser-sync']);

function errorAlert(error){
  notify.onError({title: "Gulp Error", message: "Beep beep beep, stuffs going down. Check the console."})(error); //Error Notification
  console.log(error.toString()); //Prints Error to Console
  this.emit("end"); //End function
}
