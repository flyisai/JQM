/**
 * Created by Thinkpad on 2014/6/10.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            main_js: {
                files: {
                    'dest/main.min.js' : ['js/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default',['uglify']);
};