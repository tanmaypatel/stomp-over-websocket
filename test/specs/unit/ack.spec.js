define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Stomp Acknowledgement', function()
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

        it('Subscribe using client ack mode, send a message and ack it', function(done)
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
                        'receipt': receipt
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

    	it('Subscribe using client ack mode, send a message and nack it', function(done)
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
                        'receipt': receipt
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
