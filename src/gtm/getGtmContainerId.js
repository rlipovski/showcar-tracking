var containerIdsByTld = {
    de: 'GTM-MK57H2',
    at: 'GTM-WBZ87G',
    be: 'GTM-5BWB2M',
    lu: 'GTM-NDBDCZ',
    es: 'GTM-PS6QHN',
    fr: 'GTM-PD93LD',
    it: 'GTM-WTCSNR',
    nl: 'GTM-TW48BJ',
    com: 'GTM-KWX9NX',
};

var isIdentityPage = function (hostname) {
    return hostname === "accounts.autoscout24.com";
};

var extractTldFromRedirectUrl = function (url) {
    // search for ui_locales=xx in URL
    var regexp = new RegExp(/ui_locales=([a-z]+)/g);
    var matches = window.location.href.match(regexp);
    var tld = 'com';

    if (matches) {
        var match = matches.join(''); // i.e. ui_locales=de
        tld = match.split('=')[1];
    }

    return tld;
};

module.exports = function (hostname) {
    var tld = isIdentityPage(hostname) ? extractTldFromRedirectUrl(window.location.href) : hostname.split('.').pop();
    return containerIdsByTld[tld] || containerIdsByTld['com'];
};
