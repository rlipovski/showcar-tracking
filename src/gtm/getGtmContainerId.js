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

module.exports = function (hostname) {
    var tld = hostname.split('.').pop();
    return containerIdsByTld[tld] || containerIdsByTld['com'];
};
