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

module.exports = ( type,  iface, start, end, port, timeout, retries, excludeSelf ) => {
    
    type = typeof type !== 'undefined' ? type : 'ICMP';
    iface = typeof iface !== 'undefined' ? iface : 'WiFi';
    start = typeof start !== 'undefined' ? type : 2;
    end = typeof end !== 'undefined' ? end : 254;
    port = typeof port !== 'undefined' ? port : 1; 
    timeout = typeof timeout !== 'undefined' ? timeout : 3000;
    retries = typeof retries !== 'undefined' ? retries: 0; 
    excludeSelf = typeof excludeSelf !== 'undefined' ? excludeSelf : true;

    const address = getIfaceAddress(iface)
    const range = getIfaceRange(address)

    return getScanner(type)({ range, start, end, port, timeout, retries,
        exclude: excludeSelf ? address : false })

}
