var as24tracking = Object.assign(Object.create(HTMLElement.prototype), {

    dev: true,
    el: null,
    supportedActions: ['set', 'click', 'pageview'],
    supportedTypes: ['gtm', 'pagename'],
    reservedWords: ['as24-tracking-id', 'type', 'action', 'as24-tracking-value'],

    createdCallback () {
        this.el = $(this);
        var values = this.getAdditionalProperties();

        var type = this.el.attr('type');
        var action = this.el.attr('action');

        var args = [type, action, values];
        if (type === 'pagename') {
            args.slice(1, 1);
        }

        if (!this.dev) {
            ut.push(...args);
        }
    },

    getAdditionalProperties() {
        var values = JSON.parse(this.el.attr('as24-tracking-value')) || {};
        values = Array.from(this.el[0].attributes)
            .filter((element) => !(this.reservedWords.indexOf(element.nodeName) > -1))
            .reduce((prev, curr) => {
                prev[curr.nodeName] = curr.nodeValue;
                return prev;
            }, values);
        return values;
    }

});


document.registerElement('as24-tracking', {
    prototype: as24tracking
});
