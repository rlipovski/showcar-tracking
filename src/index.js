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

const cmp = require('./cmp');

const run = () => {
    if (!trackingEnabled) {
        console.log('Tracking disabled');
        return;
    }

    if (!cmp.isCmpEnabled()) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ cmp_enabled: false });
        startTracking();
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ cmp_enabled: true });

    // We load the CMP and do some magic here
    cmp.loadCmpAsync();

    // window.__cmp('addEventListener', 'cmpReady', () => {
    // When consent changes we update dataLayer and localStorage.__as24_cached_cmp_consent
    cmp.updateDataLayerAndCacheOnConsentChange();

    cmp.sendMetricsOnEvents();

    // !!! We don't load GTM in NL without consent !!!
    if (cmp.isCmpEnabled() && window.location.hostname.split('.').pop() === 'nl') {
        cmp.waitForConsentAgreementIfNeeded().then((hasGivenConsent) => {
            if (hasGivenConsent) {
                startTracking();
            }
        });
    } else {
        cmp.waitForConsentIfNeeded().then(() => startTracking());
    }

    // if (cmp.trySetDataLayerVariablesFromCache()) {
    //     // We have consent data in cache so we can proceed loading GTM
    //     startTracking();
    // } else {
    //     // We don't have previous consent in cache therefore we are waiting for getting one
    //     // This is to avoid losing important conversion tracking events: Google Ads, Facebook
    //     // which are fired directly in the pageview
    //     cmp.waitForFirstCmpDecision().then(() => {
    //         startTracking();
    //     });
    // }
};

run();
