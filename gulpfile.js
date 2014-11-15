var gulp = require('gulp')
var karma = require('gulp-karma')
var umd = require('gulp-wrap-umd')
var concat = require('gulp-concat')


var src = [
  'src/index.js',
  'src/pulse.js',
  'src/normalize.js',
  'src/init.js'
]


gulp.task('build', function() {
  return gulp.src(src)
    .pipe(concat('museq.js'))
    .pipe(umd({
      exports: 'museq',
      namespace: 'museq',
      deps: [{
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
      'bower_components/motif/motif.js'
    ]
    .concat(src)
    .concat([
      'tests/testUtils.js',
      'tests/**/*.test.js'
    ]))
    .pipe(karma({
      action: 'watch',
      frameworks: ['mocha', 'chai'],
      browsers: ['Chrome']
    }))
})


gulp.task('default', ['build', 'test'])
