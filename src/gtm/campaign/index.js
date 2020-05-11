var gtm = require('../googletagmanager');
var cookieHandler = require('./cookie');

function updateCampaignCookie() {
    var cookiename = 'cmpatt';
    var campaignCookie = cookieHandler.read(cookiename);
    campaignCookie.updateCurrentVisit();
    gtm.push(campaignCookie.getGtmData());
    cookieHandler.write(campaignCookie);
}

module.exports = {
    updateCampaignCookie: updateCampaignCookie,
};
