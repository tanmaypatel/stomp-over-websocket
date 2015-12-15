define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Stomp Message', function()
    {
        this.timeout(5000);

    	it('Send and receive a message', function(done)
        {
            var body = Math.random() + '';

            var client = Stomp.client(TEST.url);
            client.debug = TEST.debug;
            client.connect(TEST.login, TEST.password, function()
            {
                client.subscribe(TEST.destination, function(message)
                {
                    expect(message.body).to.equal(body);
                    client.disconnect(function()
                    {
                        done();
                    });
                });

                client.send(TEST.destination, {}, body);
            });
        });

        it('Send and receive a message with a JSON body', function(done)
        {
            var client = Stomp.client(TEST.url);
            var payload = {
                text: 'hello',
                bool: true,
                value: Math.random()
            };

            var client = Stomp.client(TEST.url);
            client.debug = TEST.debug;
            client.connect(TEST.login, TEST.password, function()
            {
                client.subscribe(TEST.destination, function(message)
                {
                    var res = JSON.parse(message.body);
                    expect(res.text).to.equal(payload.text);
                    expect(res.bool).to.equal(payload.bool);
                    expect(res.value).to.equal(payload.value);
                    client.disconnect(function()
                    {
                        done();
                    });
                });

                client.send(TEST.destination, {}, JSON.stringify(payload));
            });
        });
    });
});
