const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operation');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url)
    .then((err, client) => {
    assert.equal(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    dboper.insertDocument(db, {name:"Vadonut", description: "delicious"}, 'dishes') 
    .then((result)=>{
        console.log('Insert Document:\n', result.ops);

        return dboper.findDocument(db, 'dishes')
    })
    .then((docs)=>{
        console.log('found Documents:\n',docs);
            
        return dboper.updateDocument(db,{name:'Vadonut'}, {description : 'Updated test'}, 'dishes')
    })
    .then((result)=>{
        console.log('Updated Document:\n', result.result);
            
        return dboper.findDocument(db,'dishes')
    })
    .then((docs)=>{
        console.log('found Documents:\n', docs);

        return db.dropCollection('dishes')
    })
    .then((result)=>{
        console.log('Dropped Collection:\n', result);
        client.close();                    
    })
    .catch((err)=>{
        console.log(err);
    });
})
.catch((err)=>{
    console.log('error');
});