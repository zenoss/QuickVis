"use strict";
/* jshint node: true */

// TODO - only make test and tdd tasks, everything else private

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    livereload = require("gulp-livereload"),
    sourcemaps = require("gulp-sourcemaps"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    sequence = require("gulp-sequence"),
    globule = require("globule"),
    rollup = require("rollup-stream"),
    rollupIncludePaths = require("rollup-plugin-includepaths"),
    fs = require("fs"),
    path = require("path"),
    karma = require("karma");

let {paths, srcSubdirectories} = require("./config");

gulp.task("test", ["testJS"], function(cb){
    new karma.Server({
        configFile: paths.root + "/karma.conf.js",
        singleRun: true,
        reporters: ["dots"]
        // TODO - chromedriver or *shudder* phantom
    }, cb).start();
});

gulp.task("tdd", ["testJS"], function (cb) {
    livereload.listen();
    gulp.watch(paths.src + "**/*", ["testJS"]);
    new karma.Server({
        configFile: paths.root + '/karma.conf.js',
        reporters: ["dots"]
    }, cb).start();
});

gulp.task("testJS", function(callback){
    sequence("generateTestJS", "buildTestJS")(callback);
});

// generate a js file that imports all of the
// available specs
gulp.task("generateTestJS", function(cb){
    // find all specs
    let specs = globule.find({
            src: "**/*.spec.js",
            srcBase: paths.src
        });

    // generate the import for each spec
    let jsString = ['"use strict";'].concat(
            specs.map(s => `import "${s}";`)
        ).join("\n");

    // write the file
    // TODO - ensure build dir is present
    fs.writeFile(paths.build + "tests.js", jsString, "utf8", cb);
});

gulp.task("buildTestJS", function(){
    return rollup({
        entry: paths.build + "tests.js",
        sourceMap: true,
        format: "iife",
        plugins: [
            // hacky workaround for make sure rollup
            // knows where to look for deps
            rollupIncludePaths({
                paths: [paths.src].concat(srcSubdirectories)
            })
        ]
    })
    .pipe(source("tests.js", paths.src))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.build));
});
