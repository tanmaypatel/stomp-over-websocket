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

export default {noop, now, trim, repeatEvery, stopRepeatation};
