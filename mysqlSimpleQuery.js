const db = require('mysql-promise')();
const dbQuery = require('./util/dbQuery');

class mysqlSimpleQuery {
    constructor(creds)
    {
        this.creds = creds;

        this.selectStatement = '*';
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
        return dbQuery.parseJoin(this.joinStatement);
    }

    where(key, value) {
        this.whereStatement[key] = value;
    }

    parseWhere() {
        return dbQuery.parseWhere(this.whereStatement);
    }

    groupBy(key) {
        if(key)
        {
            this.groupByStatement = dbQuery.groupBy(key);
        }
    }

    orderBy(key, order = 'ASC') {
        if(key)
        {
            this.orderByStatement = dbQuery.orderBy(key, order);
        }
    }

    limit(number) {
        if(number) {
            this.limitStatement = dbQuery.limit(number);
        }
    }

    queryRaw(query) {
        db.configure(this.creds);

        return new Promise(function(resolve, reject) {
            db.query(query).spread(function (data) {
                return resolve(data);
            });
        });
    }

    // Handles all querying
    query() {
        db.configure(this.creds);

        const queryStatement = `
            ${this.selectStatement} 
            ${this.table} 
            ${this.parseJoin()} 
            ${this.parseWhere()} 
            ${this.groupByStatement}
            ${this.orderByStatement}
            ${this.limitStatement};
        `;

        return new Promise(function(resolve, reject) {
            db.query(queryStatement).spread(function (data) {
                return resolve(data);
            });
        });
    }

    insert(table, data) {
        const last = Object.keys(data)[Object.keys(data).length-1];
        let query = `INSERT INTO ${table} `;

        query += '(';

        Object.keys(data).forEach(key => {
            if(key !== last)
            {
                query += `${key},`
            } else {
                query += `${key}`
            }
        });

        query += ') VALUES (';

        Object.keys(data).forEach(key => {
            let value = data[key];
            if(key !== last)
            {
                query += `'${value}',`
            } else {
                query += `'${value}'`
            }
        });

        query += ')';

        db.configure(this.creds);

        return new Promise(function(resolve, reject) {
            db.query(query).spread(function (data) {
                return resolve({
                    insertID: data.insertId
                });
            });
        });
    }
}

module.exports = mysqlSimpleQuery;