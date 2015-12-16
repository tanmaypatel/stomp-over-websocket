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

    	it('Send and receive a message', function(done)
        {
            var body = Math.random() + '';

            client.on('connection', function()
            {
                client.off('connection');

                client.subscribe(TEST.destination, function(message)
                {
                    expect(message.body).to.equal(body);

                    done();
                });

                client.send(TEST.destination, {}, body);
            });

            client.connect({
                login: TEST.login,
                passcode: TEST.password
            });
        });

        it('Send and receive a message with a JSON body', function(done)
        {
            var payload = {
                text: 'hello',
                bool: true,
                value: Math.random()
            };

            client.on('connection', function()
            {
                client.off('connection');
                
                client.subscribe(TEST.destination, function(message)
                {
                    var res = JSON.parse(message.body);
                    expect(res.text).to.equal(payload.text);
                    expect(res.bool).to.equal(payload.bool);
                    expect(res.value).to.equal(payload.value);

                    done();
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
