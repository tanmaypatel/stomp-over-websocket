module.exports = function(grunt)
{
	require('time-grunt')(grunt);
	require('load-grunt-config')(grunt, {
        config: {
        	srcLocation: 'src',
			compiledLocation: 'compiled',
    		distLocation: 'dist'
        }
	});

	grunt.registerTask('default', ['babel:development', 'eslint']);
};
