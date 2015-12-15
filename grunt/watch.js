module.exports = {
	options: {
		livereload: true
	},
	configFiles: {
		files: ['Gruntfile.js', 'grunt/*.js'],
		options: {
			livereload: false,
			reload: true
		}
	},
	scripts: {
		options: {
			livereload: false
		},
		files: ['<%= srcLocation %>/**/*.js'],
		tasks: ['babel:development', 'eslint']
	}
};
