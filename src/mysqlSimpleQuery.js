const dbQuery = require('./util/dbQuery');
const { isEmpty } = require('./util/common');

class mysqlSimpleQuery {
    constructor()
    {
        this.selectStatement = '';
        this.joinStatement = {};
        this.whereStatement = {};
        this.whereInStatement = {};
        this.whereLikeStatement = {};
        this.whereBetweenStatement = {};
        this.joinType = null;
        this.whereCondition = null;
        this.whereLikeCondition = null;
        this.groupByStatement = '';
        this.orderByStatement = '';
        this.limitStatement = '';
        this.offsetStatement = '';
        this.table = null;
        this.whereConditionUsed = false;
        this.whereLikeConditionUsed = false;
        this.whereInConditionUsed = false;
        this.whereBetweenConditionUsed = false;
    }

    select(select) {
        this.selectStatement = dbQuery.select(select);
    }

    from(table) {
        this.table = dbQuery.from(table);
    }

    join(key, value, type) {
        this.joinStatement[key] = value;
        this.joinType = type;
    }

    parseJoin() {
        if(!isEmpty(this.joinStatement)) {
            return dbQuery.parseJoin(this.joinStatement, this.joinType);
        }

        return '';
    }

    where(key, value, condition) {
        this.whereStatement[key] = value;
        this.whereConditionUsed = true;

        if (condition) {
            this.whereCondition = condition;
        }
    }

    whereLike(key, value, condition) {
        this.whereLikeStatement[key] = value;
        this.whereLikeConditionUsed = true;

        if (condition) {
            this.whereLikeCondition = condition;
        }
    }

    whereIn(key, array) {
        this.whereInStatement[key] = array;
        this.whereInConditionUsed = true;
    }

    whereBetween(key, array, condition) {
        this.whereBetweenConditionUsed = true;

        if (condition) {
            this.whereLikeCondition = condition;
        }

        this.whereBetweenStatement[key] = array;
    }

    parseWhere() {
        if(!isEmpty(this.whereStatement)) {
            return dbQuery.parseWhere(this.whereStatement, this.whereCondition);
        }

        return '';
    }

    parseWhereIn() {
        let whereClauseFound = false;

        if (this.whereConditionUsed) {
            whereClauseFound = true;
        }

        if(!isEmpty(this.whereInStatement)) {
            return dbQuery.parseWhereIn(this.whereInStatement, whereClauseFound);
        }

        return '';
    }

    parseWhereLike() {
        let whereClauseFound = false;

        if (this.whereConditionUsed || this.whereInConditionUsed) {
            whereClauseFound = true;
        }

        if(!isEmpty(this.whereLikeStatement)) {
            return dbQuery.parseWhereLike(this.whereLikeStatement, this.whereLikeCondition, whereClauseFound);
        }

        return '';
    }

    parseWhereBetween() {
        let whereClauseFound = false;

        if (this.whereConditionUsed || this.whereInConditionUsed || this.whereLikeConditionUsed) {
            whereClauseFound = true;
        }

        if(!isEmpty(this.whereBetweenStatement)) {
            return dbQuery.parseWhereBetween(this.whereBetweenStatement, whereClauseFound);
        }

        return '';
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

    offset(number) {
        if(number) {
            this.offsetStatement = dbQuery.offset(number);
        }
    }

    queryRaw(query) {
        return query.trim();
    }

    // Handles all querying
    query() {
        let queryStatement = '';

        if(this.selectStatement) {
            queryStatement += this.selectStatement;
        }

        queryStatement += ` ${this.table}`;

        if(this.parseJoin() !== '') {
            queryStatement += ` ${this.parseJoin()}`;
        }

        if(this.parseWhere() !== '') {
            queryStatement += ` ${this.parseWhere()}`;
        }

        if(this.parseWhereIn() !== '') {
            queryStatement += ` ${this.parseWhereIn()}`;
        }

        if(this.parseWhereLike() !== '') {
            queryStatement += ` ${this.parseWhereLike()}`;
        }

        if(this.parseWhereBetween() !== '') {
            queryStatement += ` ${this.parseWhereBetween()}`;
        }

        if(this.groupByStatement !== '') {
            queryStatement += ` ${this.groupByStatement}`;
        }

        if(this.orderByStatement !== '') {
            queryStatement += ` ${this.orderByStatement}`;
        }

        if(this.limitStatement !== '') {
            queryStatement += ` ${this.limitStatement}`;
        }

        if(this.offsetStatement !== '') {
            queryStatement += ` ${this.offsetStatement}`;
        }

        queryStatement += ';';

        return queryStatement.trim();
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

        return query.trim();
    }

    update(table, data) {
        let query = '';

        query += `UPDATE ${table} SET ${dbQuery.update(data)}`;

        if(this.parseWhere() !== '') {
            query += ` ${this.parseWhere()}`;
        }

        return query.trim();
    }

    delete(table)
    {
        let query = '';

        query += `DELETE FROM ${table}`;

        if(this.parseWhere() !== '') {
            query += ` ${this.parseWhere()}`;
        }

        return query.trim();
    }
}

module.exports = mysqlSimpleQuery;