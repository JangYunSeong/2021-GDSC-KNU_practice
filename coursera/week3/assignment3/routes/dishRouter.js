const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Dishes = require('../models/dishes');
const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

/*
  The route handlers for /dishes and /dishes/:dishId parameter is done
  in one route using /(:dishId)? search parameter.

  The /dishes/:dishId/comments and /dishes/:dishId/comments/:commentId are
  handled in its own route handler.

  Assignment 3:
  - authenticate.verifyAdmin function is used to verify Admin privilege for:
    - POST, PUT, and DELETE operations for /dishes and /dishes/:dishId
    - DELETE operation on /dishes/:dishId/comments
*/

// routie handling for /dishes and /dishes/:dishId
dishRouter.route('/(:dishId)?')
.all((req, res, next) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  // console.log("dishes: ",req.params)
  next()
})
.get((req, res, next) => {
  if(req.params.dishId){
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
	} else {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  }
})
.post(authenticate.verifyUser,
      authenticate.verifyAdmin, (req, res, next) => {

  if (req.params.dishId) { // contains dishId
    res.statusCode = 403
	  res.end('POST operation not supported on /dishes/' + req.params.dishId)
	}
  else { // no dishId
    Dishes.create(req.body)
    .then((dish) => {
      console.log('Dish Created ', dish);
      res.setHeader('Content-Type', 'application/json')
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
  }
})
.put(authenticate.verifyUser,
     authenticate.verifyAdmin, (req, res, next) => {

  if(req.params.dishId){ // contains dishId
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })
    .then((dish) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
	} else { // no dishId
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
  }
})
.delete(authenticate.verifyUser,
        authenticate.verifyAdmin, (req, res, next) => {

  if (req.params.dishId) { // contains dishId
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
  }
  else { // no dishId
    console.log("Deleting All dishes")
    Dishes.deleteMany({})
    .then((resp) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
  }
});

// For /dishes/:dishId/comments
dishRouter.route('/:dishId/comments')
.all((req, res, next) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  next()
})
.get((req, res, next) => {
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
    if (dish == null) {
        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status = 404;
        return next(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(dish.comments);
  }, (err) => next(err))
  .catch((err) => next(err));
})
// POST /dishes/:dishId/comments
.post(authenticate.verifyUser, (req, res, next) => {
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
    if (dish != null) {
      req.body.author = req.user._id; // add author id
      dish.comments.push(req.body);
      dish.save()
      .then((dish) => {
        Dishes.findById(dish._id)
        .populate('comments.author')
        .then((dish) => {
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
        })
      }, (err) => next(err));
    }
    else {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
// PUT /dishes/:dishId/comments
.put(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403
  res.end('PUT operation not supported on /dishes')
})
// DELETE /dishes/:dishId/comments
.delete(authenticate.verifyUser,
        authenticate.verifyAdmin, (req, res, next) => {

  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if (dish == null) {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    }

    for (var i = (dish.comments.length -1); i >= 0; i--) {
      dish.comments.id(dish.comments[i]._id).remove();
    }
    dish.save()
    .then((dish) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err));
  }, (err) => next(err))
  .catch((err) => next(err));
})

// For /dishes/:dishId/comments/:commentId
dishRouter.route('/:dishId/comments/:commentId')
.all((req, res, next) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  next()
})
.get((req, res, next) => {
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
    if (dish == null) {
        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status = 404;
        return next(err);
    }
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      res.setHeader('Content-Type', 'application/json');
      res.json(dish.comments.id(req.params.commentId));
    }
    else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
// POST /dishes/:dishId/comments/:commentId
.post(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId
    + '/comments/' + req.params.commentId);
})
// PUT /dishes/:dishId/comments/:commentId
.put(authenticate.verifyUser, (req, res, next) => {

  Dishes.findById(req.params.dishId)
  .then((dish) => {
    // Check to see if selected dish contains the selected comment
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      // check if logged user is the author of the comment
      if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
        // only comment author is allowed to make changes
        if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.comment) {
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        }
        dish.save()
        .then((dish) => {
          Dishes.findById(dish._id)
          .populate('comments.author')
          .then((dish) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
          })
        }, (err) => next(err));
      }
      else { // Not comment author
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
      }
    }
    else if (dish == null) {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    }
    else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
// DELETE /dishes/:dishId/comments/:commentId
.delete(authenticate.verifyUser, (req, res, next) => {
  // look for selected dish in the database
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if (dish == null) {
      err = new Error('Dish ' + req.params.dishId + ' not found');
      err.status = 404;
      return next(err);
    }

    // Check to see if selected dish contains the selected comment
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      // check if logged user is the author of the comment
      if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
        // only comment author is allowed to delete the comment
        dish.comments.id(req.params.commentId).remove();
        dish.save()
        .then((dish) => {
          Dishes.findById(dish._id)
          .populate('comments.author')
          .then((dish) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
          })
        }, (err) => next(err));
      }
      else { // Not comment author
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
      }
    }
    else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})

module.exports = dishRouter