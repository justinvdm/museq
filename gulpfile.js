var gulp = require('gulp')
var karma = require('gulp-karma')
var umd = require('gulp-wrap-umd')
var concat = require('gulp-concat')


gulp.task('build', function() {
  return gulp.src('src/index.js')
    .pipe(concat('museq.js'))
    .pipe(umd({
      exports: 'museq',
      namespace: 'museq',
      deps: [{
        name: 'vv',
        amdName: 'drainpipe',
        cjsName: 'drainpipe',
        globalName: 'vv'
      }, {
        name: 'sig',
        amdName: 'sig-js',
        cjsName: 'sig-js',
        globalName: 'sig'
      }]
    }))
    .on('error', function(e) {
      console.error(e)
      this.end()
    })
    .pipe(gulp.dest('.'))
})


gulp.task('test', function() {
  return gulp
    .src([
      'bower_components/sig-js/sig.js',
      'bower_components/drainpipe/drainpipe.js',
      'src/index.js',
      'tests/testUtils.js',
      'tests/**/*.test.js'
    ])
    .pipe(karma({
      action: 'run',
      frameworks: ['mocha', 'chai'],
      browsers: ['PhantomJS']
    }))
})


gulp.task('default', ['build', 'test'])


gulp.task('watch', function() {
  gulp.watch(['src/index.js', 'tests/**/*.js'], ['default']);
});
