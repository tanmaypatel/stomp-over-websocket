define([], function()
{
    var TEST = {
        destination : '/topic/chat.general',
        login : 'guest',
        password : 'guest',
        url : 'ws://localhost:15674/ws',
        httpurl : 'http://localhost:15674/stomp',
        badUrl: 'ws://localhost:15675/ws',
        timeout: 1800,
        debug : function(str)
        {
          console.debug(str);
        }
    };

    console.info('URL: %s', TEST.url);
    console.info('Destination: %s', TEST.destination);
    console.info('User: %s / %s', TEST.login, TEST.password);

    return TEST;
});
