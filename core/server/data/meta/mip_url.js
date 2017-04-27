var config = require('../../config'),
    getUrl = require('./url'),
    _      = require('lodash');

function getMiplUrl(data) {
    var context = data.context ? data.context : null;

    if (_.includes(context, 'post') && !_.includes(context, 'mip')) {
        return config.urlJoin(config.getBaseUrl(false),
            getUrl(data, false)) + 'mip/';
    }
    return null;
}

module.exports = getMiplUrl;
