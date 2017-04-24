// # Weibo URL Helper
// Usage: `{{weibo_url}}` or `{{weibo_url author.weibo}}`
//
// Output a url for a twitter username
//
// We use the name facebook_url to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var socialUrls = require('../utils/social-urls'),
    findKey    = require('./utils').findKey,
    weibo_url;

weibo_url = function (username, options) {
    if (!options) {
        options = username;
        username = findKey('facebook', this, options.data.blog);
    }

    if (username) {
        return socialUrls.weiboUrl(username);
    }

    return null;
};

module.exports = weibo_url;
