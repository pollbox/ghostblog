// # Mip Components Helper
// Usage: `{{mip_components}}`
//
// Reads through the MIP HTML and adds neccessary scripts
// for each extended component
// If more components need to be added, we can add more scripts.
// Here's the list of all supported extended components: https://www.mipengine.org/doc/00-mip-101.html
// By default supported MIP HTML tags (no additional script tag necessary):
// mip-img, mip-ad, mip-embed, mip-video and mip-pixel.
var hbs             = require('express-hbs');

function mipComponents() {
    var components = [],
        html = this.post.html || this.html;

    if (!html) {
        return;
    }

    if (html.indexOf('.gif') !== -1) {
        components.push('<script async custom-element="mip-anim" src="https://mipcache.bdstatic.com/static/v1/mip-anim/mip-anim.js"></script>');
    }


    if (html.indexOf('<audio') !== -1) {
        components.push('<script async custom-element="mip-audio" src="https://mipcache.bdstatic.com/static/v1/mip-audio/mip-audio.js"></script>');
    }

    return new hbs.handlebars.SafeString(components.join('\n'));
}

module.exports = mipComponents;
