const trackingEnabled = location.hash.indexOf('tracking-off=true') < 0;
const cmpEnabled = location.href.indexOf('__cmp') >= 0;
// const alreadyHaveConsent

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

const cmp = require('./cmp');

const run = () => {
    if (!trackingEnabled) {
        console.log('Tracking disabled');
        return;
    }

    if (!cmp.isCmpEnabled()) {
        startTracking();
        return;
    }

    // We load the CMP and do some magic here
    cmp.loadCmpStub();
    cmp.loadCmp();

    // Either wait for consent/dissent
    // OR load cached consent object and put it into dataLayer variables

    // if (cmp.hasLocalCmpDecision()) {
    //     console.log('Has CMP decision');
    //     startTracking();
    //     return;
    // }

    // cmp.updateCachedDecisionWhenItChanges();

    // cmp.waitForFirstCmpDecision().then(() => {
    //     console.log('Got first decision');
    //     cmp.updateLocalCmpDecision().then(() => {
    //         console.log('localStorage updated');
    //         startTracking();
    //     });
    // });
};

run();
