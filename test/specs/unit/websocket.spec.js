define([
    'mocha',
    'chai'
], function(mocha, chai)
{
    describe('Web Sockets', function()
    {
    	it('check Web Sockets support', function()
        {
            expect(WebSocket).to.exist;
        });
    });
});
