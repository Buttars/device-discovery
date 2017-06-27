
const EventEmitter = require('events')
const ping = require('net-ping')

module.exports = (range, start, end, timeout, retries, exclude) => {

    range = typeof range !== 'undefined' ? range : '192.168.0';
    start = typeof start !== 'undefined' ? start : 2;
    end = typeof end !== 'undefined' ? end : 254;
    timeout = typeof timeout !== 'undefined' ? timeout : 3000;
    retries = typeof retries !== 'undefined' ? retries : 0;
    exclude = typeof exclude !== 'undefined' ? exclude : false;

    const emitter = new EventEmitter()
    const session = ping.createSession({ timeout, retries })
    let pending = 0

    for (let i = start; i <= end; i++) {

        pending++
        const device = `${range}.${i}`

        session.pingHost(device, error => {
            if (!error && device !== exclude) emitter.emit('device', device)
            if (!--pending) {
                emitter.emit('done')
                session.close()
            }
        })
    }

    return emitter

}
