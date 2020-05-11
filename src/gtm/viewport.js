var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || screen.width);

module.exports = {
    session_viewport: viewportWidth >= 994 ? 'l' : viewportWidth >= 768 ? 'm' : viewportWidth >= 480 ? 's' : 'xs',
};
