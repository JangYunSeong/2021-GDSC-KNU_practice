const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operation');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    assert.equal(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    dboper.insertDocument(db, {name:"Vadonut", description: "delicious"}, 'dishes', (result)=>{
        console.log('Insert Document:\n', result.ops);

        dboper.findDocument(db, 'dishes', (docs)=>{
            console.log('found Documents:\n',docs);
            
            dboper.updateDocument(db,{name:'Vadonut'}, {description : 'Updated test'}, 'dishes', (result)=>{
                console.log('Updated Document:\n', result.result);
            
                dboper.findDocument(db,'dishes', (docs)=>{
                    console.log('found Documents:\n', docs);

                    db.dropCollection('dishes', (result)=>{
                        console.log('Dropped Collection:\n', result);                    
                    });
                });
            });
        });
    });
});