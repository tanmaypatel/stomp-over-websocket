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
                var invalidClient = new Stomp.Client(TEST.badUrl);
                invalidClient.debug = TEST.debug;

                invalidClient.on('connection_failed', function(frame)
                {
                    done();
                });

                invalidClient.connect({
                    login: 'foo',
                    passcode: 'bar'
                });
            });

            it('connection event gets fired in case of successful connection', function(done)
            {
                var client = new Stomp.Client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function()
                {
                    client.off('connection');

                    client.disconnect();

                    done();
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });

            it('disconnect event gets fired in case of calling disconnect method', function(done)
            {
                var client = new Stomp.Client(TEST.url);
                client.debug = TEST.debug;

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

            it.skip('connection_error event gets fired in case of disconnection after a connection is done', function(done)
            {
                var client = new Stomp.Client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function()
                {
                    client.off('connection');
                    // turn off STOMP brocker here!
                });

                client.on('connection_error', function(frame)
                {
                    client.off('connection_error');

                    done();
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
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

                var client = new Stomp.Client(TEST.url);
                client.debug = TEST.debug;

                client.on('connection', function()
                {
                    client.off('connection');

                    client.on('message', function(message)
                    {
                        client.off('message');
                        
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

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });
        });
    });
});
