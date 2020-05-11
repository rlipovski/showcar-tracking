var qs = require('querystring');
var indexOf = require('amp-index-of');

module.exports = {
    getParameters: function (locationSearch) {
        var queryParams = qs.parse(locationSearch.replace('?', '')) || {};
        var utm = {
            medium: queryParams.gclid ? 'gclid' : queryParams.utm_medium || '',

            source: queryParams.utm_source || '',

            campaign: queryParams.utm_campaign || '',
        };

        if (!utm.medium) {
            utm.medium = 'direct';
            utm.source = 'direct';
            utm.campaign = 'direct';
        }

        return utm;
    },

    isPaidChannel: function (medium) {
        var paidChannels = ['aff', 'co', 'med', 'email', 'ret', 'cpc', 'print', 'gclid'];
        return !!(medium && indexOf(paidChannels, medium) >= 0);
    },
};
