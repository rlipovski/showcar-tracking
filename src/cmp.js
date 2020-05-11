const { once } = require('./util');

const cmpDecisionLocalStorageKey = '__as24_cmp_decision__';

module.exports.loadCmpStub = () => {
    require('./liveramp-stub');
};

module.exports.loadCmp = once(() => {
    const script = document.createElement('script');
    const ref = document.getElementsByTagName('script')[0];
    ref.parentNode.insertBefore(script, ref);
    script.src = 'https://config-prod.choice.faktor.io/aee4fbca-111d-4361-9156-aa2aaf12856c/faktor.js';
});

module.exports.isCmpEnabled = () => {
    return location.href.indexOf('__cmp') >= 0;
};

module.exports.hasLocalCmpDecision = () => {
    return !!localStorage.getItem(cmpDecisionLocalStorageKey);
};

module.exports.waitForFirstCmpDecision = () => {
    return new Promise((resolve) => {
        const handler = (e) => {
            window.__cmp('consentDataExist', null, (d) => {
                if (d === true) {
                    window.__cmp('removeEventListener', 'consentChanged', handler);
                    resolve();
                }
            });
        };

        window.__cmp('addEventListener', 'consentChanged', handler);
    });
};

module.exports.updateCachedDecisionWhenItChanges = () => {
    window.__cmp('addEventListener', 'consentChanged', (e) => {
        window.__cmp('getVendorConsents', null, function (vendorConsents) {
            console.log(vendorConsents);
        });
    });
};

module.exports.updateLocalCmpDecision = () => {
    return new Promise((resolve) => {
        // todo
    });
};

module.exports.sendDecisionToDataLayer = () => {
    // todo
};
