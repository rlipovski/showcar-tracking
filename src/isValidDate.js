module.exports = function (date) {
    return Object.prototype.toString.call(date) === '[object Date]' && date.getTime && !isNaN(date.getTime());
};