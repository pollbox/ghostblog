var should         = require('should'),

// Stuff we are testing
    mipComponentsHelper    = require('../lib/helpers/mip_components');

describe('{{mip_components}} helper', function () {
    it('adds script tag for a gif', function () {
        var post = {
                html: '<img src="https://media.giphy.com/media/UsmcxQeK7BRBK/giphy.gif" alt="yoda" />'
            },
            rendered;

        rendered = mipComponentsHelper.call(
            {relativeUrl: '/post/mip/', safeVersion: '0.3', context: ['mip', 'post'], post: post},
            {data: {root: {context: ['mip', 'post']}}});

        should.exist(rendered);
        rendered.should.match(/<script async custom-element="mip-anim" src="https:\/\/mipcache.bdstatic.com\/static\/v1\/mip-anim\/mip-anim.js"><\/script>/);
    });

    // it('adds script tag for an iframe tag', function () {
    //     var post = {
    //             html: '<iframe src="//giphy.com/embed/o0vwzuFwCGAFO" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'
    //         },
    //         rendered;
    //
    //     rendered = mipComponentsHelper.call(
    //         {relativeUrl: '/post/mip/', safeVersion: '0.3', context: ['mip', 'post'], post: post},
    //         {data: {root: {context: ['mip', 'post']}}});
    //
    //     should.exist(rendered);
    //
    // });

    it('adds script tag for an audio tag', function () {
        var post = {
                html: '<audio src="myaudiofile.mp3"/>'
            },
            rendered;

        rendered = mipComponentsHelper.call(
            {relativeUrl: '/post/mip/', safeVersion: '0.3', context: ['mip', 'post'], post: post},
            {data: {root: {context: ['mip', 'post']}}});

        should.exist(rendered);
        rendered.should.match(/<script async custom-element="mip-audio" src="https:\/\/mipcache.bdstatic.com\/static\/v1\/mip-audio\/mip-audio.js"><\/script>/);
    });

    it('returns if no html is provided', function () {
        var post = {},
            rendered;

        rendered = mipComponentsHelper.call(
            {relativeUrl: '/post/mip/', safeVersion: '0.3', context: ['mip', 'post'], post: post},
            {data: {root: {context: ['mip', 'post']}}});

        should.not.exist(rendered);
    });
});
