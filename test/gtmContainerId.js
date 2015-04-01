var getContainerId = require('../src/gtm/getGtmContainerId');

describe('Selecting the appropritate GTM container ID', function() {

    it('localhost - empty string since it doesn\'t have any', function() {
        expect(getContainerId('localhost')).to.equal('');
    });

    it('m.autoscout24.de', function() {
        expect(getContainerId('m.autoscout24.de')).to.equal('GTM-MK57H2');
    });

    it('www.autoscout24.de', function() {
        expect(getContainerId('www.autoscout24.de')).to.equal('GTM-MK57H2');
    });

    it('autoscout24.fr', function() {
        expect(getContainerId('autoscout24.fr')).to.equal('GTM-PD93LD');
    });

    it('www.autoscout24.com', function() {
        expect(getContainerId('www.autoscout24.com')).to.equal('GTM-KWX9NX');
    });

    it('m.autoscout24.com', function() {
        expect(getContainerId('m.autoscout24.com')).to.equal('GTM-KWX9NX');
    });

    it('www.autoscout24.pl', function() {
        expect(getContainerId('www.autoscout24.pl')).to.equal('GTM-KWX9NX');
    });

    it('m.autoscout24.pl', function() {
        expect(getContainerId('m.autoscout24.pl')).to.equal('GTM-KWX9NX');
    });

});