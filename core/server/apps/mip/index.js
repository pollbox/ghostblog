var router           = require('./lib/router'),
    registerMipHelpers  = require('./lib/helpers'),

    // Dirty requires
    config     = require('../../config');

module.exports = {
    activate: function activate(ghost) {
        registerMipHelpers(ghost);
    },

    setupRoutes: function setupRoutes(blogRouter) {
        blogRouter.use('*/' + config.routeKeywords.mip + '/', router);
    }
};
