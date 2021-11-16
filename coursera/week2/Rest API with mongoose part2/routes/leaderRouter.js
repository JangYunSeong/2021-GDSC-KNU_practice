const express = require('express');

const leaderRouter = express.Router();
leaderRouter.use(express.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the leaders to you!');
})
.post((req,res,next)=>{
    res.end('Will add the leader: ' + req.body.name + 
    'with details : ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next)=>{
    res.end('Deleting all the leaders!');
});

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end('Will send all details of the leader : '+
    req.params.leaderId + ' to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + 
    req.params.leaderId);
})
.put((req,res,next)=>{
    res.write('Updating the promotions : ' + req.params.leaderId+'\n');
    res.end('Will update the dish : ' + req.body.name +
    ' with details : ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting dish : ' + req.params.leaderId);
});

module.exports = leaderRouter;