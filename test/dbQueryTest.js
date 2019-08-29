const expect = require('chai').expect;
const qbQuery = require('../src/util/dbQuery');

describe('dbQuery Util', () => {
    describe('Select', () => {
        it('Select if no params are passed in', () => {
            const test = qbQuery.select();
            expect(test).to.equal("SELECT *");
        });

        it("Select if one param are passed in", () => {
            const test = qbQuery.select('id');
            expect(test).to.equal("SELECT id");
        });

        it("Select if two param are passed in", () => {
            const test = qbQuery.select('id, name');
            expect(test).to.equal("SELECT id, name");
        });
    });

    describe('From', () => {
        it('From will return correctly with table param', () => {
            const test = qbQuery.from('test_table');
            expect(test).to.equal("FROM test_table");
        });
    });

    describe('Join', () => {
        it('Returns join table is one is called', () => {
            const test = qbQuery.parseJoin({table: 'test = test2'});
            expect(test).to.equal("INNER JOIN table ON test = test2");
        });

        it('Returns join table is two are called', () => {
            const test = qbQuery.parseJoin({table: 'test = test2', table2: 'test = test2'});
            expect(test).to.equal("INNER JOIN table ON test = test2 INNER JOIN table2 ON test = test2");
        });
    });

    describe('Where', () => {
        it('Returns where statement when one is called', () => {
            const test = qbQuery.parseWhere({key: 'value'});
            expect(test).to.equal('WHERE key="value"');
        });

        it('Returns where statement when two are called', () => {
            const test = qbQuery.parseWhere({key: 'value', key2: 'value'});
            expect(test).to.equal('WHERE key="value" AND key2="value"');
        });
    });

    describe('GroupBy', () => {
        it('GroupBy will return correctly with param is passed in', () => {
            const test = qbQuery.groupBy('key');
            expect(test).to.equal("GROUP BY key");
        });
    });

    describe('OrderBy', () => {
        it('OrderBy will return correctly with param is passed in', () => {
            const test = qbQuery.orderBy('key', 'order');
            expect(test).to.equal("ORDER BY key order");
        });
    });

    describe('Limit', () => {
        it('Limit will return correctly with param is passed in', () => {
            const test = qbQuery.limit(1);
            expect(test).to.equal("LIMIT 1");
        });
    });

    describe('Update', () => {
        it('Update will return correctly with param is passed in', () => {
            const test = qbQuery.update({
                'product_id': 2222,
                'option_set_uuid': 3333,
                'datetime': '2019-08-27 03:11:06'
            });
            expect(test).to.equal("product_id = \"2222\", option_set_uuid = \"3333\", datetime = \"2019-08-27 03:11:06\"");
        });
    });
});