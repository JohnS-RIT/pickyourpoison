const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/bundle.js': htmlHandler.getBundle,
        '/getOrders': jsonHandler.getOrders,
        // '/notReal': jsonHandler.notFound,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        // '/getUsers': jsonHandler.getUsersMeta,
        // '/notReal': jsonHandler.notFoundMeta,
        // notFound: jsonHandler.notFoundMeta,
    },
};

const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addDrink') {
        const res = response;

        const body = [];

        request.on('error', (err) => {
            console.dir(err);
            res.statusCode = 400;
            res.end();
        });

        request.on('data', (chunk) => {
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);

            jsonHandler.addDrink(request, res, bodyParams);
        });
    }
};

const handleGetAndHead = (request, response, parsedUrl) => {
    if (urlStruct[request.method][parsedUrl.pathname]) {
        urlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
        urlStruct[request.method].notFound(request, response);
    }
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else {
        handleGetAndHead(request, response, parsedUrl);
    }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
