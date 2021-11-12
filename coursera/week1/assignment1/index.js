const express = require('express');
const http = require('http');
const morgan = require('morgan');
const path = require('path');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.set('port', process.env.PORT || 3000);

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/', express.static(path.join(__dirname, '/public')));

app.use((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Context-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(app.get('port'), ()=>{
    console.log('running at port:',app.get('port'));
});