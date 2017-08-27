/* jslint nomen:true es5:true */
/* global console,process,__dirname */
/**
 * 路由定义，含错误路由
 * @module cfg_routes
 * @param {Object} app express实例
 * @param {Object} express express对象
 * @return {void}
 * @author Fuyun
 * @version 1.0.0
 * @since 1.0.0
 */
const path = require('path');
const base = require('./routes-base');
const main = require('../controllers/main');

module.exports = function (app, express) {
    const {ENV: env} = process.env;

    // 静态文件(若先路由后静态文件，将导致session丢失)
    app.use(express.static(path.join(__dirname, '..', 'public', 'static')));
    app.use(express.static(path.join(__dirname, '..', 'public', env && env.trim() === 'production' ? 'dist' : 'dev')));

    app.use(base.init);
    app.get('/', main.welcome);

    // 错误路由
    app.use(base.error);
};
