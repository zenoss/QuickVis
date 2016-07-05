/* jshint node: true */
"use strict";
module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [ "build/tests.js" ]
  });
};
