var expect = require('chai').expect;

describe('bla bla', function() {
	it('blah2', function() {
		expect(5).to.equal(5);
		expect(true).to.equal(true);
		expect(document.cookie).to.be.empty;
		expect(document.cookie).to.be.empty;
		expect(document.cookie).to.equal('');
	});

	it('blah3', function(done) {
		setTimeout(function() {
			expect(1).to.exist;
			expect(1).to.equal(1);
			done();
		}, 1000);
	});
});