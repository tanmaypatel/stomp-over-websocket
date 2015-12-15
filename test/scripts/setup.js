requirejs.config({

	waitSeconds: 300,

	baseUrl : './',

	paths : {
		'mocha' : '../bower_components/mocha/mocha',
		'chai' : '../bower_components/chai/chai',
		'sinon' : '../bower_components/sinon/lib/sinon',
		'sinon-chai' : '../bower_components/sinon-chai/lib/sinon-chai'
	},

	packages: [{
        name: 'stomp',
        location: '../compiled',
        main: 'index'
    }],

	shim: {
		'chai': {
			exports: 'chai'
		},

		'mocha': {
			deps: ['chai'],
			exports: 'mocha'
		},

		'sinon': {
			exports: 'sinon'
		}
	}

});

require([
	'mocha',
	'chai',
	'sinon',
	'sinon-chai'
], function(mocha, chai, sinon, sinonChai)
{
	assert = chai.assert;
	should = chai.should();
	expect = chai.expect;

	chai.use(sinonChai);

	mocha.setup('bdd');
	mocha.bail(false);

	require([
		'specs/unit/websocket.spec',
		'specs/unit/frame.spec',
		'specs/unit/parse_connect.spec',
		'specs/unit/connection.spec'
	], function()
	{
		mocha.run();
	});
});
