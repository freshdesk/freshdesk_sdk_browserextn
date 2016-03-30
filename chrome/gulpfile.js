var fs = require('fs');
var gulp = require('gulp');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var crx = require('gulp-crx-pack');
var manifest = require('./src/manifest.json');

// Existence check for key.pem:
try {
  fs.accessSync('key.pem', fs.F_OK);
}
catch(err) {
  console.error('key.pem missing!');
  process.exit(1);
}

// Build tasks:
gulp.task('crx', function() {
  return gulp.src('./src')
    .pipe(crx({
      privateKey: fs.readFileSync('./key.pem', 'utf8'),
      filename: manifest.name + '.crx'
    }))
    .pipe(gulp.dest('./build/crx'));
});

gulp.task('zip', function() {
  distFileName = manifest.name + '-v' + manifest.version + '.zip';
  return gulp.src(['./src/**/*'])
    .pipe(zip(distFileName))
    .pipe(gulp.dest('build/zip'));
});

gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean', 'crx', 'zip']);

