/*global module:false*/
module.exports = function(grunt) {
	"use strict";

	var jshint = "<json:.jshintrc>";

	// Project configuration.
	grunt.initConfig({
		lint: {
			files: ["grunt.js", "jquery.*.js", "test/*.js"]
		},
		qunit: {
			files: ["test/*.html"]
		},
		watch: {
			files: "<config:lint.files>",
			tasks: "lint qunit"
		},
		jshint: {
			options: jshint,
			globals: {
			}
		}
	});

	// Default task.
	grunt.registerTask("default", "lint qunit");

};
