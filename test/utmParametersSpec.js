var utm = require('../src/gtm/campaign/utm');

describe('Parsing UTM parameters', function () {
    describe('When either of utm_medium or gclid is set', function () {
        it('campaign, medium and source should be parsed correctly', function () {
            var params = utm.getParameters('?utm_medium=medium&utm_source=source&utm_campaign=campaign');

            expect(params).to.deep.equal({
                medium: 'medium',
                source: 'source',
                campaign: 'campaign',
            });
        });

        it('gclid overrides utm_medium, its value is not used', function () {
            var params = utm.getParameters('?gclid=123&utm_medium=medium&utm_source=source&utm_campaign=campaign');

            expect(params).to.deep.equal({
                medium: 'gclid',
                source: 'source',
                campaign: 'campaign',
            });
        });
    });

    describe('When utm_medium and gclid are both missing', function () {
        it('should be recognized as direct traffic', function () {
            var params = utm.getParameters('?utm_medium=&utm_source=source&utm_campaign=campaign');
            expect(params).to.deep.equal({
                medium: 'direct',
                source: 'direct',
                campaign: 'direct',
            });
        });

        it('should be recognized as direct traffic', function () {
            var params = utm.getParameters('');
            expect(params).to.deep.equal({
                medium: 'direct',
                source: 'direct',
                campaign: 'direct',
            });
        });
    });
});
