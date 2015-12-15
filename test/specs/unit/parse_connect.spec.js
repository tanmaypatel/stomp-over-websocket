define([
    'mocha',
    'chai',
    'stomp',
    './config'
], function(mocha, chai, Stomp, TEST)
{
    describe('Parse connect method arguments', function()
    {
        var myConnectCallback,
            myErrorCallback,
            client,
            checkArgs;

        before(function()
        {
            // prepare something for all following tests
            myConnectCallback = function()
            {
              // called back when the client is connected to STOMP broker
            };

            myErrorCallback = function()
            {
              // called back if the client can not connect to STOMP broker
            };

            client = Stomp.client(TEST.url);

            checkArgs = function(args, expectedHeaders, expectedConnectCallback, expectedErrorCallback)
            {
                var headers = args[0];
                var connectCallback = args[1];
                var errorCallback = args[2];

                expect(headers).to.deep.equal(expectedHeaders);
                expect(connectCallback).to.equal(expectedConnectCallback);
                expect(errorCallback).to.equal(expectedErrorCallback);
            }
        });

    	it('connect(login, passcode, connectCallback)', function()
        {
            checkArgs(client._parseConnect('testlogin', 'testpassword', myConnectCallback),
                      {
                          login: 'testlogin',
                          passcode: 'testpassword'
                      },
                      myConnectCallback,
                      null);
        });

        it('connect(login, passcode, connectCallback, errorCallback)', function()
        {
            checkArgs(client._parseConnect('testlogin', 'testpassword', myConnectCallback, myErrorCallback),
                      {
                          login: 'testlogin',
                          passcode: 'testpassword'
                      },
                      myConnectCallback,
                      myErrorCallback);
        });

        it('connect(login, passcode, connectCallback, errorCallback, vhost)', function()
        {
            checkArgs(client._parseConnect('testlogin', 'testpassword', myConnectCallback, myErrorCallback, 'testvhost'),
                      {
                          login: 'testlogin',
                          passcode: 'testpassword',
                          host: 'testvhost'
                      },
                      myConnectCallback,
                      myErrorCallback);
        });

        it('connect(headers, connectCallback)', function()
        {
            var headers = {
                login: 'testlogin',
                passcode: 'testpassword',
                host: 'testvhost'
            };

            checkArgs(client._parseConnect(headers, myConnectCallback),
                      headers,
                      myConnectCallback,
                      null);
        });

        it('connect(headers, connectCallback, errorCallback)', function()
        {
            var headers = {
                login: 'testlogin',
                passcode: 'testpassword',
                host: 'testvhost'
            };

            checkArgs(client._parseConnect(headers, myConnectCallback, myErrorCallback),
                      headers,
                      myConnectCallback,
                      myErrorCallback);
        });
    });
});
