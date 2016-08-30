'use strict';

var http = require('@vizia/tapir/sources/http');
var json = require('@vizia/tapir/transforms/json');

var MONDO_API_URL = 'https://api.getmondo.co.uk';

function create(config) {
    var parse = json('transactions.*');
    var url = MONDO_API_URL + '/transactions?account_id=' + config.accountId;

    if (config.before) {
        url = url + '&before=' + config.before;
    }

    if (config.since) {
        url = url + '&since=' + config.since;
    }

    var options = {
        headers: {
            Authorization: 'Bearer ' + config.accessToken
        }
    };

    return parse(http(url, options));
}

exports.create = create;
