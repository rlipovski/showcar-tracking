var pagename = JSON.parse(document.body.getAttribute('data-pagename') || '{}');
/*
pagename.toString = function(pagenameFormat) {
    var pn = format(pagenameFormat, pagename);

    console.log(pn);

    return '/todo/todo/todo/todo#todo';
};
*/
module.exports = pagename;
