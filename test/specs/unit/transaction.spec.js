define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Stomp Transaction', function()
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

    	it('Send a message in a transaction and abort', function(done)
        {
            var body = Math.random() + '';
            var body2 = Math.random() + '';

            client.on('connection', function()
            {
                client.off('connection');

                client.subscribe(TEST.destination, function(message)
                {
                    // we should receive the 2nd message outside the transaction
                    expect(message.body).to.equal(body2);
                    done();
                });

                var tx = client.begin('txid_' + Math.random());
                client.send(TEST.destination, {
                    transaction: tx.id
                }, body);
                tx.abort();

                client.send(TEST.destination, {}, body2);
            });

            client.connect({
                login: TEST.login,
                passcode: TEST.password
            });
        });

        it('Send a message in a transaction and commit', function(done)
        {
            var body = Math.random() + '';

            client.on('connection', function()
            {
                client.off('connection');

                client.subscribe(TEST.destination, function(message)
                {
                    // we should receive the 2nd message outside the transaction
                    expect(message.body).to.equal(body);
                    done();
                });

                var tx = client.begin('txid_' + Math.random());
                client.send(TEST.destination, {
                    transaction: tx.id
                }, body);
                tx.commit();
            });

            client.connect({
                login: TEST.login,
                passcode: TEST.password
            });
        });

        it('Send a message outside a transaction and abort', function(done)
        {
            var body = Math.random() + '';

            client.on('connection', function()
            {
                client.off('connection');
                
                client.subscribe(TEST.destination, function(message)
                {
                    // we should receive the 2nd message outside the transaction
                    expect(message.body).to.equal(body);
                    done();
                });

                var tx = client.begin();
                client.send(TEST.destination, {}, body);
                tx.abort();
            });

            client.connect({
                login: TEST.login,
                passcode: TEST.password
            });
        });
    });
});
