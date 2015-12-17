let noop = function() {};

let now = function()
{
    if(Date.now)
    {
        return Date.now();
    }
    else
    {
        return new Date().valueOf;
    }
};

let trim = function(str)
{
    return str.replace(/^\s+|\s+$/g, '');
};

let repeatEvery = noop;
let stopRepeatation = noop;

if(typeof window !== 'undefined' && window !== null)
{
    repeatEvery = function(interval, func)
    {
        return window.setInterval(func, interval);
    };

    stopRepeatation = function(id)
    {
        return window.clearInterval(id);
    };
}

let generateUUID = function()
{
    var d = now();

    if(window.performance && typeof window.performance.now === "function")
    {
        d += performance.now(); //use high-precision timer if available
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
}

export default {noop, now, trim, repeatEvery, stopRepeatation};
