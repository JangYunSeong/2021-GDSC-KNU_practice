const http = require('http');
const fs = require('fs'); // for local file system
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req,res)=>{
    console.log("Request for " + req.url + ' by method ' + req.method);
    if(req.method == 'GET'){
        var fileurl;
        if(req.url == '/'){
            fileurl = '/index.html';
        }
        else{
            fileurl = req.url;
        }
        var filePath = path.resolve('./public'+fileurl);
        const fileExt = path.extname(filePath);
        if(fileExt == '.html'){
            fs.exists(filePath, (exists) =>{
                if(!exists){
                    res.statusCode = 404;
                    res.setHeader('Context-Type', 'text/html');
                    res.end("<html><body><h1>Error : 404 " + fileurl + "not found</h1></body></html>");
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            })
        }
        else{
            res.statusCode = 404;
            res.setHeader('Context-Type', 'text/html');
            res.end("<html><body><h1>Error : 404 " + fileurl + "not an HTML file</h1></body></html>");
            return;
        }
    }
    else{
        res.statusCode = 404;
        res.setHeader('Context-Type', 'text/html');
        res.end("<html><body><h1>Error : 404 " + req.method + "not supported</h1></body></html>");
        return;
        }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});