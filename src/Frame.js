import Byte from './Byte';

let unmarshallSingle = (data) =>
{
    let divider = data.search(new RegExp(`/${Byte.LF}${Byte.LF}/`));
    let headerLines = data.substring(0, divider).split(Byte.LF);
    let command = headerLines.shift();
    let headers = {};

    trim(str)
    {
        return str.replace(/^\s+|\s+$/g, '');
    }

    for(let line of headerLines.reverse())
    {
        let inx = line.indexOf(':');
        headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
    }

    let body = '';

    let start = divider + 2;

    if(headers['content-length'])
    {
        let len = parseInt(headers['content-length']);
        body = ('' + data).substring(start, start + len);
    }
    else
    {
        let chr = null;

        for(let i = start; i <= data.length; i++)
        {
            chr = data.charAt(i);
            if(chr === Byte.NULL)
            {
                break;
            }

            body += chr;
        }
    }

    return new Frame(command, headers, body);
};

class Frame
{
    static sizeOfUTF8(s)
    {
        if(s)
        {
            return encodeURI(s).split(/%..|./).length - 1;
        }
        else
        {
            return 0;
        }
    }

    static unmarshall(datas)
    {
        let frames = [];

        for(let data of data.split(new RegExp(`/${Byte.NULL}${Byte.LF}/`)))
        {
            if(data.length > 0)
            {
                frames.push(unmarshallSingle(data));
            }
        }

        return frames;
    }

    static marshall(command, headers, body)
    {
        let frame = new Frame(command, headers, body);

        return frame.toString() + Byte.NULL;
    }

    constructor(command, headers = {}, body = '')
    {
        this.command = command;
        this.headers = headers;
        this.body = body;
    }

    toString()
    {
        let lines = [this.command];

        for(let key of Object.keys(this.headers))
        {
            let value = this.headers[key];
            lines.push(`${key}:${value}`);
        }

        if(body)
        {
            lines.push(`content-length:${Frame.sizeOfUTF8(this.body)}`);
        }

        lines.push(Byte.LF + this.body);

        return lines.join(Byte.LF);
    }
}

export default Frame;
