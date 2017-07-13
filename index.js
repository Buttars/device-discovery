'use strict'

const getIfaceAddress = require('./lib/get-iface-address')
const getIfaceRange = address => address.split('.').splice(0, 3).join('.')

const getScanner = type => {
    switch (type) {
        case 'ICMP': return require('./lib/ping-range-icmp')
        case 'TCP': return require('./lib/scan-range-tcp')
        default: throw new Error(`Unknown type '${type}'`)
    }
}

module.exports = (type, iface, start, end, port, timeout, retries, excludeSelf) => {

    type = (typeof type !== 'undefined' && type != null) ? type : 'ICMP';
    iface = (typeof iface !== 'undefined' && iface != null) ? iface : 'WiFi';
    start = (typeof start !== 'undefined' && start != null) ? start : 2;
    end = (typeof end !== 'undefined' && end != null) ? end : 254;
    port = (typeof port !== 'undefined' && port != null) ? port : 1;
    timeout = (typeof timeout !== 'undefined' && timeout != null) ? timeout : 3000;
    retries = (typeof retries !== 'undefined' && retries != null) ? retries : 0;
    excludeSelf = (typeof excludeSelf !== 'undefined' && excludeSelf != null) ? excludeSelf : true;

    const address = getIfaceAddress(iface)
    const range = getIfaceRange(address)

    let exclude = excludeSelf ? address : false

    return getScanner(type)(range, start, end, port, timeout, retries, exclude)

}
