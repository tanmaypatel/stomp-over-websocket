define([], function()
{
    var TEST = {
        destination : '/topic/chat.general',
        login : 'admin',
        password : 'password',
        url : 'ws://localhost:61623',
        badUrl: 'ws://localhost:61625',
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
