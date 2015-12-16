define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Stomp Connection', function()
    {
        this.timeout(5000);

    	it('Connect to an invalid Stomp server', function(done)
        {
            var client = new Stomp.Client(TEST.badUrl);

            client.on('connection_failed', function(frame)
            {
                client.off('connection_failed');

                done();
            });

            client.connect({
                login: 'foo',
                passcode: 'bar'
            });
        });

        it('Connect to a valid Stomp server', function(done)
        {
            var client = new Stomp.Client(TEST.url);

            client.on('connection', function()
            {
                client.off('connection');

                done();
            });

            client.connect({
                login: TEST.login,
                passcode: TEST.password
            });
        });

        it('Disconnect', function(done)
        {
            var client = new Stomp.Client(TEST.url);

            client.on('connection', function()
            {
                client.off('connection');
                
                client.disconnect();
            });

            client.on('disconnect', function(frame)
            {
                client.off('disconnect');

                done();
            });

            client.connect({
                login: TEST.login,
                passcode: TEST.password
            });
        });
    });
});
