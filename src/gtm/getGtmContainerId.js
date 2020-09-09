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
    var regexp = new RegExp(/24\.([a-z]{2,3})/g);
    var matches = url.match(regexp);

    return matches ? matches.slice(-1).join('').split('.')[1] : 'com';
};

module.exports = function (hostname) {
    var tld = isIdentityPage(hostname) ? extractTldFromRedirectUrl(window.location.href) : hostname.split('.').pop();
    return containerIdsByTld[tld] || containerIdsByTld['com'];
};
