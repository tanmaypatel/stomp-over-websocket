import Client from './Client';
import Frame from './Frame';

let Stomp = {
    VERSIONS: {
        V1_0: '1.0',
        V1_1: '1.1',
        V1_2: '1.2',
        supportedVersions: function()
        {
            return '1.1,1.0';
        }
    }
};

if(typeof window !== 'undefined' && window !== null)
{
    Stomp.setInterval = function(interval, f)
    {
        return window.setInterval(f, interval);
    };

    Stomp.clearInterval = function(id)
    {
        return window.clearInterval(id);
    };
}

export default Stomp;
