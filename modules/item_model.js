var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = mongoose.Schema({
        Title: String,
        Description: String,
        Image: String,
        Token_value: Number,
        Available_quantity: Number,
        Tags: Array,
        Creation_timestamp: Date
});

module.exports = mongoose.model('items', ItemSchema);     