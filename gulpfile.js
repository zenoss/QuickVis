/* jshint node: true */

"use strict";
// TODO - lint
// TODO - minify

var gulp = require("gulp"),
    sequence = require("gulp-sequence"),
    clean = require("gulp-clean"),
    zip = require("gulp-zip"),
    rename = require("gulp-rename"),
    fs = require("fs");

let {VERSION, paths, srcSubdirectories} = require("./gulp/config");

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

// verifies that dist/quickvis.js version
// matches current VERSION
gulp.task("verify", function(cb){
    let expected = `/* QuickVis v${VERSION} */`;
    fs.readFile(paths.dist + "quickvis.js", "utf-8", function(err, data){
        if(err){
            console.error(`Could not verify version: ${err}`);
            cb(err);
            return;
        } else {
            if(!data.includes(expected)){
                console.error(`dist/quickvis.js version does not match current version ${VERSION}. Try running 'gulp dist'.`);
                cb(new Error(`dist/quickvis.js version does not match current version ${VERSION}. Try running 'gulp dist'.`));
                return;
            }
        }
        console.log(`dist/quickvis.js version is ${VERSION}`);
        cb();
    });
});
