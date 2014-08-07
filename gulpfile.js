"use strict";

/*jshint node: true */
/* global concat: true */

// ************************
// * Rise Vision Store UI *
// * build script         *
// ************************

// Include gulp

var gulp = require("gulp"),
    // Include Our Plugins
    karma = require("gulp-karma"),
    jshint = require("gulp-jshint"),
    watch = require("gulp-watch"),
    connect = require("gulp-connect"),
    httpServer,

    //Test files
    testFiles = [
      "components/jQuery/dist/jquery.js",
      "components/q/q.js",
      "components/angular/angular.js",
      "components/angular-route/angular-route.js",
      "components/angular-mocks/angular-mocks.js",
      "components/angular-spinner/angular-spinner.js",
      "components/spin.js/spin.js",
      "components/spin.js/jquery.spin.js",
      "loading.js",
      "tests.js"
    ],

    filesToLint  = [
      "loading.js",
      "tests.js"
    ];

gulp.task("lint", function() {
  return gulp.src(filesToLint)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .on("error", function () {
      process.exit(1);
    });
});

gulp.task("watch", function() {
    return gulp.watch(filesToLint, ["lint"]);
});

gulp.task("test", function() {
  // Be sure to return the stream
  return gulp.src(testFiles).pipe(
    watch(function(files) {
      return files.pipe(karma({
        configFile: "karma.conf.js",
        action: "start"
      }))
      .on("error", function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });  
    }));
});

gulp.task("server", function() {
  httpServer = connect.server({
    root: "./",
    port: 8000,
    livereload: true
  });
  return httpServer;
});

gulp.task("default", [], function () {
  console.log("\n***********************");
  console.log("* Tell me what to do: *");
  console.log("***********************");
  console.log("* gulp lint           *");
  console.log("* gulp watch          *");
  console.log("* gulp test           *");
  console.log("***********************\n");
  return true;
});