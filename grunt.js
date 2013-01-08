/*global module:false */
/*jshint node:true */
"use strict";
module.exports = function (grunt) {
	grunt.initConfig({
		lint: {
			files: [
				"grunt.js",
				"jquery.*.js",
				"test/*.js"
			]
		},
		qunit: {
			files: ["test/*.html"]
		},
		watch: {
			files: "<config:lint.files>",
			tasks: "lint qunit"
		},
		jshint: {
			options: "<json:.jshintrc>"
		}
	});

	grunt.registerTask("default", "lint qunit");
};
