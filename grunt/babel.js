module.exports = {
    development: {
        options: {
            sourceMap: true
        },
        files: [{
			expand: true,
			cwd: '<%= srcLocation %>/',
			src: ['**/*.js'],
			dest: '<%= compiledLocation %>/',
            ext: '.js'
		}]
    }
};
