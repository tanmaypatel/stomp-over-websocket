define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Stomp Subscription', function()
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

    	it('Should receive messages sent to destination after subscribing', function(done)
        {
            var msg = 'Is anybody out there?';

            client.connect(TEST.login, TEST.password, function()
            {
                client.subscribe(TEST.destination, function(frame)
                {
                    expect(frame.body).to.equal(msg);
                    done();
                });

                client.send(TEST.destination, {}, msg);
            });
        });

        it('Should no longer receive messages after unsubscribing to destination', function(done)
        {
            var msg1 = 'Calling all cars!',
                subscription1 = null,
                subscription2 = null;

            client.connect(TEST.login, TEST.password, function()
            {
                subscription1 = client.subscribe(TEST.destination, function(frame)
                {
                    expect(false).to.not.equal('Should not have received message!');
                });

                subscription2 = client.subscribe(TEST.destination, function(frame)
                {
                    expect(frame.body).to.equal(msg1);
                    done();
                });

                subscription1.unsubscribe();
                client.send(TEST.destination, {}, msg1);
            });
        });
    });
});
