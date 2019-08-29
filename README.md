MySQL Simple Query
=======================================

[![Build Status](https://travis-ci.org/coreyshaw/mysql-simple-query.svg?branch=master)](https://travis-ci.org/coreyshaw/mysql-simple-query)

Simple query wrapper for mysql-promise to make querying, inserting, updating, and deleting easier for developers.

* * *

This library takes the annoyance out of writing raw MySQL queries in Javascript. The queries are easy to read in your code and easy to build complex queries. 

## Install

```bash
npm install --save mysql-simple-query
```

### List of features

* [Querying](#Querying)
* [Inserting](#Inserting)
* [Updating](#Updating)
* [Deleting](#Deleting)
* [Raw Query](#Raw-Query)


### Configuring

All calls need to be have a reference to the mysql-simple-query class.
Passing credentials to mysql-promise can be done in two ways:

```js
const mysqlQuery = require("mysql-simple-query");

const db = new mysqlQuery({
    host: 'someHost',
    database: 'someDatabase',
    user: 'someUser',
    password: 'somePassword'
});
```

OR it can be configured using the following environment variables placed on your server or system.
```js
MYSQL_SQ_HOST="someHost"
MYSQL_SQ_DATABASE="someDatabse"
MYSQL_SQ_USER="someUser"
MYSQL_SQ_PASSWORD="somePassword"

const mysqlQuery = require("mysql-simple-query");

const db = new mysqlQuery();

```

### Querying

#### Query with basic select from and where
```js
db.select('id, name');
db.from('users');
db.where('name', 'foo');

const results = db.query();

results.then(function(result) {
   console.log(result);
});
```
If `Select *` is needed you can leave off the db.select and it will be defaulted.

#### Query with select, from, join, and where
```js
db.select('id, name');
db.join('table', 'abc = def');
db.from('users');
db.where('name', 'foo');

const results = db.query();

results.then(function(result) {
   console.log(result);
});
```

The above example will produce an INNER JOIN. There can be multiple db.join and db.where to chain them together.

```js
db.select('id, name');
db.join('table', 'abc = def');
db.join('table2', 'abc = def');
db.from('users');
db.where('id', '123');
db.where('name', 'foo');

const results = db.query();

results.then(function(result) {
   console.log(result);
});
````

#### Other querying parameters
```js
db.groupBy('item');
db.orderBy('item', 'ACS');
db.limit(1);
```

### Inserting

```js
/**
 * @param {string} table    Name of the database table to insert into
 * @param {object} data     data to insert into the database
 * @returns {promise}
 */
const results = db.insert('users_table', {
    'name': 'foo bar',
    'department': 'engineering',
    'datetime': '2019-08-27 03:11:06'
});

results.then(function(result) {
   console.log(result);
});
```

### Updating

```js
/**
 * @param {string} table    Name of the database table to update
 * @param {object} data     data to update into the database
 * @returns {promise}
 */
const results = db.update('users_table', {
    'name': 'foo bar',
    'department': 'engineering',
    'datetime': '2019-08-27 03:11:06'
});

results.then(function(result) {
   console.log(result);
});
````

### Deleting

```js
db.where('name', 'foo');
db.delete('users');
````

### Raw Query
If you need to pass in your own custom query into mysql-promise you can do so by calling the following.

```js
const results = db.queryRaw('SELECT * FROM TABLE...');
````

### Overriding mysql-promise
On the `query`, `insert`, `update`, and `delete` methods, mysql-promise can be ignored by passing a `true` in the last param. This will return the raw sql syntax.

IE:
```js
db.select('id, name');
db.from('users');
db.where('name', 'foo');

const results = db.query(true);
````

### Component Definitions
#### db.select()
```js
/**
 * @param {string} select string    Comma seperated list
 * @returns {promise}
 */
db.select('id','name','department');
```

#### db.from()
```js
/**
 * @param {string} table_name
 * @returns {promise}
 */
db.from('users');
```

#### db.where()
These calls can be chained together to form multiple where statements.
```js
/**
 * @param {string} key
 * @param {string} value
 * @returns {promise}
 */
db.where('name','foo');
db.where('deparment','engineering');
```

#### db.join()
This will produce an INNER JOIN. These calls can be chained together to form multiple join statements.
```js
/**
 * @param {string} key
 * @param {string} value
 * @returns {promise}
 */
db.join('table', 'item = item2');
```

#### db.groupBy()
```js
/**
 * @param {string} key
 * @returns {promise}
 */
db.groupBy('key');
```

#### db.orderBy()
```js
/**
 * @param {string} key
 * @param {ENUM} order ASC or DESC
 * @returns {promise}
 */
db.orderBy('key', 'ASC');
```

#### db.limit()
```js
/**
 * @param {int} number to limit by
 * @returns {promise}
 */
db.limit(1);
```


### License

This project is licensed under the MIT License
