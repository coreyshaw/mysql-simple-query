const expect = require('chai').expect;

const mysqlSimpleQuery = require('../src/mysqlSimpleQuery');

describe('SimpleQuery', () => {
    it('query', () => {
        const test = new mysqlSimpleQuery();

        test.select('*');
        test.from('table');
        test.join('table', 'table_1 = table_2');
        test.where('key', 'value');
        test.groupBy('key');
        test.orderBy('key');
        const testResults = test.query(true);

        expect(testResults).to.equal('SELECT * FROM table INNER JOIN table ON table_1 = table_2 WHERE key="value" GROUP BY key ORDER BY key ASC;');
    });

    it('insert', () => {
        const test = new mysqlSimpleQuery();

        const results = test.insert('product_option_set', {
            'product_id': 1111,
            'option_set_uuid': 2222,
            'datetime': '2019-08-27 03:11:06'
        }, true);

        expect(results).to.equal('INSERT INTO product_option_set (product_id,option_set_uuid,datetime) VALUES (\'1111\',\'2222\',\'2019-08-27 03:11:06\')');
    });

    it('update without where clause', () => {
        const test = new mysqlSimpleQuery();

        const results = test.update('product_option_set', {
            'product_id': 2222,
            'option_set_uuid': 3333,
            'datetime': '2019-08-27 03:11:06'
        }, true);

        expect(results).to.equal('UPDATE product_option_set SET product_id = "2222", option_set_uuid = "3333", datetime = "2019-08-27 03:11:06"');
    });

    it('update with where clause', () => {
        const test = new mysqlSimpleQuery();

        test.where('product_id', 2222);
        const results = test.update('product_option_set', {
            'product_id': 2222,
            'option_set_uuid': 3333,
            'datetime': '2019-08-27 03:11:06'
        }, true);

        expect(results).to.equal('UPDATE product_option_set SET product_id = "2222", option_set_uuid = "3333", datetime = "2019-08-27 03:11:06" WHERE product_id="2222"');
    });

    it('delete with where clause', () => {
        const test = new mysqlSimpleQuery();

        test.where('product_id', 2222);
        const results = test.delete('product_option_set', true);
        expect(results).to.equal('DELETE FROM product_option_set WHERE product_id="2222"');
    });
});