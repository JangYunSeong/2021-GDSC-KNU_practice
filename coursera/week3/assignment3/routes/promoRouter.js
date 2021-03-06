const express = require('express');

const promoRouter = express.Router();
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');
promoRouter.use(express.json());

promoRouter.route('/')
.get((req,res,next)=>{
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyAdmin,authenticate.verifyOrdinaryUser,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('promotions created ' + promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyAdmin,authenticate.verifyOrdinaryUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyAdmin,authenticate.verifyOrdinaryUser,(req,res,next)=>{
    Promotions.remove({})
    .then((resp) => {
        console.log('All of promotions created');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.post(authenticate.verifyAdmin,authenticate.verifyOrdinaryUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + 
    req.params.promoId);
})
.put(authenticate.verifyAdmin,authenticate.verifyOrdinaryUser,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set : req.body
    }, {new : true})
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        },(err) => next(err))
        .catch((err)=> next(err));
    })
.delete(authenticate.verifyAdmin,authenticate.verifyOrdinaryUser,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err) => next(err))
        .catch((err)=> next(err));
});

module.exports = promoRouter;
