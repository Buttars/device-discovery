'use strict'

const EventEmitter = require('events')
const ping = require('net-ping')

module.exports = (range, start, end, timeout, retries, exclude) => {
    range = (typeof range !== 'undefined' && range != null) ? range : '192.168.0';
    start = (typeof start !== 'undefined' && start != null) ? start : 2;
    end = (typeof end !== 'undefined' && end != null) ? end : 254;
    timeout = (typeof timeout !== 'undefined' && timeout != null) ? timeout : 3000;
    retries = (typeof retries !== 'undefined' && retries != null) ? retries : 0;
    exclude = (typeof exclude !== 'undefined' && exclude != null) ? exclude : false;

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
