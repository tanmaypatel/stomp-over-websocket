define([
    'mocha',
    'chai',
    'stomp'
], function(mocha, chai, Stomp)
{
    describe('Stomp Frame', function()
    {
    	it('marshall a CONNECT frame', function()
        {
            var out = Stomp.Frame.marshall('CONNECT', {
                login: 'testlogin',
                passcode: 'testpassword'
            });

            expect(out).to.equal('CONNECT\nlogin:testlogin\npasscode:testpassword\n\n\0');
        });

        it('marshall a SEND frame', function()
        {
            var out = Stomp.Frame.marshall('SEND', {
                destination: '/queue/test',
                'content-length': false
            }, 'hello, world!');

            expect(out).to.equal('SEND\ndestination:/queue/test\n\nhello, world!\0');
        });

        it('unmarshall a CONNECTED frame', function()
        {
            var data = 'CONNECTED\nsession-id: 1234\n\n\0';
            var frame = Stomp.Frame.unmarshall(data)[0];
            expect(frame.command).to.equal('CONNECTED');
            expect(frame.headers).to.deep.equal({
                'session-id': '1234'
            });
            expect(frame.body).to.equal('');
        });

        it('unmarshall a RECEIVE frame', function()
        {
            var data = "RECEIVE\nfoo: abc\nbar: 1234\n\nhello, world!\0";
            var frame = Stomp.Frame.unmarshall(data)[0];
            expect(frame.command).to.equal('RECEIVE');
            expect(frame.headers).to.deep.equal({
                foo: 'abc',
                bar: '1234'
            });
            expect(frame.body).to.equal('hello, world!');
        });

        it('unmarshall should not include the null byte in the body', function()
        {
            var body1 = 'Just the text please.',
                body2 = 'And the newline\n',
                msg = 'MESSAGE\ndestination: /queue/test\nmessage-id: 123\n\n';

            expect(Stomp.Frame.unmarshall(msg + body1 + '\0')[0].body).to.equal(body1);
            expect(Stomp.Frame.unmarshall(msg + body2 + '\0')[0].body).to.equal(body2);
        });

        it('unmarshall should support colons (:) in header values', function()
        {
            var dest = 'foo:bar:baz',
                msg = 'MESSAGE\ndestination: ' + dest + '\nmessage-id: 456\n\n\0';

            expect(Stomp.Frame.unmarshall(msg)[0].headers.destination).to.equal(dest);
        });

        it('only the 1st value of repeated headers is used', function()
        {
            var msg = 'MESSAGE\ndestination: /queue/test\nfoo:World\nfoo:Hello\n\n\0';

            expect(Stomp.Frame.unmarshall(msg)[0].headers['foo']).to.equal('World');
        });
    });
});
