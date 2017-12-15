var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
        Username: String,
        Password: String,
        balance: Number,
        redeemed: [{
      		_id: ObjectId,
        	Title: String,
        	Description: String,
        	Token_value: Number,
        	Redeemed_timestamp: Date
        }]
});

module.exports = mongoose.model('users', userSchema);
