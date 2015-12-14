var as24tracking = Object.assign(Object.create(HTMLElement.prototype), {

    el: null,
    supportedActions: ['set', 'click', 'pageview'],
    supportedTypes: ['gtm'],

    createdCallback () {
        this.el = $(this);
    },

    getAdditionalProperties() {

    }

});


document.registerElement('as24-tracking', {
    prototype: as24tracking
});
