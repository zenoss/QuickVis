/* jshint node: true */

"use strict";
// TODO - es6 transpiler
// TODO - lint
// TODO - minify

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    livereload = require("gulp-livereload"),
    sourcemaps = require("gulp-sourcemaps"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    sequence = require("gulp-sequence"),
    serv = require("./serv"),
    exec = require("child_process").exec,
    globule = require("globule"),
    rollup = require("rollup-stream"),
    rollupIncludePaths = require("rollup-plugin-includepaths"),
    fs = require("fs"),
    path = require("path"),
    through = require("through2"),
    karma = require("karma");

var paths = {
    src: "src/",
    build: "build/",
    www: "www/",
    webapp: "demo/"
};

gulp.task("default", ["dist"]);

// quickvis distributable bundle
gulp.task("dist", function(callback){
    sequence("buildJS", "injectCSS")(callback);
});

// build the demo page/app
gulp.task("demo", function(callback){
    sequence("dist", "copyDemo", "copyDemoDist")(callback);
});


// rollup needs an explicit list of places to
// look for deps, so generate a flat list of
// directories in the src directory
let srcSubdirectories = (function(srcPath){
    return fs.readdirSync(srcPath).filter(f => fs.statSync(path.join(srcPath, f)).isDirectory());
})(paths.src).map(dir => path.join(paths.src, dir));


// build the javascript lib by bundling all visualizations
gulp.task("buildJS", function(){
    return rollup({
        entry: paths.src + "quickvis.js",
        sourceMap: true,
        moduleName: "quickvis",
        format: "iife",
        plugins: [
            // hacky workaround for make sure rollup
            // knows where to look for deps
            rollupIncludePaths({
                paths: [paths.src].concat(srcSubdirectories)
            })
        ]
    })
    .pipe(source("quickvis.js", paths.src))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.build));
});

// generates a string of js that will inject the
// provided CSS into the DOM
function injectCSSTemplate(css){
    return `
(function injectCSS(){
    let style = document.createElement("style");
    style.innerHTML = "${css}";
    document.body.appendChild(style);
    // force layout/paint
    document.querySelector("body").clientWidth;
})();
    `;
}

function injectCSS(dest){
    let bufferContent = function(file, enc, cb){
        // TODO - ensure file exists, etc
        var css = file.contents.toString()
            .replace(/\s\s+/g, " ")
            .replace(/(?:\r\n|\r|\n)/g, "")
            .replace(/"/g, "'");
        var injectorScript = injectCSSTemplate(css);
        fs.readFile(dest, "utf-8", function(err, data){
            if (err) {
                cb(err);
                return;
            }
            let edited = injectorScript + "\n\n" + data;
            fs.writeFile(dest, edited, "utf-8", function (err) {
                cb(err);
            });
        });
       cb();
    };

    let endStream = function(cb){
        console.log("endStream");
        cb();
    };

    return through.obj(bufferContent, endStream);
}

// inject CSS for all visualizations into the js lib
gulp.task("injectCSS", function(cb){
    return gulp.src(paths.src + "**/*.css")
        .pipe(concat("quickvis.css"))
        .pipe(injectCSS(paths.build + "quickvis.js"));
});




// gather all the files needed for the demo page
gulp.task("copyDemo", function(){
    return gulp.src([
        paths.webapp + "app.js",
        paths.webapp + "index.html",
        paths.webapp + "main.css"
    ]).pipe(gulp.dest(paths.www));
});

gulp.task("copyDemoDist", function(){
    return gulp.src([paths.build + "quickvis.js", paths.build + "quickvis.js.map"])
        .pipe(gulp.dest(paths.www));
});

// livereload the demo page
gulp.task("reload", function(){
    livereload.reload();
});

// bring up a server with the demo page, and
// watch the demo page and quickvis source
// and livereload as needed
gulp.task("watch", ["demo"], function(){
    var port = 3006,
        hostname = "localhost";

    livereload.listen();

    // rebuild the quickvis lib and copy into www
    gulp.watch(paths.src + "**/*", ["dist", "copyDemoDist"]);
    // copy demo stuff into  www
    gulp.watch(paths.webapp + "**/*", ["copyDemo"]);

    // start webserver
    serv(paths.www, port);

    // open in browser
    // TODO - reuse existing tab
    exec("xdg-open http://"+ hostname +":"+ port, function(err, stdout, stderr){
        if(err){
            console.error("Huh...", stdout, stderr);
        }
    });
});





gulp.task("test", ["testJS"], function(cb){
    new karma.Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true,
        reporters: ["dots"]
        // TODO - chromedriver or *shudder* phantom
    }, cb).start();
});

gulp.task("tdd", ["JSbuildTestJS"], function (cb) {
    livereload.listen();
    gulp.watch(paths.src + "**/*", ["buildTestJS"]);
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
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

    var cb2 = function(){
        console.log("callin back");
        cb();
    };

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
