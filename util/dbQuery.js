const select = (select) => {
    let selectString = "";

    if(typeof(select) === 'object')
    {
        selectString = select.join(', ');
    }

    if(typeof(select) === 'string')
    {
        selectString = select;
    }

    return `SELECT ${selectString}`;
};

const from = (table) => {
    return `FROM ${table}`;
};

const parseJoin = (joinObject) => {
    if(joinObject === {})
    {
        return '';
    }

    let joinStatement = [];

    for (let key of Object.keys(joinObject)) {
        const value = joinObject[key];
        joinStatement.push(`INNER JOIN ${key} ON ${value}`);
    }

    return joinStatement.join(' ');
};

const parseWhere = (whereObject) => {
    let whereStatement = [];

    for (let key of Object.keys(whereObject)) {
        const value = whereObject[key];
        whereStatement.push(`${key}="${value}"`);
    }

    return `WHERE ${whereStatement.join(' AND ')}`;
};

const groupBy = (key) => {
    return `GROUP BY ${key}`;
};

const orderBy = (key, order) => {
  return `ORDER BY ${key} ${order}`;
};

const limit = (number) => {
    return `LIMIT ${number};`;
}

module.exports = {
    select,
    from,
    parseJoin,
    parseWhere,
    groupBy,
    orderBy,
    limit
};