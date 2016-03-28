var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Transactions = require('./transaction');
var expenseSchema = new Schema({
    name: {
    type: String,
    required: true
    },
    expense: {
        type: Number,
        required: true
    },
    addedby: {
        type: String,
        required: true
    },
    details: {
        // name: {
        //     type:Array
        // },
        // share: {
        //     type: Number
        // }
        type: String,
        required: true
    }       
});

expenseSchema.pre('save', function(next){
    var data = this;
        var spdata = JSON.parse(data.details);
        var arrdata = spdata.name;
        arrdata.forEach(function (name) {
            var isFlag = false;
            Transactions.findOne({owedto: data.addedby, owedby: name}, function(err, entry){
                if(err){
                    console.log(err);
                    next();
                }
                if(!entry) {
                    
                 var newtrns = Transactions({
                     owedto: data.addedby,
                     owedby: name,
                     amount: spdata.share
                 });
                    newtrns.save(function(err, res){
                        if(err){
                            console.log('not saved');
                            next();
                        }
                        else {
                            console.log('success' + res);
                            next();
                        }
                    })
                }
                if(entry){
                    if(data.name == 'Paid'){
                        
                        var newamt = entry.amount - spdata.share;
                        console.log(newamt);
                    }
                    else {
                    var newamt = entry.amount + spdata.share;
                    }
                    Transactions.update({owedto: data.addedby, owedby: name},{amount: newamt}, function(err, res){
                        if(err){
                            console.log(err);
                        }
                        else {
                        console.log(res);
                        isFlag = true;
                        next(); 
                        }
                    })
                }
            })
            
            Transactions.findOne({owedto: name, owedby: data.addedby}, function(err, entry){
                if(err){
                    console.log(err);
                    next();
                }
                if(!entry) {
                next();
                }
                if(entry){
                    
                    if(entry.amount > 0)
                    var newamt = entry.amount - spdata.share;
                    else
                    var newamt = entry.amount + spdata.share;
                    
                    Transactions.update({owedto: name, owedby: data.addedby},{amount: newamt}, function(err, res){
                        if(err){
                            console.log(err);
                        }
                        else{
                        console.log(res);
                        next();
                        }
                    })
                    
                    Transactions.findOne({owedto: data.addedby, owedby:name}).remove(function(err, res) {
                        if(err)
                        console.log(err);
                        else {
                        console.log('done');
                        next();
                        }
                    })
                    
                }
            })
        })
            
        Transactions.find({amount: 0}).remove(function(err, res) {
                        if(err)
                        console.log(err);
                        else {
                        console.log('zeroes done');
                        next();
                        }
                    })
        
        
        next();
});

module.exports = mongoose.model('Expenses', expenseSchema);