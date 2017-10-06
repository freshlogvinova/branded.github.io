var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    runSequence = require('run-sequence'),
    rimraf = require('gulp-rimraf'),
    htmlmin = require('gulp-htmlmin'),
    livereload = require('gulp-livereload'),
    sassLint = require('gulp-sass-lint'),
    watch = require('gulp-watch'),
    nunjucks = require('gulp-nunjucks-html'),
    data = require("gulp-data"),
    img64 = require('gulp-img64');

//Compile scss to css with Autoprefixer
gulp.task('sass', ['sass-lint'], function () {
  return gulp.src('./scss/**/*.scss')
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css/'))
      .pipe(concatCss('/dist/css/style.css'))
});

//SassLint
gulp.task('sass-lint', function() {
  return gulp.src(['./public/scss/**/*.s+(a|c)ss'])
      .pipe(sassLint({config: '.sass-lint.yml'}))
      .pipe(sassLint.format())
});

//Watch to all
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./templates/views/**/*.nun', ['generate']);
  gulp.watch('./templates/views/admin/*.jade', ['copy']);
});

//Pre clean
gulp.task('pre-clean', function() {
  return gulp.src('dist', {read: false})
      .pipe(rimraf());
});

//Copy assets to build
gulp.task('assets', function() {
  return gulp.src('./assets/**/*')
      .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy', function() {
  return gulp.src('./templates/views/admin/*')
      .pipe(gulp.dest('./dist/views/admin'));
});

/*************Generate html**************/
gulp.task('generate', function(callback) {
  runSequence(
      'gen_tchop',
      'gen_unicef',
      'gen_bvg',
      'gen_group',
      'gen_opel',
      'gen_wernsing',
      callback
  );
});

// tchop
gulp.task('gen_tchop', function() {
  return gulp.src(['./templates/views/*.nun', '!./templates/views/admin/index.nun'])
      .pipe(data(function() {
        return require('./templates/tchop.json')
      }))
      .pipe(nunjucks({searchPaths: ['./templates/views'], ext: '.html'}))
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
      // .pipe(gulp.dest('./dist/tchop/'))
      .pipe(gulp.dest('./dist/views'));
});

// unicef
gulp.task('gen_unicef', function() {
  return gulp.src(['./templates/views/*.nun', '!./templates/views/admin/index.nun'])
      .pipe(data(function() {
        return require('./templates/unicef.json')
      }))
      .pipe(nunjucks({searchPaths: ['./templates/views'], ext: '.html'}))
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
      .pipe(gulp.dest('./dist/views/unicef/'))
});

// bvg
gulp.task('gen_bvg', function() {
  return gulp.src(['./templates/views/*.nun', '!./templates/views/admin/index.nun'])
      .pipe(data(function() {
        return require('./templates/bvg.json')
      }))
      .pipe(nunjucks({searchPaths: ['./templates/views'], ext: '.html'}))
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
      .pipe(gulp.dest('./dist/views/bvg/'))
});

// group
gulp.task('gen_group', function() {
  return gulp.src(['./templates/views/*.nun', '!./templates/views/admin/index.nun'])
      .pipe(data(function() {
        return require('./templates/group.json')
      }))
      .pipe(nunjucks({searchPaths: ['./templates/views'], ext: '.html'}))
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
      .pipe(gulp.dest('./dist/views/group/'))
});

// opel
gulp.task('gen_opel', function() {
  return gulp.src(['./templates/views/*.nun', '!./templates/views/admin/index.nun'])
      .pipe(data(function() {
        return require('./templates/opel.json')
      }))
      .pipe(nunjucks({searchPaths: ['./templates/views'], ext: '.html'}))
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
      .pipe(gulp.dest('./dist/views/opel/'))
});

// wernsing
gulp.task('gen_wernsing', function() {
  return gulp.src(['./templates/views/*.nun', '!./templates/views/admin/index.nun'])
      .pipe(data(function() {
        return require('./templates/wernsing.json')
      }))
      .pipe(nunjucks({searchPaths: ['./templates/views'], ext: '.html'}))
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
      .pipe(gulp.dest('./dist/views/wernsing/'))
});

//Build
gulp.task('build', function(callback) {
  runSequence(
      'pre-clean',
      'generate',
      'assets',
      'copy',
      'sass',
      // 'minify',
      'watch',
      callback
  );
});
