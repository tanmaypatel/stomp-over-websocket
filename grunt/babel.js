module.exports = {
    development: {
        options: {
            sourceMap: true,
            compact: false
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
