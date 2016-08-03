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

let headlessChromiumPath = path.join(__dirname, "../chrome-headless.sh");

// run unit tests
gulp.task("test", ["testJS"], function(cb){
    new karma.Server({
        configFile: paths.root + "/karma.conf.js",
        singleRun: true,
        reporters: ["dots"],
        browsers: [headlessChromiumPath]
    }, function(e){
        cb(e);
        // HACK because karma refuses to exit
        // after run completes :/
        process.exit(0);
    }).start();
});

// continuously run unit tests
gulp.task("tdd", ["testJS"], function (cb) {
    livereload.listen();
    gulp.watch(paths.src + "**/*", ["testJS"]);
    new karma.Server({
        configFile: paths.root + '/karma.conf.js',
        reporters: ["dots"]
    }, function(e){
        cb(e);
        // HACK because karma refuses to exit
        // after run completes :/
        process.exit(0);
    }).start();
});

// bundles all the unit tests into a single file
// that can be executed in the test runner
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

    // try to make the build dir. if it exists
    // already, ignore the expection
    try {
        fs.mkdirSync(paths.build);
    } catch(e) {
        if ( e.code != 'EEXIST' ){
            throw e;
        }
    }
    // write the file
    fs.writeFile(paths.build + "tests.js", jsString, "utf8", cb);
});

// rollup quickvis code into tests.js file
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