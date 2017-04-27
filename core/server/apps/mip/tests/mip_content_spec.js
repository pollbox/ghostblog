var should         = require('should'),
    rewire         = require('rewire'),
    configUtils    = require('../../../../test/utils/configUtils'),

// Stuff we are testing
    mipContentHelper    = rewire('../lib/helpers/mip_content');

// TODO: Miperize really needs to get stubbed, so we can test returning errors
// properly and make this test faster!
describe('{{mip_content}} helper', function () {
    afterEach(function () {
        mipContentHelper.__set__('miperizeCache', {});
    });

    it('can render content', function (done) {
        var testData = {
                html: 'Hello World',
                updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                id: 1
            },
            mipResult = mipContentHelper.call(testData);

        mipResult.then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.equal(testData.html);
            done();
        }).catch(done);
    });

    it('returns if no html is provided', function (done) {
        var testData = {
                updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                id: 1
            },
            mipResult = mipContentHelper.call(testData);

        mipResult.then(function (rendered) {
            should.exist(rendered);
            rendered.string.should.be.equal('');
            done();
        }).catch(done);
    });

    describe('Cache', function () {
        it('can render content from cache', function (done) {
            var testData = {
                    html: 'Hello World',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                mipCachedResult,
                mipResult = mipContentHelper.call(testData),
                miperizeCache = mipContentHelper.__get__('miperizeCache');

            mipResult.then(function (rendered) {
                should.exist(rendered);
                should.exist(miperizeCache);
                rendered.string.should.equal(testData.html);
                miperizeCache[1].should.have.property('updated_at', 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)');
                miperizeCache[1].should.have.property('mip', testData.html);
                // call it again, to make it fetch from cache
                mipCachedResult = mipContentHelper.call(testData);
                mipCachedResult.then(function (rendered) {
                    should.exist(rendered);
                    should.exist(miperizeCache);
                    miperizeCache[1].should.have.property('updated_at', 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)');
                    miperizeCache[1].should.have.property('mip', testData.html);
                    done();
                });
            }).catch(done);
        });

        it('fetches new MIP HTML if post was changed', function (done) {
            var testData1 = {
                    html: 'Hello World',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                testData2 = {
                        html: 'Hello Ghost',
                        updated_at: 'Wed Jul 30 2016 18:17:22 GMT+0200 (CEST)',
                        id: 1
                    },
                mipResult = mipContentHelper.call(testData1),
                miperizeCache = mipContentHelper.__get__('miperizeCache');

            mipResult.then(function (rendered) {
                should.exist(rendered);
                should.exist(miperizeCache);
                rendered.string.should.equal(testData1.html);
                miperizeCache[1].should.have.property('updated_at', 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)');
                miperizeCache[1].should.have.property('mip', testData1.html);

                // call it again with different values to fetch from Miperize and not from cache
                mipResult = mipContentHelper.call(testData2);
                mipResult.then(function (rendered) {
                    should.exist(rendered);
                    should.exist(miperizeCache);

                    // it should not have the old value,
                    miperizeCache[1].should.not.have.property('Wed Jul 30 2016 18:17:22 GMT+0200 (CEST)');
                    // only the new one
                    rendered.string.should.equal(testData2.html);
                    miperizeCache[1].should.have.property('updated_at', 'Wed Jul 30 2016 18:17:22 GMT+0200 (CEST)');
                    miperizeCache[1].should.have.property('mip', testData2.html);
                    done();
                });
            }).catch(done);
        });
    });

    describe('Transforms and sanitizes HTML', function () {
        beforeEach(function () {
            configUtils.set({url: 'https://blog.ghost.org/'});
        });

        afterEach(function () {
            mipContentHelper.__set__('miperizeCache', {});
            configUtils.restore();
        });

        it('can transform img tags to mip-img', function (done) {
            var testData = {
                    html: '<img src="/content/images/2016/08/scheduled2-1.jpg" alt="The Ghost Logo" />',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                expectedResult = '<mip-img src="https://blog.ghost.org/content/images/2016/08/scheduled2-1.jpg" alt="The Ghost Logo" width="1000" height="281" layout="responsive"></mip-img>',
                mipResult = mipContentHelper.call(testData);

            mipResult.then(function (rendered) {
                should.exist(rendered);
                rendered.string.should.equal(expectedResult);
                done();
            }).catch(done);
        });

        it('can transform audio tags to mip-audio', function (done) {
            var testData = {
                    html: '<audio controls="controls" width="auto" height="50" autoplay="mobile">Your browser does not support the <code>audio</code> element.<source src="https://audio.com/foo.wav" type="audio/wav"></audio>' +
                            '<audio src="http://audio.com/foo.ogg"><track kind="captions" src="http://audio.com/foo.en.vtt" srclang="en" label="English"><source kind="captions" src="http://audio.com/foo.sv.vtt" srclang="sv" label="Svenska"></audio>',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                expectedResult = '<mip-audio controls="controls" width="auto" height="50" autoplay="mobile">Your browser does not support the <code>audio</code> element.<source src="https://audio.com/foo.wav" type="audio/wav" /></mip-audio>' +
                                    '<mip-audio src="https://audio.com/foo.ogg"><track kind="captions" src="https://audio.com/foo.en.vtt" srclang="en" label="English" /><source kind="captions" src="https://audio.com/foo.sv.vtt" srclang="sv" label="Svenska" /></mip-audio>',
                mipResult = mipContentHelper.call(testData);

            mipResult.then(function (rendered) {
                should.exist(rendered);
                rendered.string.should.equal(expectedResult);
                done();
            }).catch(done);
        });

        it('removes video tags including source children', function (done) {
            var testData = {
                    html: '<video width="480" controls poster="https://archive.org/download/WebmVp8Vorbis/webmvp8.gif" >' +
                            '<track kind="captions" src="https://archive.org/download/WebmVp8Vorbis/webmvp8.webm" srclang="en">' +
                            '<source src="https://archive.org/download/WebmVp8Vorbis/webmvp8.webm" type="video/webm">' +
                            '<source src="https://archive.org/download/WebmVp8Vorbis/webmvp8_512kb.mp4" type="video/mp4">' +
                            'Your browser doesn\'t support HTML5 video tag.' +
                            '</video>',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                expectedResult = 'Your browser doesn\'t support HTML5 video tag.',
                mipResult = mipContentHelper.call(testData);

            mipResult.then(function (rendered) {
                should.exist(rendered);
                rendered.string.should.equal(expectedResult);
                done();
            }).catch(done);
        });

        it('removes inline style', function (done) {
            var testData = {
                    html: '<mip-img src="/content/images/2016/08/aileen_small.jpg" style="border-radius: 50%"; !important' +
                          'border="0" align="center" font="Arial" width="50" height="50" layout="responsive"></mip-img>' +
                          '<p align="right" style="color: red; !important" bgcolor="white">Hello</p>' +
                          '<table style="width:100%"><tr bgcolor="tomato" colspan="2"><th font="Arial">Name:</th> ' +
                          '<td color="white" colspan="2">Bill Gates</td></tr><tr><th rowspan="2" valign="center">Telephone:</th> ' +
                          '<td>55577854</td></tr></table>',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                expectedResult = '<mip-img src="https://blog.ghost.org/content/images/2016/08/aileen_small.jpg" width="50" ' +
                                 'height="50" layout="responsive"></mip-img><p align="right">Hello</p>' +
                                 '<table><tr bgcolor="tomato"><th>Name:</th> ' +
                                 '<td colspan="2">Bill Gates</td></tr><tr><th rowspan="2" valign="center">Telephone:</th> ' +
                                 '<td>55577854</td></tr></table>',
                mipResult = mipContentHelper.call(testData);

            mipResult.then(function (rendered) {
                should.exist(rendered);
                rendered.string.should.equal(expectedResult);
                done();
            }).catch(done);
        });

        it('removes prohibited iframe attributes', function (done) {
            var testData = {
                    html: '<iframe src="https://player.vimeo.com/video/180069681?color=ffffff" width="640" height="267" frameborder="0" ' +
                            'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                expectedResult = '<mip-iframe src="https://player.vimeo.com/video/180069681?color=ffffff" width="640" height="267" ' +
                                    'frameborder="0" allowfullscreen sandbox="allow-script allow-same-origin" layout="responsive"></mip-iframe>',
                mipResult = mipContentHelper.call(testData);

            mipResult.then(function (rendered) {
                should.exist(rendered);
                rendered.string.should.equal(expectedResult);
                done();
            }).catch(done);
        });

        it('can handle incomplete HTML tags by returning not Miperized HTML', function (done) {
            var testData = {
                    html: '<img><///img>',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                mipResult = mipContentHelper.call(testData),
                sanitizedHTML,
                mipedHTML;

            mipResult.then(function (rendered) {
                sanitizedHTML = mipContentHelper.__get__('cleanHTML');
                mipedHTML = mipContentHelper.__get__('mipHTML');
                should.exist(rendered);
                rendered.string.should.equal('');
                should.exist(mipedHTML);
                mipedHTML.should.be.equal('<img>');
                should.exist(sanitizedHTML);
                sanitizedHTML.should.be.equal('');
                done();
            }).catch(done);
        });

        it('can handle not existing img src by returning not Miperized HTML', function (done) {
            var testData = {
                    html: '<img src="/content/images/does-not-exist.jpg" alt="The Ghost Logo" />',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                mipResult = mipContentHelper.call(testData),
                sanitizedHTML,
                mipedHTML;

            mipResult.then(function (rendered) {
                sanitizedHTML = mipContentHelper.__get__('cleanHTML');
                mipedHTML = mipContentHelper.__get__('mipHTML');
                should.exist(rendered);
                rendered.string.should.equal('');
                should.exist(mipedHTML);
                mipedHTML.should.be.equal('<img src="https://blog.ghost.org/content/images/does-not-exist.jpg" alt="The Ghost Logo">');
                should.exist(sanitizedHTML);
                sanitizedHTML.should.be.equal('');
                done();
            }).catch(done);
        });

        it('sanitizes remaining and not valid tags', function (done) {
            var testData = {
                    html: '<form<input type="text" placeholder="Hi MIP tester"></form>' +
                            '<script>some script here</script>' +
                            '<style> h1 {color:red;} p {color:blue;}</style>',
                    updated_at: 'Wed Jul 27 2016 18:17:22 GMT+0200 (CEST)',
                    id: 1
                },
                mipResult = mipContentHelper.call(testData);

            mipResult.then(function (rendered) {
                should.exist(rendered);
                rendered.string.should.be.equal('');
                done();
            }).catch(done);
        });
    });
});
