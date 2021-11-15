const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = "mongodb://127.0.0.1:27017/conFusion";
const connection = mongoose.connect(url);

connection.then((db) => {
    console.log('connected correctly to the server');

    Dishes.create({
        name : 'hoho',
        description : 'hey'
    })
    .then((dish) => {
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description : 'Updated test'}
        },{
            new : true
        }).exec();
    })
    .then((dish)=>{
        console.log(dish);

        dish.comments.push({
            rating : 5,
            commnet : 'good',
            author : 'yunsung'
        });
        return dish.save();
    })
    .then((dish) => {    
        console.log(dish);
        return Dishes.remove({});
    })
    .then(()=>{
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
});