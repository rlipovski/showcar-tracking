var cookies = require('cookies-js');

var expect = chai.expect;
var sinon = window.sinon;

var gtm = require('../src/gtm');
var utm = require('../src/gtm/campaign/utm');
var campaign = require('../src/gtm/campaign');
var campaignCookieHandler = require('../src/gtm/campaign/cookie');
var cookieName = 'cmpatt';

function deleteCampaignCookie() {
    cookies.expire(cookieName, { path: '/' });
}

describe('Campaign cookie:', function () {
    afterEach(function () {
        deleteCampaignCookie();
    });

    describe('When cookie is set', function () {
        it('the value must be read correctly', function () {
            cookies.set(
                cookieName,
                '1421317609216direct,direct,direct,1413537172486#direct,direct,direct,1413815400872#direct,direct,direct,1421313800634'
            );

            var cookie = campaignCookieHandler.read(cookieName);
            expect(+cookie.date).to.equal(1421317609216);

            expect(cookie.content).to.deep.equal([
                ['direct', 'direct', 'direct', 1413537172486],
                ['direct', 'direct', 'direct', 1413815400872],
                ['direct', 'direct', 'direct', 1421313800634],
            ]);
        });
    });

    describe('First visit to the site', function () {
        var utmMock;
        var clock;
        beforeEach(function () {
            clock = sinon.useFakeTimers();
            clock.tick(1421679155521);
            utmMock = sinon.mock(utm);
            window.dataLayer.length = 0;
        });

        afterEach(function () {
            clock.restore();
            utmMock.restore();
        });

        describe('coming directly to the site', function () {
            it('should set an appropritate cookie and GTM data when coming directly', function () {
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521direct,direct,direct,1421679155521##direct,direct,direct,1421679155521'
                );
                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'direct',
                    campaign_directSource: 'direct',
                    campaign_directCampaign: 'direct',
                });
            });
        });

        describe('coming through a non-paid campaign', function () {
            it('should set an appropritate cookie and GTM data when coming from a not paid campaign', function () {
                // URL: http://www.autoscout24.de/?utm_medium=medium&utm_source=source&utm_campaign=campaign
                utmMock.expects('getParameters').returns({ source: 'source', medium: 'medium', campaign: 'campaign' });
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521medium,source,campaign,1421679155521##medium,source,campaign,1421679155521'
                );
                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'medium',
                    campaign_directSource: 'source',
                    campaign_directCampaign: 'campaign',
                });
            });
        });

        describe('coming through a paid campaign', function () {
            it('should set an appropritate cookie and GTM data when coming from a paid campaign', function () {
                utmMock.expects('getParameters').returns({ source: 'source', medium: 'aff', campaign: 'campaign' });
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521aff,source,campaign,1421679155521#aff,source,campaign,1421679155521#aff,source,campaign,1421679155521'
                );
                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'aff',
                    campaign_directSource: 'source',
                    campaign_directCampaign: 'campaign',

                    campaign_lastPaidMedium: 'aff',
                    campaign_lastPaidSource: 'source',
                    campaign_lastPaidCampaign: 'campaign',
                });
            });
        });

        describe('gclid parameter is set', function () {
            it('should be treated as utm_medium', function () {
                utmMock.expects('getParameters').returns({ source: 'source', medium: 'gclid', campaign: 'campaign' });
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521gclid,source,campaign,1421679155521#gclid,source,campaign,1421679155521#gclid,source,campaign,1421679155521'
                );
            });
        });
    });

    describe('Subsequent visit (the campaign cookie was already set)', function () {
        var utmMock;
        var clock;
        beforeEach(function () {
            clock = sinon.useFakeTimers();
            clock.tick(1421679155521);
            deleteCampaignCookie();
            utmMock = sinon.mock(utm);
            window.dataLayer.length = 0;
        });

        afterEach(function () {
            clock.restore();
            utmMock.restore();
        });

        describe('First and second visits through direct', function () {
            it('should set the correct cookie', function () {
                cookies.set(
                    cookieName,
                    '1421317609216direct,direct,direct,1413537172486##direct,direct,direct,1421313800634'
                );
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521direct,direct,direct,1413537172486##direct,direct,direct,1421679155521'
                );

                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'direct',
                    campaign_directSource: 'direct',
                    campaign_directCampaign: 'direct',
                });
            });
        });

        describe('First visit through paid campaign and second visits through direct', function () {
            it('should set the correct cookie', function () {
                cookies.set(
                    cookieName,
                    '1421679155520aff,source,campaign,1421679155520#aff,source,campaign,1421679155520#aff,source,campaign,1421679155520'
                );
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521aff,source,campaign,1421679155520#aff,source,campaign,1421679155520#direct,direct,direct,1421679155521'
                );

                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'direct',
                    campaign_directSource: 'direct',
                    campaign_directCampaign: 'direct',

                    campaign_lastPaidMedium: 'aff',
                    campaign_lastPaidSource: 'source',
                    campaign_lastPaidCampaign: 'campaign',
                });
            });
        });

        describe('First visit through direct and second visits through paid campaign', function () {
            it('should set the correct cookie', function () {
                cookies.set(
                    cookieName,
                    '1421679155520direct,direct,direct,1421679155520##direct,direct,direct,1421679155520'
                );
                utmMock.expects('getParameters').returns({ source: 'source', medium: 'aff', campaign: 'campaign' });
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521direct,direct,direct,1421679155520#aff,source,campaign,1421679155521#aff,source,campaign,1421679155521'
                );

                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'aff',
                    campaign_directSource: 'source',
                    campaign_directCampaign: 'campaign',

                    campaign_lastPaidMedium: 'aff',
                    campaign_lastPaidSource: 'source',
                    campaign_lastPaidCampaign: 'campaign',
                });
            });
        });

        describe('First visit through paid campain then through direct', function () {
            it('second visit after 30 minutes of inactivity', function () {
                cookies.set(
                    cookieName,
                    '1221679155520cpc,source,campaign,1221679155520#cpc,source,campaign,1221679155520#cpc,source,campaign,1221679155520'
                );
                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521cpc,source,campaign,1221679155520#cpc,source,campaign,1221679155520#direct,direct,direct,1421679155521'
                );
                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'direct',
                    campaign_directSource: 'direct',
                    campaign_directCampaign: 'direct',
                });
            });
        });

        describe('First visit through paid campaign and second visits through non-paid campaign', function () {
            it('should set the correct cookie', function () {
                cookies.set(
                    cookieName,
                    '1421679155520aff,source,campaign,1421679155520#aff,source,campaign,1421679155520#aff,source,campaign,1421679155520'
                );
                utmMock.expects('getParameters').returns({ source: 'source', medium: 'medium', campaign: 'campaign' });

                campaign.updateCampaignCookie();
                var cookieValue = cookies.get(cookieName);
                expect(cookieValue).to.equal(
                    '1421679155521aff,source,campaign,1421679155520#aff,source,campaign,1421679155520#medium,source,campaign,1421679155521'
                );

                expect(window.dataLayer).to.contain({
                    campaign_directMedium: 'medium',
                    campaign_directSource: 'source',
                    campaign_directCampaign: 'campaign',

                    campaign_lastPaidMedium: 'aff',
                    campaign_lastPaidSource: 'source',
                    campaign_lastPaidCampaign: 'campaign',
                });
            });
        });
    });
});
