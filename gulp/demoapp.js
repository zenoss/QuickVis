"use strict";
/* jshint node: true */

var gulp = require("gulp"),
    livereload = require("gulp-livereload"),
    sequence = require("gulp-sequence"),
    exec = require("child_process").exec;

let {paths} = require("./config"),
    serv = require("./../serv");

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

gulp.task("rebuild", function(cb){
    sequence("demo", "reload")(cb);
});

gulp.task("copyDemoReload", function(cb){
    sequence("copyDemo", "reload")(cb);
});

// bring up a server with the demo page, and
// watch the demo page and quickvis source
// and livereload as needed
gulp.task("watch", ["demo"], function(){
    var port = 3006,
        hostname = "localhost";

    livereload.listen();

    // rebuild the quickvis lib and copy into www
    gulp.watch(paths.src + "**/*", ["rebuild"]);
    // copy demo stuff into  www
    gulp.watch(paths.webapp + "**/*", ["copyDemoReload"]);

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
