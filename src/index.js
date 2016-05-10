var zepto = require('zepto-browserify');

if (!window.$) {
    window.$ = zepto.$;
}

var gtm = require('./gtm');
var dealer = require('./dealer');
var dealerTatsu = require('./dealerTatsu');

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
    } else if (data[0] === 'dealer') {
        fn = dealer[data[1]];
        args = data.slice(2);
        if (typeof fn === 'function') {
            fn.apply(dealer, args);
        }
    } else if (data[0] === 'dealerTatsu') {
        fn = dealerTatsu[data[1]];
        args = data.slice(2);
        if (typeof fn === 'function') {
            fn.apply(dealerTatsu, args);
        }
    }
}

var ut = window.ut || (window.ut = []);

ut.push = function() {
    Array.prototype.push.apply(window.ut, arguments);
    processCommand.apply({}, arguments);
};

ut.forEach(processCommand);
ut.length = 0;

require('./trackingElement');

module.exports = {
    gtm: gtm,
    dealer: dealer,
    dealerTatsu: dealerTatsu,
    ut: ut
};
