var cookies = require('./customCookie');
var isValidDate = require('amp-is-date');

var utm = require('./utm');
var tld = require('../../tld');

var cAge = 90;
var oneDay = 24 * 60 * 60 * 1000;

function readCookie(name) {
    // format of the cookie:
    // timeStamp(no separator here)firstVisit#lastPaidCampaign#currentVisit
    // cookieDate(0-13)medium,source,campaign,timestamp#medium,source,campaign,timestamp#medium,source,campaign,timestamp

    var now = +new Date();

    var cookie = {
        name: name,
        date: new Date(0),
        content: [],

        firstVisit: null,
        currentVisit: null,
        lastPaidVisit: null,

        isValid: function() {
            return isValidDate(this.date) && this.content && this.content.length === 3;
        },
        getGtmData: function() {
            var ret = {};
            ret.campaign_directMedium = this.currentVisit[0];
            ret.campaign_directSource = this.currentVisit[1];
            ret.campaign_directCampaign = this.currentVisit[2];

            if (this.lastPaidVisit && this.lastPaidVisit[3] > now - cAge * oneDay) {
                ret.campaign_lastPaidMedium = this.lastPaidVisit[0];
                ret.campaign_lastPaidSource = this.lastPaidVisit[1];
                ret.campaign_lastPaidCampaign = this.lastPaidVisit[2];
            }

            return ret;
        },

        updateCurrentVisit: function() {
            var utmParams = utm.getParameters(location.search);
            this.currentVisit = [utmParams.medium, utmParams.source, utmParams.campaign, now];
            this.firstVisit = this.firstVisit || this.currentVisit;

            if (utm.isPaidChannel(utmParams.medium)) {
                this.lastPaidVisit = this.currentVisit;
            }

            this.content = [this.firstVisit, this.lastPaidVisit, this.currentVisit];
        }
    };

    try {
        var rawValue = cookies.get(name);

        if (!rawValue) {
            return cookie;
        }

        var date = new Date(+rawValue.substring(0, 13));

        if (!isValidDate(date)) {
            return cookie;
        }

        cookie.date = date;

        var content = rawValue
            .substring(13)
            .split('#')
            .map(function (part) {
                if (!part){
                    return null;
                }

                var parts = part.split(',');
                parts[3] = parts[3] && parseInt(parts[3], 10);
                return parts;
            });

        if (!content || content.length !== 3) {
            content = [];
        }

        cookie.firstVisit = content[0];
        cookie.lastPaidVisit = content[1];
        cookie.currentVisit = content[2];

        cookie.content = content;

        return cookie;

    } catch(ex) {
        return cookie;
    }
}

function writeCookie(cookie) {
    var now = +new Date();
    var domain = '.' + location.hostname.split('.').slice(-2).join('.');

    var formattedValue = now + '' + cookie.content.slice(0,3).join('#');
    var options = {
        expires: cAge * 24 * 60 * 60,
        path: '/',
        domain: location.hostname.indexOf('localhost') >= 0 ? '' : domain
    };

    cookies.set(cookie.name, formattedValue, options);
}

module.exports = {
    read: readCookie,
    write: writeCookie
};