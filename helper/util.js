/* jslint nomen:true */
/**
 * 工具类
 * @module util
 * @class Util
 * @static
 * @requires crypto
 * @author Fuyun
 * @version 2.0.0
 * @since 1.0.0
 */
const crypto = require('crypto');

module.exports = {
    createCrumb: function (crumbData, separator) {
        let crumbArr = [];
        separator = separator || '&nbsp;→&nbsp;';
        crumbData.unshift({
            'title': '首页',
            'tooltip': 'iFuyun',
            'url': '/',
            'headerFlag': false
        });
        crumbData.forEach((crumb) => {
            if (crumb.url !== '' && !crumb.headerFlag) {
                crumbArr.push('<a title="' + crumb.tooltip + '" href="' + crumb.url + '">' + crumb.title + '</a>');
            } else if (crumb.url !== '' && crumb.headerFlag) {
                crumbArr.push('<h3><a title="' + crumb.tooltip + '" href="' + crumb.url + '">' + crumb.title + '</a></h3>');
            } else {
                crumbArr.push('<span title="' + crumb.tooltip + '">' + crumb.title + '</span>');
            }
        });
        return crumbArr.join(separator);
    },
    /**
     * 截取字符串为指定长度，超过长度加'...'
     * @method cutStr
     * @static
     * @param {String} srcStr 源字符串
     * @param {Number} cutLength 指定长度
     * @return {String} 截取结果字符串
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    cutStr: function (srcStr, cutLength) {
        let resultStr;
        let i = 0;
        let n = 0;
        let curChar;

        srcStr = srcStr || '';
        srcStr = typeof srcStr === 'string' ? srcStr : '';

        while (n < cutLength && i < srcStr.length) {
            curChar = srcStr.charCodeAt(i);
            if (curChar >= 192 || (curChar >= 65 && curChar <= 90)) {// 中文和大写字母计为1个
                n += 1;
                if (n <= cutLength) {
                    i += 1;
                }
            } else {// 其余字符计为半个
                n += 0.5;
                i += 1;
            }
        }
        resultStr = srcStr.substr(0, i);
        if (srcStr.length > i) {
            resultStr += '...';
        }
        return resultStr;
    },
    /**
     * 过滤HTML标签
     * @method filterHtmlTag
     * @static
     * @param {String} srcStr 源字符串
     * @return {String} 过滤结果字符串
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    filterHtmlTag: function (srcStr) {
        return srcStr.replace(/<\/?[^>]*>/ig, '');
        // \w\s~!@#$%^&*\(\)\-=+\[\]\{\}\\\|;:'",\.\/<\?\u4E00-\uFA29
    },
    /**
     * 获取访问者IP
     * @method getRemoteIp
     * @static
     * @param {Object} req 请求对象
     * @return {String} 访问者IP
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getRemoteIp: function (req) {
        return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip ||
            req._remoteAddress || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    },
    /**
     * 获取请求类型
     * @method getHttpMethod
     * @static
     * @param {Object} req 请求对象
     * @return {String} 请求类型
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getHttpMethod: function (req) {
        return req.method;
    },
    /**
     * 获取请求URL
     * @method getUrl
     * @static
     * @param {Object} req 请求对象
     * @return {String} 请求URL
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getUrl: function (req) {
        return req.originalUrl || req.url;
    },
    /**
     * 获取响应状态码
     * @method getHttpStatus
     * @static
     * @param {Object} res 响应对象
     * @return {Number} 响应状态码
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getHttpStatus: function (res) {
        return res.statusCode || '';
    },
    /**
     * 获取访客信息
     * @method getUserAgent
     * @static
     * @param {Object} req 请求对象
     * @return {String} UserAgent
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getUserAgent: function (req) {
        return req.headers['user-agent'];
    },
    /**
     * 获取HTTP协议版本
     * @method getHttpVersion
     * @static
     * @param {Object} req 请求对象
     * @return {String} HTTP协议版本
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getHttpVersion: function (req) {
        return req.httpVersionMajor + '.' + req.httpVersionMinor;
    },
    /**
     * 获取来源页地址
     * @method getReferrer
     * @static
     * @param {Object} req 请求对象
     * @return {String} 来源页地址
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getReferrer: function (req) {
        return req.headers.referer || req.headers.referrer;
    },
    /**
     * 获取指定的响应头字段值
     * @method getResponseHeader
     * @static
     * @param {Object} res 响应对象
     * @param {String} field 响应头字段名
     * @return {*} 指定的响应头字段值
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getResponseHeader: function (res, field) {
        if (!res._header) {
            return;
        }
        const header = res.getHeader(field);
        return Array.isArray(header) ? header.join(', ') : header;
    },
    /**
     * 获取响应内容长度
     * @method getContentLength
     * @static
     * @param {Object} res 响应对象
     * @return {Number} 响应内容长度
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getContentLength: function (res) {
        return this.getResponseHeader(res, 'content-length');
    },
    /**
     * 获取访问日志
     * @method getAccessLog
     * @static
     * @param {Object} req 请求对象
     * @param {Object} res 响应对象
     * @return {String} 访问日志
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getAccessLog: function (req, res) {
        return this.getRemoteIp(req) + ' - ' + this.getHttpMethod(req) + ' ' + this.getHttpStatus(res) + ' ' + this.getUrl(req);
    },
    /**
     * 获取访客信息
     * @method getAccessUser
     * @static
     * @param {Object} req 请求对象
     * @return {String} 访客信息
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getAccessUser: function (req) {
        return this.getRemoteIp(req) + ' - "' + this.getUserAgent(req) + '"';
    },
    /**
     * 生成Error对象，返回错误页或错误对象
     * @method catchError
     * @static
     * @param {Object} msgObj 消息对象
     *      {Number}[status=404] HTTP状态码
     *      {Number}[code=404] 错误码
     *      {String}[message='Page Not Found'] 错误消息
     * @param {Function} next 路由对象
     * @return {Object} 错误对象
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    catchError: function (msgObj, next = null) {
        msgObj.message = msgObj.message || 'Page Not Found';
        msgObj.status = msgObj.status || 404;
        msgObj.code = msgObj.code || 404;
        if (next) {
            return next(msgObj);
        }
        return msgObj;
    },
    /**
     * md5加密字符串
     * @method md5
     * @static
     * @param {String} str 源字符串
     * @return {String} 加密结果
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    md5: function (str) {
        let md5sum = crypto.createHash('md5');
        md5sum.update(str);
        return md5sum.digest('hex');
    },
    /**
     * 拼接标题
     * @method getTitle
     * @static
     * @param {String|Array} titleArr 标题数组
     * @param {String} [delimiter=' - '] 分隔符
     * @return {String} 拼接后的字符串
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    getTitle: function (titleArr, delimiter) {
        delimiter = delimiter || ' - ';
        if (!titleArr) {
            titleArr = [];
        }
        if (typeof titleArr === 'string') {
            titleArr = [titleArr];
        }

        return titleArr.join(delimiter);
    },
    /**
     * 生成随机ID字符串：10/11位十六进制时间戳+6/5位十六进制随机数
     * @method getUuid
     * @static
     * @return {String} ID
     * @author Fuyun
     * @version 2.0.0(2014-06-18)
     * @since 1.0.0(2014-06-17)
     */
    getUuid: function () {
        // 1e12 + 0x4ba0000000
        const idLen = 16;
        const hex = 16;
        const timeBased = 1324806901760;// 2011-12-25 17:55:01
        const timeStamp = new Date().getTime() - timeBased;
        const uuid = timeStamp.toString(hex);
        let tmpStr = '';

        for (let idx = 0; idx < idLen - uuid.length; idx += 1) {
            tmpStr += Math.floor(Math.random() * hex).toString(hex);
        }

        return uuid + tmpStr;
    },
    /**
     * 判断是否空对象
     * @method isEmptyObject
     * @static
     * @param {Object} obj 源对象
     * @return {Boolean} 判断结果：为空返回true，否则返回false
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    isEmptyObject: function (obj) {
        for (let name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    },
    /**
     * 判断数组是否含有指定元素
     * @method inArray
     * @static
     * @param {*} elem 元素
     * @param {Array} arr 数组
     * @param {Number} i 判断起始位置
     * @return {Number} 判断结果：找到返回所在位置，否则返回-1
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    inArray: function (elem, arr, i) {
        if (arr) {
            const len = arr.length;
            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

            while (i < len) {
                // Skip accessing in sparse arrays
                if (arr.hasOwnProperty(i) && arr[i] === elem) {
                    return i;
                }
                i += 1;
            }
        }

        return -1;
    },
    /**
     * 判断是否数组
     * @method isArray
     * @static
     * @param {*} obj 任意对象
     * @return {Boolean} 判断结果：数组返回true，非数组返回false
     * @author Fuyun
     * @version 1.0.0
     * @since 1.0.0
     */
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    /**
     * 去除头尾空白字符
     * @method trim
     * @static
     * @param {String|Undefined} str 源字符串
     * @return {String} 处理后的字符串
     * @version 2.0.0
     * @since 2.0.0
     */
    trim: function (str) {
        return str ? str.trim() : '';
    }
};
