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
            client.connect('foo', 'bar', function()
            {
            }, function()
            {
                done();
            });
        });

        it('Connect to a valid Stomp server', function(done)
        {
            var client = new Stomp.Client(TEST.url);
            client.connect(TEST.login, TEST.password, function()
            {
                done();
            });
        });

        it('Disconnect', function(done)
        {
            var client = new Stomp.Client(TEST.url);
            client.connect(TEST.login, TEST.password, function()
            {
                // once connected, we disconnect
                client.disconnect(function()
                {
                    done();
                });
            });
        });
    });
});
