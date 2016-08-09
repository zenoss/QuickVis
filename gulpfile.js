/* jshint node: true */

"use strict";
// TODO - lint
// TODO - minify

var gulp = require("gulp"),
    sequence = require("gulp-sequence"),
    clean = require("gulp-clean"),
    zip = require("gulp-zip"),
    rename = require("gulp-rename");

let {paths, srcSubdirectories} = require("./gulp/config");

// get all them other gulp tasks in here
require("./gulp/test.js");
require("./gulp/injectcss.js");
require("./gulp/demoapp.js");
require("./gulp/buildjs.js");

gulp.task("default", ["build"]);

// build quickvis distributable bundle
gulp.task("build", function(cb){
    sequence("compileJS", "injectCSS")(cb);
});

// build js bundle and run tests
gulp.task("release", function(callback){
    // NOTE - test is at the end in order to work
    // around a karma bug: https://github.com/karma-runner/karma/issues/1788
    sequence("clean", "build", "dist", "zip", "test")(callback);
});

gulp.task("clean", function(){
    return gulp.src([
            paths.build,
            paths.www
        ])
        .pipe(clean());
});

gulp.task("zip", function(){
    // TODO - ensure built lib exists
    return gulp.src([
            paths.build + paths.versionedQuickVis,
            paths.build + paths.versionedQuickVis + ".map"
        ])
        .pipe(zip(paths.versionedQuickVis.replace(".js", ".zip")))
        .pipe(gulp.dest(paths.build));
});

// put compiled js lib in dist dir
gulp.task("dist", function(cb){
    // TODO - ensure built lib exists
    return gulp.src([
            paths.build + paths.versionedQuickVis
        ])
        .pipe(rename("quickvis.js"))
        .pipe(gulp.dest(paths.dist));
});
