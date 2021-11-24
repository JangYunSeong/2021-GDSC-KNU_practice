const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var User = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true  
    },
    admin : {
        type : Boolean,
        default : false
    }
}, {
    timestamps:true,
    usePushEach : true
});

module.exports = mongoose.model('User', User);