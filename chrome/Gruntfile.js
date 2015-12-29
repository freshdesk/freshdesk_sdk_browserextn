module.exports = function(grunt) {
  require('time-grunt')(grunt);
  grunt.initConfig({
    crx: {
      "frsh-dev-extn": {
        "src": "src/**/*",
        "dest": "build/crx/",
        "zipDest" : "build/zip/",
        "options": {
          "privateKey": "key.pem"
        }
      }
    },
    clean: {
      build: {
        src: [ 'build' ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-crx');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['clean', 'crx']);
};
