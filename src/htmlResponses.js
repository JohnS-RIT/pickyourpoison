const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const ordersPage = fs.readFileSync(`${__dirname}/../hosted/orders.html`);
const ordersCSS = fs.readFileSync(`${__dirname}/../hosted/style2.css`);

// Functions for loading proper html, css, and javascript files

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsBundle);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getOrders = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(ordersPage);
  response.end();
};

const getOrdersCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(ordersCSS);
  response.end();
};

module.exports = {
  getIndex,
  getBundle,
  getCSS,
  getOrders,
  getOrdersCSS,
};
