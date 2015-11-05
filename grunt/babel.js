module.exports = {
    development: {
        options: {
            sourceMap: true,
            presets: ['es2015']
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
