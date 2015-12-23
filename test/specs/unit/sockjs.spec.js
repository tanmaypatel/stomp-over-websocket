define([
    'mocha',
    'chai',
    'sockjs',
    'stomp',
    './config'
], function(mocha, chai, SockJS, Stomp, TEST)
{
    describe('Web Sockets like Emulation Library', function()
    {
        describe('Stomp Connection', function()
        {
            this.timeout(5000);

            it('Connect to a valid Stomp server', function(done)
            {
                var client = new Stomp.Client(TEST.url, SockJS, {
                    transports: ['websocket ']
                });

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
                var client = new Stomp.Client(TEST.url, SockJS, {
                    transports: ['websocket ']
                });

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
});
