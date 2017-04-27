/*globals describe, beforeEach, afterEach, it*/
var rewire            = require('rewire'),
    mipController     = rewire('../lib/router'),
    path              = require('path'),
    sinon             = require('sinon'),
    Promise           = require('bluebird'),
    errors            = require('../../../errors'),
    should            = require('should'),
    configUtils       = require('../../../../test/utils/configUtils'),
    sandbox           = sinon.sandbox.create();

// Helper function to prevent unit tests
// from failing via timeout when they
// should just immediately fail
function failTest(done) {
    return function (err) {
        done(err);
    };
}

describe('MIP Controller', function () {
    var res,
        req,
        defaultPath,
        setResponseContextStub;

    beforeEach(function () {
        res = {
            render: sandbox.spy(),
            locals: {
                context: ['mip', 'post']
            }
        };

        req = {
            app: {get: function () { return 'casper'; }},
            route: {path: '/'},
            query: {r: ''},
            params: {},
            body: {}
        };

        defaultPath = path.join(configUtils.config.paths.appRoot, '/core/server/apps/mip/lib/views/mip.hbs');

        configUtils.set({
            theme: {
                permalinks: '/:slug/'
            }
        });
    });

    afterEach(function () {
        sandbox.restore();
        configUtils.restore();
    });

    it('should render default mip page when theme has no mip template', function (done) {
        configUtils.set({paths: {availableThemes: {casper: {}}}});

        setResponseContextStub = sandbox.stub();
        mipController.__set__('setResponseContext', setResponseContextStub);

        res.render = function (view) {
            view.should.eql(defaultPath);
            done();
        };

        mipController.controller(req, res, failTest(done));
    });

    it('should render theme mip page when theme has mip template', function (done) {
        configUtils.set({paths: {availableThemes: {casper: {
            'mip.hbs': '/content/themes/casper/mip.hbs'
        }}}});

        setResponseContextStub = sandbox.stub();
        mipController.__set__('setResponseContext', setResponseContextStub);

        res.render = function (view) {
            view.should.eql('mip');
            done();
        };

        mipController.controller(req, res, failTest(done));
    });

    it('should render with error when error is passed in', function (done) {
        configUtils.set({paths: {availableThemes: {casper: {}}}});
        res.error = 'Test Error';

        setResponseContextStub = sandbox.stub();
        mipController.__set__('setResponseContext', setResponseContextStub);

        res.render = function (view, context) {
            view.should.eql(defaultPath);
            context.should.eql({error: 'Test Error'});
            done();
        };

        mipController.controller(req, res, failTest(done));
    });

    it('does not render mip page when mip context is missing', function (done) {
        var renderSpy;
        configUtils.set({paths: {availableThemes: {casper: {}}}});

        setResponseContextStub = sandbox.stub();
        mipController.__set__('setResponseContext', setResponseContextStub);

        res.locals.context = ['post'];
        res.render = sandbox.spy(function () {
            done();
        });

        renderSpy = res.render;

        mipController.controller(req, res, failTest(done));
        renderSpy.called.should.be.false();
    });

    it('does not render mip page when context is other than mip and post', function (done) {
        var renderSpy;
        configUtils.set({paths: {availableThemes: {casper: {}}}});

        setResponseContextStub = sandbox.stub();
        mipController.__set__('setResponseContext', setResponseContextStub);

        res.locals.context = ['mip', 'page'];
        res.render = sandbox.spy(function () {
            done();
        });

        renderSpy = res.render;

        mipController.controller(req, res, failTest(done));
        renderSpy.called.should.be.false();
    });
});

describe('MIP getPostData', function () {
    var res, req, postLookupStub, next;

    beforeEach(function () {
        res = {
            locals: {
                relativeUrl: '/welcome-to-ghost/mip/'
            }
        };

        req = {
            body: {
                post: {}
            }
        };

        next = function () {};
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should successfully get the post data from slug', function (done) {
        postLookupStub = sandbox.stub();
        postLookupStub.returns(new Promise.resolve({
            post: {
                id: '1',
                slug: 'welcome-to-ghost',
                isMipURL: true
            }
        }));

        mipController.__set__('postLookup', postLookupStub);

        mipController.getPostData(req, res, function () {
            req.body.post.should.be.eql({
                    id: '1',
                    slug: 'welcome-to-ghost',
                    isMipURL: true
                }
            );
            done();
        });
    });
    it('should return error if postlookup returns NotFoundError', function (done) {
        postLookupStub = sandbox.stub();
        postLookupStub.returns(new Promise.reject(new errors.NotFoundError('not found')));

        mipController.__set__('postLookup', postLookupStub);

        mipController.getPostData(req, res, function (err) {
            should.exist(err);
            should.exist(err.message);
            should.exist(err.statusCode);
            should.exist(err.errorType);
            err.message.should.be.eql('not found');
            err.statusCode.should.be.eql(404);
            err.errorType.should.be.eql('NotFoundError');
            req.body.post.should.be.eql({});
            done();
        });
    });
    it('should return error and if postlookup returns error', function (done) {
        postLookupStub = sandbox.stub();
        postLookupStub.returns(new Promise.reject('not found'));

        mipController.__set__('postLookup', postLookupStub);

        mipController.getPostData(req, res, function (err) {
            should.exist(err);
            err.should.be.eql('not found');
            req.body.post.should.be.eql({});
            done();
        });
    });
});
