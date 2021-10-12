const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// make struct for GET and HEAD requests
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getOrders': htmlHandler.getOrders,
    '/getOrdersJSON': jsonHandler.getOrdersJSON,
    '/style2.css': htmlHandler.getOrdersCSS,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getOrdersJSON': jsonHandler.getOrdersJSONMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

// Function to handle POST requests
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

// Function to handle GET and HEAD requests, which can happen on both the makeOrder
// (client.html) and viewOrder (orders.html) pages
const handleGetAndHead = (request, response, parsedUrl) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// When receiving request, act accordingly based on request method
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
