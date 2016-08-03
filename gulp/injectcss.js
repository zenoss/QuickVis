/* jshint node: true */
/* global console: true */
"use strict";

let gulp = require("gulp"),
    fs = require("fs"),
    through = require("through2"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass");

let {paths} = require("./config");

// generates a string of js that will inject the
// provided CSS into the DOM
function injectCSSTemplate(css){
    return `
(function injectCSS(){
    var style = document.createElement("style");
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
    };

    let endStream = function(cb){
        cb();
    };

    return through.obj(bufferContent, endStream);
}

// inject CSS for all visualizations into the js lib
gulp.task("injectCSS", function(cb){
    return gulp.src([
            paths.src + "**/*.css", 
            paths.src + "**/*.scss"
        ])
        // TODO - sourcemaps
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(concat("quickvis.css"))
        .pipe(injectCSS(paths.build + paths.versionedQuickVis));
});