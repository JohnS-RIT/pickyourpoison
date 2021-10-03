'use strict';

//function for parsing responses
var parseJSON = function parseJSON(xhr, content) {
    //parse response, 204 status will have empty obj
    try {
        var obj = JSON.parse(xhr.response);
        console.dir(obj);

        //add any messages to screen
        if (obj.message) {
            var p = document.createElement('p');
            p.textContent = 'Message: ' + obj.message;
            content.appendChild(p);
        }

        //add any users (if in response) to screen
        if (obj.users) {
            var userList = document.createElement('p');
            var users = JSON.stringify(obj.users);
            userList.textContent = users;
            content.appendChild(userList);
        }
    } catch (e) {
        return;
    }
};

//function for handling responses
var handleResponse = function handleResponse(xhr, parseResponse) {
    var content = document.querySelector('#content');
    //check status code
    switch (xhr.status) {
        case 200:
            content.innerHTML = '<b>Drink Ordered</b>';
            break;
        case 201:
            content.innerHTML = '<b>Drink Created</b>';
            break;
        case 204:
            content.innerHTML = '<b>Drink Updated</b>';
            break;
        case 400:
            content.innerHTML = '<b>Incomplete Order</b>';
            break;
        default:
            content.innerHTML = '<b>Resource Not Found</b>';
            break;
    }

    //parse response
    if (parseResponse) parseJSON(xhr, content);
};

var sendPost = function sendPost(e, drinkForm) {

    e.preventDefault();

    //grab forms url (action) and method
    var orderAction = drinkForm.getAttribute('action');
    var orderMethod = drinkForm.getAttribute('method');

    //grab name and age fields, needed for POST methods
    var nameField = drinkForm.querySelector('.nameField');
    var coffeeTypeField = drinkForm.querySelector('#coffeeTypeField');
    var roastField = drinkForm.querySelector('#roastField');
    var servingsField = drinkForm.querySelector('#servingsField');
    var milkField = drinkForm.querySelector('#milkField');
    var sugar = drinkForm.querySelector('#sugar');

    //create new Ajax request
    var xhr = new XMLHttpRequest();

    xhr.open(orderMethod, orderAction);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        return handleResponse(xhr, true);
    };

    var formData = 'name=' + nameField.value + '&coffeeType=' + coffeeTypeField.value + '&roast=' + roastField.value + '&servings=' + servingsField.value + '&milk=' + milkField.value + '&sugar=' + sugar.value;

    xhr.send(formData);

    return false;
};

var requestUpdate = function requestUpdate(e, checkOrderForm) {
    var url = checkOrderForm.getAttribute('action');
    var method = checkOrderForm.getAttribute('method');

    var nameField = checkOrderForm.querySelector('.nameField');

    var xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Accept', 'application/json');
    if (method == 'get') {
        xhr.onload = function () {
            return handleResponse(xhr, true);
        };
    } else {
        xhr.onload = function () {
            return handleResponse(xhr, false);
        };
    }

    xhr.send();

    e.preventDefault();
    return false;
};

var init = function init() {
    var drinkForm = document.querySelector('#drinkForm');
    var checkOrderForm = document.querySelector('#checkOrderForm');
    console.log("hello");
    var getOrders = function getOrders(e) {
        return requestUpdate(e, checkOrderForm);
    };
    var addOrder = function addOrder(e) {
        return sendPost(e, drinkForm);
    };

    checkOrderForm.addEventListener('submit', getOrders);
    drinkForm.addEventListener('submit', addOrder);
};

window.onload = init;
