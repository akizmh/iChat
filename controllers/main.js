/**
 *
 * @author fuyun
 * @since 2017/08/14
 */
const appConfig = require('../config/core');

module.exports = {
    welcome: function (req, res) {
        res.render(`${appConfig.pathViews}/web/pages/index`, {});
    }
};
