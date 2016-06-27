// TODO - test runner
// TODO - transpiler

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    livereload = require("gulp-livereload"),
    sourcemaps = require("gulp-sourcemaps"),
    sequence = require("gulp-sequence"),
    serv = require("./serv"),
    exec = require("child_process").exec,
    globule = require("globule");

var paths = {
    src: "src/",
    build: "build/",
    www: "www/",
    css: "css/",
    lib: "lib/"
};

gulp.task("default", function(callback){
    sequence("build", "copy", "reload")(callback);
});

gulp.task("build", ["concatJS", "concatCSS"]);

gulp.task("concatJS", function(){
    var files = globule.find([paths.src + "**/*.js", "!"+ paths.src +"app.js", "!"+ paths.src +"core.js"]);
    // make sure core quickvis stuff loads first
    files.unshift(paths.src + "core.js");
    // make sure app stuff loads last
    files.push(paths.src + "app.js");
    return gulp.src(files)
        .pipe(sourcemaps.init())
            .pipe(concat("app.js"))
        .pipe(sourcemaps.write("./", { sourceRoot: "src" }))
        .pipe(gulp.dest(paths.build));
});
gulp.task("concatCSS", function(){
    return gulp.src(paths.css + "**/*.css")
        .pipe(concat("app.css"))
        .pipe(gulp.dest(paths.build));
});


gulp.task("copy", function(callback){
    sequence(["copyBuild", "copyIndex", "copyLib"])(callback);
});

gulp.task("copyBuild", function(){
    return gulp.src(paths.build + "**/*")
        .pipe(gulp.dest(paths.www));
});
gulp.task("copyIndex", function(){
    return gulp.src("index.html")
        .pipe(gulp.dest(paths.www));
});
gulp.task("copyLib", function(){
    return gulp.src(paths.lib + "**/*")
        .pipe(gulp.dest(paths.www));
});

gulp.task("reload", function(){
    livereload.reload();
});

gulp.task("watch", ["default"], function(){
    var port = 3006,
        hostname = "localhost";

    livereload.listen();

    gulp.watch(paths.src + "**/*.js", ["default"]);
    gulp.watch(paths.css + "**/*.css", ["default"]);
    gulp.watch("index.html", ["default"]);

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
