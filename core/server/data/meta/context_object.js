var config = require('../../config'),
    _      = require('lodash');

function getContextObject(data, context) {
    var blog = config.theme,
        contextObject;

    context = _.includes(context, 'page') || _.includes(context, 'amp')|| _.includes(context, 'mip') ? 'post' : context;
    contextObject = data[context] || blog;
    return contextObject;
}

module.exports = getContextObject;
