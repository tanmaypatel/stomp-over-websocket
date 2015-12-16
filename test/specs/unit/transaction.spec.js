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
            client = Stomp.client(TEST.url);
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

            client.connect(TEST.login, TEST.password, function()
            {
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
        });

        it('Send a message in a transaction and commit', function(done)
        {
            var body = Math.random() + '';

            client.connect(TEST.login, TEST.password, function()
            {
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
        });

        it('Send a message outside a transaction and abort', function(done)
        {
            var body = Math.random() + '';

            client.connect(TEST.login, TEST.password, function()
            {
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
        });
    });
});
