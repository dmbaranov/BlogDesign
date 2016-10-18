var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var fontmag = require('postcss-font-magician');
var cssnano = require('cssnano');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify'); //not needed
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var uncss = require('gulp-uncss');
var useref = require('gulp-useref'); //not needed?
var gulpif = require('gulp-if'); //not needed
var tempclean = require('gulp-rimraf'); //not needed
var clean = require('gulp-clean');
var shorthand = require('gulp-shorthand');
var concatcss = require('gulp-concat-css');
var concatjs = require('gulp-concat');
var del = require('del'); //not needed
var pixrem = require('gulp-pixrem');
var mqpacker = require('css-mqpacker');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var csscomb = require('gulp-csscomb');
var rigger = require('gulp-rigger');
//var loadPlugins = require('gulp-load-plugins')();

gulp.task('connect', function() {
  connect.server({
    root: './app',
    livereload: true
  });
});

gulp.task('reload', function() {
  return gulp.src('.')
  .pipe(connect.reload());
});

gulp.task('clean', function() {
  return gulp.src('./dist')
  .pipe(clean());
});

gulp.task('csscomb', function() {
  return gulp.src('./app/sass/test.scss')
  .pipe(csscomb())
  .pipe(gulp.dest('./app/sass/temp'));
});

gulp.task('html', function() {
  return gulp.src('./app/*.html')
  .pipe(htmlmin({removeComments: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          preserveLineBreaks: true,
          collapseBooleanAttributes: true,
          removeEmptyAttributes: true,
          minifyCSS: true,
          minifyJS: true}))
  .pipe(gulp.dest('./dist'));
});

gulp.task('css', function() {
  var processors = [
    autoprefixer({browsers: ['last 15 version']}),
    fontmag,
    cssnano,
    mqpacker
  ];
  return gulp.src('./app/css/*.css')
  .pipe(concatcss('style.css'))
  .pipe(postcss(processors))
  .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function() {
  return gulp.src('./app/js/*.js')
  .pipe(concatjs('script.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('img', function() {
  return gulp.src('./app/img/*')
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, multipass: true, interlaced: true }))
  .pipe(gulp.dest('./dist/img'));
});

gulp.task('sass-reload', function() {
  var processors = [
    autoprefixer({browsers: ['last 15 version']}),
    fontmag
  ];
	return gulp.src('./app/sass/**/*.scss')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(pixrem({rootValue: '14px'}))
  .pipe(shorthand())
  .pipe(clean("./app/css/style.css"))
	.pipe(gulp.dest('./app/css/'))
	.pipe(connect.reload());
});

gulp.task('sass', ['sass-reload'], function() {
  return gulp.src('.')
  .pipe(connect.reload());
});

gulp.task('uncss', function() {
  return gulp.src('./dist/css/style.css')
  .pipe(uncss({html: ['./dist/index.html']}))
  .pipe(gulp.dest('./dist/css'));
});

gulp.task('shorthand', function() {
  return gulp.src('./app/css/*.css')
  .pipe(shorthand())
  .pipe(gulp.dest('./app/css'));
});

gulp.task('rigger-reload', ['rigger'], function() {
  gulp.start(['reload']);
});

gulp.task('rigger', function() {
  return gulp.src('./app/**/*.html')
  .pipe(rigger())
  .pipe(gulp.dest('./app/'));
});

gulp.task('build', ['clean'], function(cb) {
  gulp.start(['html', 'css', 'js', 'img'], cb);
});

gulp.task('watch', function() {
	//gulp.watch('./app/*.html', ['rigger-reload']); //uncomment this when needed
  gulp.watch('./app/*.html', ['reload']);
  gulp.watch('./app/sass/**/*.scss', ['sass']);
  gulp.watch('./app/js/**/*.js', ['reload']);
});

gulp.task('default', ['connect', 'watch']);
