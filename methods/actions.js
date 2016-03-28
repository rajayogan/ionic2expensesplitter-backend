var User = require('../model/user');
var Expenses = require('../model/expense');
var config = require('../config/database');
var Transactions = require('../model/transaction');
var jwt = require('jwt-simple');

var functions = {
    authenticate: function(req, res) {
        User.findOne({
            name: req.body.name
        }, function(err, user){
            if (err) throw err;
            
            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }
            
           else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, token: token});
                    } else {
                        return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }
            
        })
    },
    addNew: function(req, res){
        if((!req.body.name) || (!req.body.password)){
            console.log(req.body.name);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                name: req.body.name,
                password: req.body.password
            });
            
            newUser.save(function(err, newUser){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }
                
                else {
                    res.json({success:true, msg:'Successfully saved'});
                }
            })
        }
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello '+decodedtoken.name});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    
    getUsers: function(req, res) {
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
         User.find({}, function(err, users){
             var usersref = [];
             users.forEach(function(user){
                 usersref.push(user.name);
             })
             res.send({success: 'true', data: usersref});
         });
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    
    saveExpense: function(req, res) {
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            if((!req.body.name) || (!req.body.expense) || (!req.body.details)){
                        
            res.json({success: false, msg: 'Enter all values'});
        }
            else {
                var newExpense = Expenses({
                    name: req.body.name,
                    expense: req.body.expense,
                    addedby: decodedtoken.name,
                    details: req.body.details
                });
               
                newExpense.save(function(err, newExpense){
                    if(err)
                    res.json({success: 'false', msg: 'Failed to save'});
                    else
                    res.json({success: 'true', msg: 'Saved successfully'});
                })
            }
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    
    getAmtInfo: function(req, res) {
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            Transactions.find({owedby: decodedtoken.name}, function(err, owedusers) {
                if(err)
                console.log(err);
                if(!owedusers)
                res.json({success: false, msg: 'No money owed to anyone'});
                else
                res.json({success: true, data: owedusers});
            })
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    
    getDueInfo: function(req, res) {
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            Transactions.find({owedto: decodedtoken.name}, function(err, dueusers) {
                if(err)
                console.log(err);
                if(!dueusers)
                res.json({success: false, msg: 'No money due from anyone'});
                else
                res.json({success: true, data: dueusers});
            })
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    }
    
    
}

module.exports = functions;
