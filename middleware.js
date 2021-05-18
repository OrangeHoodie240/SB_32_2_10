

function notFound(req, res){
    return res.status(404).send('<h1>Not Found</h1>'); 
}


function globalErrorHandler(error, req, res, next){
    const message = error.message; 
    const status = error.status || 500; ;
    return res.status(status).send({'error': {message, status}}); 
}


module.exports = {notFound, globalErrorHandler};