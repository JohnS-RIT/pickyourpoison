const customers = {};

// Following 2 functions are for writing JSON for GET and HEAD respectively
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Following 2 functions are for creating JSON for GET and HEAD respectively
const getOrdersJSON = (request, response) => {
  const responseJSON = {
    customers,
  };

  let responseCode = 201;

  if (customers === {}) {
    responseCode = 200;
  }

  return respondJSON(request, response, responseCode, responseJSON);
};

const getOrdersJSONMeta = (request, response) => respondJSONMeta(request, response, 200);

// Create JSON based on orderform input of user
const addDrink = (request, response, body) => {
  const responseJSON = {
    message: 'All portions of order must be complete.',
  };

  if (!body.name || !body.coffeeType || !body.roast || !body.servings || !body.milk) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;
  responseJSON.message = 'Drink Created Successfully';

  if (customers[body.name]) {
    responseCode = 204;
  } else {
    customers[body.name] = {};
  }

  customers[body.name].name = body.name;
  customers[body.name].coffeeType = body.coffeeType;
  customers[body.name].roast = body.roast;
  customers[body.name].servings = body.servings;
  customers[body.name].milk = body.milk;
  customers[body.name].sugar = body.sugar;

  return respondJSON(request, response, responseCode, responseJSON);
};

// Following 2 functions deal with not real/not found pages by users for GET and HEAD respectively
const notFound = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  addDrink,
  notFound,
  notFoundMeta,
  getOrdersJSON,
  getOrdersJSONMeta,
};
