const mysqlQuery = require("./mysqlSimpleQuery");

let db = new mysqlQuery({
    host: '',
    database: '',
    user: '',
    password: ''
});

db.select('id, product_id');
db.where('option_set_uuid', '2efc41ce-5248-4bb8-9e48-c8edb2967a2d');
db.from('product_option_set');

const results = db.query();

results.then(function(result) {
   console.log(result);
});

// const results = db.insert('product_option_set', {
//     'product_id': 1111,
//     'option_set_uuid': 2222,
//     'datetime': '2019-08-27 03:11:06'
// });
//
// results.then(function(result) {
//    console.log(result);
// });