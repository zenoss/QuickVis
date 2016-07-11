"use strict";
/* jshint node: true */

let fs = require("fs"),
    path = require("path");

let VERSION = "0.1.0-dev";

let paths = {
    src: "src/",
    build: "build/",
    www: "www/",
    webapp: "demo/",
    root: process.cwd(),
    versionedQuickVis: `quickvis-${VERSION}.js`
};

// rollup needs an explicit list of places to
// look for deps, so generate a flat list of
// directories in the src directory
let srcSubdirectories = (function(srcPath){
    return fs.readdirSync(srcPath).filter(f => fs.statSync(path.join(srcPath, f)).isDirectory());
})(paths.src).map(dir => path.join(paths.src, dir));

module.exports = {
    paths: paths,
    srcSubdirectories: srcSubdirectories,
    VERSION: VERSION
};
