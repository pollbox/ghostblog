var config = require('../../config'),
    getUrl = require('./url');

function getCanonicalUrl(data) {
    var url = config.urlJoin(config.getBaseUrl(false),
        getUrl(data, false));

    if (url.indexOf('/amp/')) {
        url = url.replace(/\/amp\/$/i, '/');
    }else if (url.indexOf('/mip/')) {
        url = url.replace(/\/mip\/$/i, '/');
    }
    return url;
}

module.exports = getCanonicalUrl;
