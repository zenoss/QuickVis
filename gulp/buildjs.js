/* jshint node: true */
"use strict";

let gulp = require("gulp"),
    rollup = require("rollup-stream"),
    rollupIncludePaths = require("rollup-plugin-includepaths"),
    babel = require("rollup-plugin-babel"),
    sourcemaps = require("gulp-sourcemaps"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    rename = require("gulp-rename");

let {VERSION, paths, srcSubdirectories} = require("./config.js");

// build the javascript lib by bundling all visualizations
gulp.task("compileJS", function(){
    return rollup({
        entry: paths.src + "quickvis.js",
        sourceMap: true,
        moduleName: "quickvis",
        format: "iife",
        banner: `/* QuickVis v${VERSION} */`,
        plugins: [
            // hacky workaround for make sure rollup
            // knows where to look for deps
            rollupIncludePaths({
                paths: [paths.src].concat(srcSubdirectories)
            }),

            babel()
        ]
    })
    .pipe(source("quickvis.js", paths.src))
    .pipe(rename(paths.versionedQuickVis))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.build));
});
