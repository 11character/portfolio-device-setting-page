export default class Utils {
    static randomString(count = 16) {
        let str = '';

        for (let i = 0; i < count; i++) {
            str += Math.floor(Math.random() * 36).toString(36);
        }

        return str;
    }

    static parseUrl(url) {
        const aEl = document.createElement('A');

        aEl.href = url;

        const arr = aEl.search.replace(/^\?/, '').split('&');
        const searchObj={};

        let queries;

        for (let i = 0; i < arr.length; i++) {
            queries = arr[i].split('=');
            searchObj[queries[0]] = queries[1];
        }

        return {
            protocol: aEl.protocol,
            host: aEl.host,
            hostname: aEl.hostname,
            port: aEl.port,
            // 브라우저에 따라서 pathname 값 앞에 `/`가 붙지 않는 겨우가 있다.
            // 브라우저 상관없이 `/`가 붙어있도록 처리한다.
            pathname: ('/' + aEl.pathname).replace(/^\/\//, '\/'),
            search: aEl.search,
            searchObj: searchObj,
            hash: aEl.hash
        };
    }

    static snakeToCamel(str = '') {
        str = str.toLowerCase();

        return str.replace(/([-_].)/g, function (group) {
            return group.toUpperCase().replace(/-|_/g, '');
        });
    }

    static snakeObjToCamelObj(sObj) {
        const cObj = {};

        for (let key in sObj) {
            cObj[Utils.snakeToCamel(key)] = sObj[key];
        }

        return cObj;
    }
}