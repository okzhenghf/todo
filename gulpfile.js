var gulp = require('gulp');//引入gulp
var gulpminHtml=require("gulp-minify-html");//压缩html
var $ = require("gulp-load-plugins")();//引进所有的包
var open = require('open');//引入open

//lib
gulp.task("lib",function () {
    gulp.src("src/lib/**/*.js")
        .pipe(gulp.dest("build/lib/"))
        .pipe(gulp.dest("dev/lib/"))
});

//复制html
gulp.task("html",function () {
    gulp.src("src/*.html")//读取文件
        .pipe(gulp.dest("build/"))//复制开发环境
        .pipe(gulpminHtml())//压缩
        .pipe(gulp.dest("dev"))//复制生产环境
        .pipe($.connect.reload())
});
//合并压缩js
gulp.task("js",function () {
    gulp.src("src/js/*.js")//读取文件
        .pipe($.concat("index.js"))//合并js
        .pipe(gulp.dest("build/js"))//复制到开发环境
        .pipe($.uglify())//压缩js复制到生产环境
        .pipe(gulp.dest("dev/js"))//复制到生产环境
        .pipe($.connect.reload())
});
//压缩css
gulp.task("css",function () {
    gulp.src("src/css/*.css")//读取文件
        .pipe(gulp.dest("build/css"))//复制到开发环境
        .pipe($.cssmin())//压缩css复制到生产环境
        .pipe(gulp.dest("dev/css"))//复制到生产环境
        .pipe($.connect.reload())
});
//压缩img
gulp.task("img",function () {
    gulp.src("src/img/*")//读取文件
        .pipe(gulp.dest("build/img"))//复制到开发环境
        .pipe($.imagemin())//压缩css复制到生产环境
        .pipe(gulp.dest("dev/img"))//复制到生产环境
        .pipe($.connect.reload())
});
//删除文件
gulp.task("clean",function () {
    gulp.src(["dev/","build/"])//读取文件
        .pipe($.clean());

});
//总的任务
gulp.task("build",["html","js","img","css","lib"])

//自动刷新,自动打开
gulp.task("server",function () {
    $.connect.server({
        root:"build/",
        port:8000,
        livereload:true

    });
    open("http://localhost:8000");

    gulp.watch("src/*.html",["html"]);
    gulp.watch("src/js/*.js",["js"]);
    gulp.watch("src/css/*.css",["css"]);
    gulp.watch("src/img/*",["img"]);

})
//默认任务
gulp.task('default',['server'])