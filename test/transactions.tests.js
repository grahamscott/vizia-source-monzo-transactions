'use strict';

const transactions = require('../lib/transactions');
const MONDO_API_URL = 'https://api.getmondo.co.uk:443';

const jsonResponse = require('./fixtures/transactions.json');

const test = require('tape');

const nock = require('nock');
nock.disableNetConnect();

const XMLHttpRequest = require('xhr2').XMLHttpRequest;
global.XMLHttpRequest = XMLHttpRequest;


test('creates a function when passed config', assert => {
    const config = {};
    const source = transactions.create(config);

    assert.equal(typeof source, 'function', 'should create function');
    assert.end();
});

test('calls the mondo api transactions endpoint with the account id', assert => {
    const config = {
        accountId: 'accountId'
    };

    const scope = nock(MONDO_API_URL, { encodedQueryParams : true })
        .get('/transactions')
        .query({ account_id: config.accountId })
        .reply(200, jsonResponse);

    const source = transactions.create(config);

    source(null, (end, data) => {
        assert.true(scope.isDone(), 'request made');
        assert.end();
    });
});

test('calls the mondo api transactions endpoint with the before date', assert => {
    const config = {
        accountId: 'accountId',
        before: '2016-08-01T23:00:00Z'
    };

    const scope = nock(MONDO_API_URL, { encodedQueryParams : true })
        .get('/transactions')
        .query({
            account_id: config.accountId,
            before: config.before
        })
        .reply(200, jsonResponse);

    const source = transactions.create(config);

    source(null, (end, data) => {
        assert.true(scope.isDone(), 'request made');
        assert.end();
    });
});

test('calls the mondo api transactions endpoint with the since date', assert => {
    const config = {
        accountId: 'accountId',
        since: '2016-08-01T23:00:00Z'
    };

    const scope = nock(MONDO_API_URL, { encodedQueryParams : true })
        .get('/transactions')
        .query({
            account_id: config.accountId,
            since: config.since
        })
        .reply(200, jsonResponse);

    const source = transactions.create(config);

    source(null, (end, data) => {
        assert.true(scope.isDone(), 'request made');
        assert.end();
    });
});

test('calls the mondo api transactions endpoint with the oauth token header', assert => {
    const config = {
        accountId: 'accountId',
        accessToken: 'coole-token'
    };

    const scope = nock(MONDO_API_URL, { encodedQueryParams : true })
        .matchHeader('Authorization', 'Bearer ' + config.accessToken)
        .get('/transactions')
        .query({
            account_id: config.accountId
        })
        .reply(200, jsonResponse);

    const source = transactions.create(config);

    source(null, (end, data) => {
        assert.true(scope.isDone(), 'request made');
        assert.end();
    });
});

test('returns parsed Monzo transaction objects', assert => {
    const config = {
        accountId: 'accountId'
    };

    const scope = nock(MONDO_API_URL, { encodedQueryParams : true })
        .get('/transactions')
        .query({
            account_id: config.accountId
        })
        .reply(200, jsonResponse);

    const source = transactions.create(config);

    source(null, (end, data) => {
        const expected = jsonResponse.transactions[0];
        const actual = data;

        assert.true(scope.isDone(), 'request made');
        assert.equal(actual, data, 'responded with JSON');

        assert.end();
    });
});
