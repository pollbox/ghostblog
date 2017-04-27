var config = require('../../config');

function getAuthorUrl(data, absolute) {
    var context = data.context ? data.context[0] : null;

    context = context === 'amp'||context === 'mip' ? 'post' : context;

    if (data.author) {
        return config.urlFor('author', {author: data.author}, absolute);
    }
    if (data[context] && data[context].author) {
        return config.urlFor('author', {author: data[context].author}, absolute);
    }
    return null;
}

module.exports = getAuthorUrl;
