'use strict';

const gulpIstanbul = require('gulp-istanbul'),
      isparta = require('isparta'),
      uuid = require('uuid'),
      es = require('event-stream');

// TODO add config options
function stubCov(opts) {

  let coverageVariable = '_cov_' + uuid.v4(),
    inStream = es.through(),
    outStream = es.through();

  inStream.pipe(gulpIstanbul(Object.assign({
    coverageVariable,
    instrumenter: isparta.Instrumenter,
    babel: { presets: ["es2015", "react"] },
    includeUntested: true
  }, opts)))
  .pipe(es.through(function (file) {
    this.push(global[coverageVariable][file.path]);
  }))
  .pipe(outStream);

  return es.duplex(inStream, outStream);
}

module.exports = stubCov;
