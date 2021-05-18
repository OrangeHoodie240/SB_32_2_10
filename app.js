const express = require('express');
const middleware = require('./middleware');
const itemsRouter = require('./itemsRouter');  

const app = express(); 
app.use(express.json()); 
app.use(express.urlencoded({'extended': true})); 



app.use('/items', itemsRouter);





app.use(middleware.globalErrorHandler); 
app.use(middleware.notFound); 

module.exports = app; 