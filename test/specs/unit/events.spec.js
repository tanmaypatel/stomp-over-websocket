define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Event Triggering', function()
    {
        describe('Events related with Frames', function()
        {
            this.timeout(5000);

            var client;

            beforeEach(function()
            {
                client = new Stomp.Client(TEST.url);
                client.debug = TEST.debug;
            });

            afterEach(function()
            {
                client.disconnect();
            });

            it('frame event gets fired in case of successful connection', function(done)
            {
                client.on('frame', function(frame)
                {
                    client.off('frame');

                    expect(frame.command).to.equal(Stomp.Commands.CONNECTED);

                    done();
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });

            it('frame event gets fired in case of received message', function(done)
            {
                var payload = {
                    text: 'hello',
                    bool: true,
                    value: Math.random()
                };

                client.on('connection', function()
                {
                    client.off('connection');

                    client.on('frame', function(frame)
                    {
                        client.off('frame');

                        expect(frame.command).to.equal(Stomp.Commands.MESSAGE);

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

            it('frame event gets fired in case of ack receipt', function(done)
            {
                var body = Math.random() + '';

                client.on('connection', function()
                {
                    client.off('connection');

                    var onmessage = function(message)
                    {
                        expect(message.body).to.equal(body);

                        var receipt = Math.random() + '';

                        client.on('frame', function(frame)
                        {
                            client.off('frame');

                            expect(frame.command).to.equal(Stomp.Commands.RECEIPT);

                            done();
                        });

                        message.ack({
                            receipt: receipt
                        });
                    }

                    var sub = client.subscribe(TEST.destination, onmessage, {
                        'ack': 'client'
                    });

                    client.send(TEST.destination, {}, body);
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });

            it('frame event gets fired in case of nack receipt', function(done)
            {
                var body = Math.random() + '';

                client.on('connection', function()
                {
                    client.off('connection');

                    var onmessage = function(message)
                    {
                        expect(message.body).to.equal(body);

                        var receipt = Math.random() + '';

                        client.on('frame', function(frame)
                        {
                            client.off('frame');

                            expect(frame.command).to.equal(Stomp.Commands.RECEIPT);

                            done();
                        });

                        message.nack({
                            receipt: receipt
                        });
                    }

                    var sub = client.subscribe(TEST.destination, onmessage, {
                        'ack': 'client'
                    });

                    client.send(TEST.destination, {}, body);
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });
        });

        describe('Events related with Connection', function()
        {
            this.timeout(30000);

            it('connection_failed event gets fired in case of failed connection', function(done)
            {
                var invalidClient = new Stomp.Client(TEST.badUrl);
                invalidClient.debug = TEST.debug;

                invalidClient.on('connection_failed', function(frame)
                {
                    invalidClient.off('connection_failed');
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

        describe('Events related with Receipt', function()
        {
            var client;

            beforeEach(function()
            {
                client = new Stomp.Client(TEST.url);
                client.debug = TEST.debug;
            });

            afterEach(function()
            {
                client.disconnect();
            });

            it('receipt event gets fired in case of ack receipt', function(done)
            {
                var body = Math.random() + '';

                client.on('connection', function()
                {
                    client.off('connection');

                    var onmessage = function(message)
                    {
                        expect(message.body).to.equal(body);

                        var receipt = Math.random() + '';

                        client.on('receipt', function(frame)
                        {
                            client.off('receipt');

                            expect(receipt).to.equal(frame.headers['receipt-id']);

                            done();
                        });

                        message.ack({
                            receipt: receipt
                        });
                    }

                    var sub = client.subscribe(TEST.destination, onmessage, {
                        'ack': 'client'
                    });

                    client.send(TEST.destination, {}, body);
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });

            it('receipt event gets fired in case of nack receipt', function(done)
            {
                var body = Math.random() + '';

                client.on('connection', function()
                {
                    client.off('connection');

                    var onmessage = function(message)
                    {
                        expect(message.body).to.equal(body);

                        var receipt = Math.random() + '';

                        client.on('receipt', function(frame)
                        {
                            client.off('receipt');

                            expect(receipt).to.equal(frame.headers['receipt-id']);

                            done();
                        });

                        message.nack({
                            receipt: receipt
                        });
                    }

                    var sub = client.subscribe(TEST.destination, onmessage, {
                        'ack': 'client'
                    });

                    client.send(TEST.destination, {}, body);
                });

                client.connect({
                    login: TEST.login,
                    passcode: TEST.password
                });
            });
        });
    });
});
