define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Event Triggering', function()
    {
        describe('Events related with Connection', function()
        {
            this.timeout(30000);

            it('connection_failed event gets fired in case of failed connection', function(done)
            {
                var invalidClient = Stomp.client(TEST.badUrl);
                invalidClient.debug = TEST.debug;

                invalidClient.on('connection_failed', function(frame)
                {
                    done();
                });

                invalidClient.connect('foo', 'bar', function()
                {
                });
            });

            it('connection event gets fired in case of successful connection', function(done)
            {
                var client = Stomp.client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function(frame)
                {
                    done();
                    client.disconnect();
                });

                client.connect(TEST.login, TEST.password, function()
                {
                });
            });

            it('disconnect event gets fired in case of calling disconnect method', function(done)
            {
                var client = Stomp.client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function(frame)
                {
                    client.disconnect();
                });

                client.on('disconnect', function(frame)
                {
                    done();
                });

                client.connect(TEST.login, TEST.password, function()
                {
                });
            });

            it.skip('connection_error event gets fired in case of disconnection after a connection is done', function(done)
            {
                var client = Stomp.client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function(frame)
                {
                    // turn off STOMP brocker here!
                });

                client.on('connection_error', function(frame)
                {
                    done();
                });

                client.connect(TEST.login, TEST.password, function()
                {
                });
            });
        });

        describe('Events related with Messaging', function()
        {
            this.timeout(5000);

            it('message event gets fired in case of received message', function(done)
            {
                var payload = {
                    text: 'hello',
                    bool: true,
                    value: Math.random()
                };

                var client = Stomp.client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function(frame)
                {
                    client.on('message', function(frame)
                    {
                        var res = JSON.parse(message.body);
                        expect(res.text).to.equal(payload.text);
                        expect(res.bool).to.equal(payload.bool);
                        expect(res.value).to.equal(payload.value);
                        done();
                    });

                    client.subscribe(TEST.destination, function(message)
                    {
                    });

                    client.send(TEST.destination, {}, JSON.stringify(payload));
                });

                client.connect(TEST.login, TEST.password, function()
                {
                });
            });
        });
    });
});
