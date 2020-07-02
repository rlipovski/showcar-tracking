var merge = require('amp-merge');

var gtm = require('./googletagmanager');
var containerId = require('./getGtmContainerId')(location.hostname);
var viewport = require('./viewport');

var pagename;

function setPagename(pn) {
    pagename = pn;
}

function generateCommonParams(data) {
    var mergedPagename = merge({}, pagename, data);

    if (
        !mergedPagename ||
        !mergedPagename.country ||
        !mergedPagename.market ||
        !mergedPagename.category ||
        !mergedPagename.pageid ||
        !mergedPagename.environment
    ) {
        if (mergedPagename.environment !== 'test' || mergedPagename.environment !== 'live') {
            throw new Error('Invalid environment type, ' + JSON.stringify(mergedPagename));
        }
        throw new Error('Incorrect pagename, ' + JSON.stringify(mergedPagename));
    }

    var commonPageName = [
        mergedPagename.country,
        mergedPagename.market,
        mergedPagename.category,
        mergedPagename.group,
        mergedPagename.pageid,
    ]
        .filter(function (x) {
            return x;
        })
        .join('/');

    if (mergedPagename.layer) {
        commonPageName += '|' + mergedPagename.layer;
    }

    var commonData = {
        common_country: mergedPagename.country,
        common_market: mergedPagename.market,
        common_category: mergedPagename.category,
        common_pageid: mergedPagename.pageid,
        common_pageName: commonPageName,
        common_environment: mergedPagename.environment,

        common_language: mergedPagename.language || '',
        common_group: mergedPagename.group || '',
        common_layer: mergedPagename.layer || '',
        common_attribute: mergedPagename.attribute || '',

        common_linkgroup: mergedPagename.linkgroup || '',
        common_linkid: mergedPagename.linkid || '',

        common_techState: mergedPagename.techState || '',
    };

    return commonData;
}

function trackClick(params) {
    if (params.eventcategory && params.eventaction) {
        gtm.push({
            event: 'event_trigger',
            event_category: params.eventcategory,
            event_action: params.eventaction,
            event_label: params.eventlabel || '',
            event_non_interaction: false,
        });
    } else {
        //DEPRECATED
        gtm.push(generateCommonParams(params));
        gtm.push({
            event: 'click',
        });
    }
}

var firstPageview = true;

function trackPageview(data) {
    if (firstPageview) {
        gtm.push(viewport);
    }

    gtm.push(generateCommonParams(data));

    setTimeout(function () {
        if (firstPageview) {
            if (window.location.href.indexOf('__cmp') >= 0) {
                gtm.loadContainerOnlyWidthConsent(containerId);
            } else {
                gtm.loadContainer(containerId);
            }            

            gtm.push({
                event: 'common_data_ready',
            });
            gtm.push({
                event: 'data_ready',
            });
            firstPageview = false;
        } else {
            gtm.push({
                event: 'pageview',
            });
        }
    }, 10);
}

module.exports = {
    setPagename: setPagename,
    trackClick: trackClick,

    set: gtm.push,
    pageview: trackPageview,
    click: trackClick,
};
