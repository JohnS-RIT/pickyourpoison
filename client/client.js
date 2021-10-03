//function for parsing responses
const parseJSON = (xhr, content) => {
    //parse response, 204 status will have empty obj
    try {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);

        //add any messages to screen
        if (obj.message) {
            const p = document.createElement('p');
            p.textContent = `Message: ${obj.message}`;
            content.appendChild(p);
        }

        //add any users (if in response) to screen
        if (obj.users) {
            const userList = document.createElement('p');
            const users = JSON.stringify(obj.users);
            userList.textContent = users;
            content.appendChild(userList);
        }
    }
    catch (e) {
        return;
    }
};

//function for handling responses
const handleResponse = (xhr, parseResponse) => {
    const content = document.querySelector('#content');
    //check status code
    switch (xhr.status) {
        case 200:
            content.innerHTML = `<b>Drink Ordered</b>`;
            break;
        case 201:
            content.innerHTML = `<b>Drink Created</b>`;
            break;
        case 204:
            content.innerHTML = `<b>Drink Updated</b>`;
            break;
        case 400:
            content.innerHTML = `<b>Incomplete Order</b>`;
            break;
        default:
            content.innerHTML = `<b>Resource Not Found</b>`;
            break;
    }

    //parse response
    if (parseResponse) parseJSON(xhr, content);
};

const sendPost = (e, drinkForm) => {

    e.preventDefault();

    //grab forms url (action) and method
    const orderAction = drinkForm.getAttribute('action');
    const orderMethod = drinkForm.getAttribute('method');

    //grab name and age fields, needed for POST methods
    const nameField = drinkForm.querySelector('.nameField');
    const coffeeTypeField = drinkForm.querySelector('#coffeeTypeField');
    const roastField = drinkForm.querySelector('#roastField');
    const servingsField = drinkForm.querySelector('#servingsField');
    const milkField = drinkForm.querySelector('#milkField');
    const sugar = drinkForm.querySelector('#sugar');

    //create new Ajax request
    const xhr = new XMLHttpRequest();

    xhr.open(orderMethod, orderAction);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr, true);

    const formData = `name=${nameField.value}&coffeeType=${coffeeTypeField.value}&roast=${roastField.value}&servings=${servingsField.value}&milk=${milkField.value}&sugar=${sugar.value}`;
    
    
    xhr.send(formData);

    return false;
};


const requestUpdate = (e, checkOrderForm) => {
    const url = checkOrderForm.getAttribute('action');
    const method = checkOrderForm.getAttribute('method');

    const nameField = checkOrderForm.querySelector('.nameField');

    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Accept', 'application/json');
    if (method == 'get') {
        xhr.onload = () => handleResponse(xhr, true);
    } else {
        xhr.onload = () => handleResponse(xhr, false);
    }

    xhr.send();

    e.preventDefault();
    return false; 
};

const init = () => {
    const drinkForm = document.querySelector('#drinkForm');
    const checkOrderForm = document.querySelector('#checkOrderForm');
    console.log("hello");
    const getOrders = (e) => requestUpdate(e, checkOrderForm);
    const addOrder = (e) => sendPost(e, drinkForm);

    checkOrderForm.addEventListener('submit', getOrders);
    drinkForm.addEventListener('submit', addOrder);
};

window.onload = init;