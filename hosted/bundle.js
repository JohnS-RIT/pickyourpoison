'use strict';

//function for parsing responses from getOrdersJSON
var parseJSON = function parseJSON(xhr) {
    try {
        //parse json into obj
        var obj = JSON.parse(xhr.response);
        //object is real funky/finicky so turn into a string
        var stringObj = JSON.stringify(obj);

        //Start adding content to html of orderContent paragraph
        var orderContent = document.querySelector('#orderContent');
        orderContent.innerHTML = '<p><strong>~~Orders~~</strong><br>';

        //take stringified JSON and remove all the unecessary characters and fix formatting of others
        //Could have done some of this in values of form elements, but wanted to keep to coding standards
        stringObj = stringObj.replace('{"customers":', '');
        stringObj = stringObj.replaceAll("{", '');
        stringObj = stringObj.replaceAll("}", '');
        stringObj = stringObj.replaceAll('"', '');
        stringObj = stringObj.replaceAll(':', ','); //super important one, once this happens, all the words are split by commas
        stringObj = stringObj.replaceAll('name', 'Name');
        stringObj = stringObj.replaceAll('coffeeType', 'Coffee Type');
        stringObj = stringObj.replaceAll('pourOver', 'Pour Over');
        stringObj = stringObj.replaceAll('frenchPress', 'French Press');
        stringObj = stringObj.replaceAll('espresso', 'Espresso');
        stringObj = stringObj.replaceAll('coldBrew', 'Cold Brew');
        stringObj = stringObj.replaceAll('roast', 'Roast');
        stringObj = stringObj.replaceAll('blonde', 'Blonde');
        stringObj = stringObj.replaceAll('medium', 'Medium');
        stringObj = stringObj.replaceAll('french', 'French');
        stringObj = stringObj.replaceAll('decaf', 'Decaf');
        stringObj = stringObj.replaceAll('servings', 'Servings');
        stringObj = stringObj.replaceAll('milk', 'Milk');
        stringObj = stringObj.replaceAll('none', 'None');
        stringObj = stringObj.replaceAll('skim', 'Skim');
        stringObj = stringObj.replaceAll('whole', 'Whole');
        stringObj = stringObj.replaceAll('coconut', 'Coconut');
        stringObj = stringObj.replaceAll('almond', 'Almond');
        stringObj = stringObj.replaceAll('soy', 'Soy');
        stringObj = stringObj.replaceAll('oat', 'Oat');
        stringObj = stringObj.replaceAll('sugar', 'Sugar');
        stringObj = stringObj.replaceAll('true', 'Yes');
        stringObj = stringObj.replaceAll('false', 'No');

        //now that the string is all pretty, all the words are separated by commas so can use .split to make an array
        var stringArray = stringObj.split(',');
        var coffeeArray = [];

        //each drink order will have 13 indexes, and theres a pretty simple way to tell what indexes mean what
        for (var i = 0; i < stringArray.length; i++) {
            if (i % 13 != 0) {
                //if this is the first index of whatever order this is, then we don't actually care about it for display, just for json organization
                var evenOrOdd = i % 13;
                if (evenOrOdd % 2 != 0) {
                    //if it's odd, starting at index 1, then its a label (e.g roast type, coffee type)
                    orderContent.innerHTML += '<strong>' + stringArray[i] + ':</strong> ';
                } else {
                    //if it;s even, then its field info for each label (e.g decaf, espresso, etc)
                    orderContent.innerHTML += stringArray[i] + '<br>';

                    //when at the coffeeType field, add each orders type to an array
                    if (stringArray[i] == "Pour Over" || stringArray[i] == "French Press" || stringArray[i] == "Espresso" || stringArray[i] == "Cold Brew") {
                        coffeeArray.push(stringArray[i]);
                    }
                }
            } else {
                orderContent.innerHTML += '<br>';
            }
        }

        //If the array has no orders (which will actually have a length of 1), then inform the user that there are no orders to display
        if (stringArray.length == 1) {
            orderContent.innerHTML += 'No drinks placed yet!';
        }

        orderContent.innerHTML += '</p>'; //End the list of orders

        //If there were orders, add gifs based on coffeeType
        if (stringArray.length > 1) {
            addImages(coffeeArray);
        }
    } catch (e) {
        //While I haven't been able to break it anyways, since the parsing has been finisky, this just prevents the application from crashing
        return;
    }
};

//Function to set up requests from giphy for coffee related gifs
var addImages = function addImages(coffeeArray) {
    var GIPHY_KEY = "MNE5Ew0fJdetOKNdVD70LwF61ytF2XlG";

    //**BELOW ARE SPARE KEYS - if hit hourly limit you can change to any of these */
    //"3VyKARdddpBzFTuG7yX7m55fkNjIzpV6";
    //"MNE5Ew0fJdetOKNdVD70LwF61ytF2XlG";
    //"dc6zaTOxFJmzC";

    var url = "https://api.giphy.com/v1/gifs/search?api_key=" + GIPHY_KEY; //create beginnings or url for giphy request

    for (var i = 0; i < coffeeArray.length; i++) {
        var searchTerm = coffeeArray[i];

        searchTerm = encodeURIComponent(searchTerm);

        url += "&q=" + searchTerm; //add the search term which is coffeeType
        url += "&limit=20"; //do a limit of 20, then later randomly select one

        setTimeout(function () {
            //add a timeout for each request to help with giphy request rate limit
            var xhr = new XMLHttpRequest();
            xhr.onload = dataLoaded;
            xhr.onerror = dataError;
            xhr.open("GET", url);
            xhr.send();
        }, 250);
    }
};

//Function for once data from each request is loaded
var dataLoaded = function dataLoaded(e) {
    var xhr = e.target;

    var obj = JSON.parse(xhr.responseText);

    var results = obj.data;

    var result = results[Math.floor(Math.random() * 19)];
    var url = result.images.fixed_width_downsampled.url;

    //create div for each image
    var line = "<div class='result'><img src='";
    line += url;
    line += "' alt= '";
    line += result.id;
    line += "' /></div>";

    //add div to bigger div collection
    var imageDiv = document.querySelector("#drinkImages");
    var resultDiv = document.createElement('div');
    resultDiv.innerHTML = line;
    imageDiv.appendChild(resultDiv);
};

//function for handling responses
var handleResponse = function handleResponse(xhr) {
    var content = document.querySelector('#content');
    //check status code
    content.innerHTML = '';
    setTimeout(function () {
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
    }, 250);
};

var dataError = function dataError(e) {
    console.log("An error occurred");
};

var sendPost = function sendPost(e, drinkForm) {

    e.preventDefault();

    //grab forms url (action) and method
    var orderAction = drinkForm.getAttribute('action');
    var orderMethod = drinkForm.getAttribute('method');

    //grab fields needed for POST methods
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
        return handleResponse(xhr);
    };

    //Condense data from form
    var formData = 'name=' + nameField.value + '&coffeeType=' + coffeeTypeField.value + '&roast=' + roastField.value + '&servings=' + servingsField.value + '&milk=' + milkField.value + '&sugar=' + sugar.checked;

    xhr.send(formData);

    return false;
};

var requestUpdate = function requestUpdate(e, form) {
    var url = form.getAttribute('action');
    var method = form.getAttribute('method');

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.setRequestHeader('Accept', 'application/json');

    //Acts different depending on whether this is a request to go to the orders page or actually view said orders
    if (url == 'getOrdersJSON') {
        xhr.onload = function () {
            return parseJSON(xhr);
        };
    } else {
        xhr.onload = function () {
            return handleResponse(xhr);
        };
    }

    xhr.send();

    //Only want to prevent this when displaying the order list
    if (url == 'getOrdersJSON') {
        e.preventDefault();
        return false;
    }
};

var init = function init() {
    //Set up my many forms
    var drinkForm = document.querySelector('#drinkForm');
    var checkOrderForm = document.querySelector('#checkOrderForm');
    var goBackForm = document.querySelector('#goBackForm');
    var viewOrderForm = document.querySelector('#viewOrdersForm');

    //Try the first two forms, if it doesn't work it means the other page is open
    try {
        var getOrders = function getOrders(e) {
            return requestUpdate(e, checkOrderForm);
        };
        var addOrder = function addOrder(e) {
            return sendPost(e, drinkForm);
        };

        checkOrderForm.addEventListener('submit', getOrders);
        drinkForm.addEventListener('submit', addOrder);
    } catch (error) {
        //If the try failed, must be on the view order page so these are the right events
        var goBack = function goBack(e) {
            return requestUpdate(e, goBackForm);
        };
        var viewOrders = function viewOrders(e) {
            return requestUpdate(e, viewOrderForm);
        };

        goBackForm.addEventListener('submit', goBack);
        viewOrdersForm.addEventListener('submit', viewOrders);
    }
};

window.onload = init;
