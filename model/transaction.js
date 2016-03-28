var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transactionSchema = new Schema({
    owedto: {
        type: String,
        required: true
    },
    
    owedby: {
        type: String,
        required: true
    },
    
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Transactions',transactionSchema);