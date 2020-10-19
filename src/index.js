const trackingEnabled = location.hash.indexOf('tracking-off=true') < 0;

const startTracking = () => {
    var gtm = require('./gtm');
    var dealerGtm = require('./dealer-gtm');

    function processCommand(data) {
        var fn, args;

        if (data[0] === 'pagename') {
            gtm.setPagename(data[1]);
        }

        if (data[0] === 'gtm') {
            fn = gtm[data[1]];
            args = data.slice(2);
            if (typeof fn === 'function') {
                fn.apply(gtm, args);
            }
        } else if (data[0] === 'dealer-gtm') {
            fn = dealerGtm[data[1]];
            args = data.slice(2);
            if (typeof fn === 'function') {
                fn.apply(dealerGtm, args);
            }
        }
    }

    var ut = window.ut || (window.ut = []);

    if (ut.push === Array.prototype.push) {
        ut.push = function () {
            Array.prototype.push.apply(window.ut, arguments);
            processCommand.apply({}, arguments);
        };

        ut.forEach(processCommand);
    }

    require('./trackingElement');

    module.exports = {
        gtm: gtm,
        ut: ut,
    };
};

require('./clickTrackingAttributes.js');

if (window.location.hostname.split('.').pop() === 'de') {
    require('./ivw');
}

if (window.location.hostname.split('.').pop() === 'at') {
    require('./oewa');
}

const run = () => {
    if (!trackingEnabled) {
        console.log('Tracking disabled');
        return;
    }

    startTracking();
};

run();
