import Client from './Client';
import Frame from './Frame';

const Versions = {
    V1_0: '1.0',
    V1_1: '1.1',
    V1_2: '1.2',
    supportedVersions: function()
    {
        return '1.1,1.0';
    }
}

export default Versions;
