/**var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  request = require('request'),
  karma = require('karma').server,
  _ = require('lodash'),
  fs = require('fs'),
  assets = require('../config/assets.json');
var plugins = gulpLoadPlugins();

process.env.NODE_ENV = 'test';


gulp.task('test', ['startServer', 'stopServer']);
gulp.task('startServer', function(done) {
  require('../server.js');
  require('../node_modules/meanio/lib/core_modules/module/util').preload('../packages/**/ //server', 'model');
//  done();
//});
/**gulp.task('stopServer', ['runKarma'], function() {
  process.exit();
});
gulp.task('runMocha', ['startServer'], function () {
  return gulp.src('./packages/**/ //server/tests/**/*.js', {read: false})
 //   .pipe(plugins.mocha({
//      reporter: 'spec'
//    }));
//});
/**gulp.task('runKarma', ['runMocha'], function (done) {
  request('http://localhost:3001/api/aggregatedassets', function(error, response, body) {
    var aggregatedassets = JSON.parse(body);
    aggregatedassets = processIncludes(aggregatedassets.footer.js);

    karma.start({
      configFile: __dirname + '/../karma.conf.js',
      singleRun: true,
      files: aggregatedassets.concat(['packages/**/ // public/tests/*.js'])
//    }, function () {
/**      done();
    });
  });
});

function processIncludes(aggregatedAssets) {
  for(var i = 0; i < aggregatedAssets.length; ++i) {
    aggregatedAssets[i] = aggregatedAssets[i].slice(1);
    if(aggregatedAssets[i].indexOf('bower_components/') == -1) {
      var index = aggregatedAssets[i].indexOf('/') + 1;
      aggregatedAssets[i] = aggregatedAssets[i].substring(0, index) + "public/" + aggregatedAssets[i].substring(index);
    }
    try {
      var stats = fs.lstatSync(__dirname + '/../packages/core/' + aggregatedAssets[i]);
      aggregatedAssets[i] = 'packages/core/' + aggregatedAssets[i];
      continue;
    } catch(e) {
      // Not a file
    }
    try {
      stats = fs.lstatSync(__dirname + '/../packages/custom/' + aggregatedAssets[i]);
      aggregatedAssets[i] = 'packages/custom/' + aggregatedAssets[i];
    } catch (e) {
      // Not a file
    }
  }
  return aggregatedAssets;
}
 */
'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    through = require('through'),
    gutil = require('gulp-util'),
    plugins = gulpLoadPlugins(),
    coffee = require('gulp-coffee'),
    paths = {
      js: ['./*.js', 'config/**/*.js', 'gulp/**/*.js', 'tools/**/*.js', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**', '!packages/**/assets/**/js/**'],
      html: ['packages/**/*.html', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
      css: ['packages/**/*.css', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**','!packages/core/**/public/assets/css/*.css'],
      less: ['packages/**/*.less', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
      sass: ['packages/**/*.scss', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**'],
      coffee: ['packages/**/*.coffee', '!packages/**/node_modules/**', '!packages/**/assets/**/lib/**']
    };

/*var defaultTasks = ['clean', 'jshint', 'less', 'csslint', 'devServe', 'watch'];*/
var defaultTasks = ['coffee','clean', 'less', 'csslint', 'devServe', 'watch'];

gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

gulp.task('jshint', function () {
  return gulp.src(paths.js)
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
    // .pipe(plugins.jshint.reporter('fail')) to avoid shutdown gulp by warnings
      .pipe(count('jshint', 'files lint free'));
});

gulp.task('csslint', function () {
  return gulp.src(paths.css)
      .pipe(plugins.csslint('.csslintrc'))
      .pipe(plugins.csslint.reporter())
      .pipe(count('csslint', 'files lint free'));
});

gulp.task('less', function() {
  return gulp.src(paths.less)
      .pipe(plugins.less())
      .pipe(gulp.dest(function (vinylFile) {
        return vinylFile.cwd;
      }));
});

gulp.task('devServe', ['env:test'], function () {

  plugins.nodemon({
    script: 'server.js',
    ext: 'html js',
    env: { 'NODE_ENV': 'test' } ,
    ignore: ['node_modules/', 'bower_components/', 'logs/', 'packages/*/*/public/assets/lib/', 'packages/*/*/node_modules/', '.DS_Store', '**/.DS_Store', '.bower-*', '**/.bower-*'],
    nodeArgs: ['--debug'],
    stdout: false
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if(/Mean app started/.test(chunk)) {
        setTimeout(function() { plugins.livereload.reload(); }, 500);
      }
      process.stdout.write(chunk);
    });
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('coffee', function() {
  gulp.src(paths.coffee)
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest('./packages'));
});

gulp.task('watch', function () {
  plugins.livereload.listen({interval:500});

  gulp.watch(paths.coffee,['coffee']);
  gulp.watch(paths.js, ['jshint']);
  gulp.watch(paths.css, ['csslint']).on('change', plugins.livereload.changed);
  gulp.watch(paths.less, ['less']);
});

function count(taskName, message) {
  var fileCount = 0;

  function countFiles(file) {
    fileCount++; // jshint ignore:line
  }

  function endStream() {
    gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
    this.emit('end'); // jshint ignore:line
  }
  return through(countFiles, endStream);
}

gulp.task('test', defaultTasks);