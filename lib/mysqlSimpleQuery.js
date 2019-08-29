const db = require('mysql-promise')();
const dbQuery = require('./util/dbQuery');
const { isEmpty } = require('./util/common');

class mysqlSimpleQuery {
    constructor(creds) {
        this.creds = creds;

        this.selectStatement = '';
        this.joinStatement = {};
        this.whereStatement = {};
        this.groupByStatement = '';
        this.orderByStatement = '';
        this.limitStatement = '';
        this.table = null;
    }

    select(select) {
        this.selectStatement = dbQuery.select(select);
    }

    from(table) {
        this.table = dbQuery.from(table);
    }

    join(key, value) {
        this.joinStatement[key] = value;
    }

    parseJoin() {
        if (!isEmpty(this.joinStatement)) {
            return dbQuery.parseJoin(this.joinStatement);
        }

        return '';
    }

    where(key, value) {
        this.whereStatement[key] = value;
    }

    parseWhere() {
        if (!isEmpty(this.whereStatement)) {
            return dbQuery.parseWhere(this.whereStatement);
        }

        return '';
    }

    groupBy(key) {
        if (key) {
            this.groupByStatement = dbQuery.groupBy(key);
        }
    }

    orderBy(key, order = 'ASC') {
        if (key) {
            this.orderByStatement = dbQuery.orderBy(key, order);
        }
    }

    limit(number) {
        if (number) {
            this.limitStatement = dbQuery.limit(number);
        }
    }

    queryRaw(query) {
        return this._queryMysql(query);
    }

    // Handles all querying
    query(rawQuery = false) {
        let queryStatement = '';

        if (this.selectStatement) {
            queryStatement += this.selectStatement;
        }

        queryStatement += ` ${this.table}`;

        if (this.parseJoin() !== '') {
            queryStatement += ` ${this.parseJoin()}`;
        }

        if (this.parseWhere() !== '') {
            queryStatement += ` ${this.parseWhere()}`;
        }

        if (this.groupByStatement !== '') {
            queryStatement += ` ${this.groupByStatement}`;
        }

        if (this.orderByStatement !== '') {
            queryStatement += ` ${this.orderByStatement}`;
        }

        if (this.limitStatement !== '') {
            queryStatement += ` ${this.limitStatement}`;
        }

        queryStatement += ';';

        if (rawQuery) {
            return queryStatement.trim();
        }

        return this._queryMysql(queryStatement.trim());
    }

    insert(table, data, rawQuery = false) {
        const last = Object.keys(data)[Object.keys(data).length - 1];
        let query = `INSERT INTO ${table} `;

        query += '(';

        Object.keys(data).forEach(key => {
            if (key !== last) {
                query += `${key},`;
            } else {
                query += `${key}`;
            }
        });

        query += ') VALUES (';

        Object.keys(data).forEach(key => {
            let value = data[key];
            if (key !== last) {
                query += `'${value}',`;
            } else {
                query += `'${value}'`;
            }
        });

        query += ')';

        if (rawQuery) {
            return query;
        }

        return this._queryMysql(query);
    }

    update(table, data, rawQuery = false) {
        let query = '';

        query += `UPDATE ${table} SET ${dbQuery.update(data)}`;

        if (this.parseWhere() !== '') {
            query += ` ${this.parseWhere()}`;
        }

        if (rawQuery) {
            return query;
        }

        return this._queryMysql(query);
    }

    delete(table, rawQuery = false) {
        let query = '';

        query += `DELETE FROM ${table}`;

        if (this.parseWhere() !== '') {
            query += ` ${this.parseWhere()}`;
        }

        if (rawQuery) {
            return query;
        }

        return this._queryMysql(query);
    }

    _queryMysql(query) {
        db.configure({
            host: process.env.MYSQL_SQ_HOST || this.creds.host,
            database: process.env.MYSQL_SQ_DATABASE || this.creds.database,
            user: process.env.MYSQL_SQ_USER || this.creds.user,
            password: process.env.MYSQL_SQ_PASSWORD || this.creds.password
        });

        return db.query(query.trim()).spread(function (data) {
            return data;
        });
    }
}

module.exports = mysqlSimpleQuery;