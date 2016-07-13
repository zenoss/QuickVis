/* jshint node: true */

"use strict";
// TODO - es6 transpiler
// TODO - lint
// TODO - minify

var gulp = require("gulp"),
    sequence = require("gulp-sequence"),
    clean = require("gulp-clean"),
    zip = require("gulp-zip");

let {paths, srcSubdirectories} = require("./gulp/config");

// get all them other gulp tasks in here
require("./gulp/test.js");
require("./gulp/injectcss.js");
require("./gulp/demoapp.js");
require("./gulp/buildjs.js");

gulp.task("default", ["dist"]);

// build quickvis distributable bundle
gulp.task("dist", function(cb){
    sequence("buildJS", "injectCSS")(cb);
});

// build js bundle and run tests
gulp.task("release", function(callback){
    // TODO - increment version number?
    sequence("clean", "zip", "test")(callback);
});

gulp.task("clean", function(){
    return gulp.src([
            paths.build,
            paths.www
        ])
        .pipe(clean());
});

gulp.task("zip", ["dist"], function(){
    return gulp.src([
            paths.build + paths.versionedQuickVis,
            paths.build + paths.versionedQuickVis + ".map"
        ])
        .pipe(zip(paths.versionedQuickVis.replace(".js", ".zip")))
        .pipe(gulp.dest(paths.build));
});

// build the demo page/app
gulp.task("demo", function(callback){
    sequence("dist", "copyDemo", "copyDemoDist")(callback);
});

