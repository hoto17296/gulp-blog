var gulp        = require('gulp');
var webserver   = require('gulp-webserver');
var frontMatter = require('gulp-front-matter');
var markdown    = require('gulp-markdown');
var layout      = require('gulp-layout');
var rename      = require('gulp-rename');
var rimraf      = require('rimraf');

gulp.task('default', ['build', 'watch', 'server']);

gulp.task('build', ['clean', 'images', 'posts']);

gulp.task('watch', () => {
  gulp.watch('src/_posts/*.md', ['posts']);
  gulp.watch('src/images/**/*.{jpg,jpeg,gif,png,svg}', ['images'])
});

gulp.task('server', () => {
  gulp.src('public')
    .pipe(webserver({
    }));
});

gulp.task('clean', (cb) => rimraf('public', cb));

gulp.task('posts', () => {
  return gulp.src('src/_posts/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout((file) => {
      opts = file.frontMatter;
      opts.layout = `src/_layouts/${opts.layout||'post'}.jade`;
      return opts;
    }))
    .pipe(rename((path) => {
      path.dirname += '/' + path.basename;
      path.basename = 'index';
      path.extname = '.html';
      return path;
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{jpg,jpeg,gif,png,svg}')
    .pipe(gulp.dest('public/images'));
});
