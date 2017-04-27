var path                = require('path'),
    express             = require('express'),
    _                   = require('lodash'),
    mipRouter           = express.Router(),

    // Dirty requires
    config              = require('../../../config'),
    errors              = require('../../../errors'),
    templates           = require('../../../controllers/frontend/templates'),
    postLookup          = require('../../../controllers/frontend/post-lookup'),
    setResponseContext  = require('../../../controllers/frontend/context');

function controller(req, res, next) {
    var defaultView = path.resolve(__dirname, 'views', 'mip.hbs'),
        paths = templates.getActiveThemePaths(req.app.get('activeTheme')),
        data = req.body;

    if (res.error) {
        data.error = res.error;
    }

    setResponseContext(req, res, data);

    // we have to check the context. Our context must be ['post', 'mip'], otherwise we won't render the template
    if (_.includes(res.locals.context, 'post') && _.includes(res.locals.context, 'mip')) {
        if (paths.hasOwnProperty('mip.hbs')) {
            return res.render('mip', data);
        } else {
            return res.render(defaultView, data);
        }
    } else {
        return next();
    }
}

function getPostData(req, res, next) {
    postLookup(res.locals.relativeUrl)
        .then(function (result) {
            if (result && result.post) {
                req.body.post = result.post;
            }

            next();
        })
        .catch(function (err) {
            next(err);
        });
}

function checkIfMIPIsEnabled(req, res, next) {
    var mipIsEnabled = config.theme.mip;

    if (mipIsEnabled) {
        return next();
    }

    // CASE: we don't support mip pages for static pages
    if (req.body.post && req.body.post.page) {
        return errors.error404(req, res, next);
    }

    /**
     * CASE: mip is disabled, we serve 404
     *
     * Alternatively we could redirect to the original post, as the user can enable/disable MIP every time.
     *
     * If we would call `next()`, express jumps to the frontend controller (server/controllers/frontend/index.js fn single)
     * and tries to lookup the post (again) and checks whether the post url equals the requested url (post.url !== req.path).
     * This check would fail if the blog is setup on a subdirectory.
     */
    errors.error404(req, res, next);
}

// MIP frontend route
mipRouter.route('/')
    .get(
        getPostData,
        checkIfMIPIsEnabled,
        controller
    );

module.exports = mipRouter;
module.exports.controller = controller;
module.exports.getPostData = getPostData;
module.exports.checkIfMIPIsEnabled = checkIfMIPIsEnabled;
