var mipContentHelper   = require('./mip_content'),
    mipComponentsHelper = require('./mip_components'),
    registerAsyncThemeHelper = require('../../../../helpers').registerAsyncThemeHelper,
    ghostHead = require('../../../../helpers/ghost_head'),
    registerMipHelpers;

registerMipHelpers = function (ghost) {
    ghost.helpers.registerAsync('mip_content', mipContentHelper);

    ghost.helpers.register('mip_components', mipComponentsHelper);

    // we use the {{ghost_head}} helper, but call it {{mip_ghost_head}}, so it's consistent
    registerAsyncThemeHelper('mip_ghost_head', ghostHead);
};

module.exports = registerMipHelpers;
