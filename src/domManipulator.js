//#################################################################################################
//                                  DATA ORGANIZERS:
//#################################################################################################


const _ORDER = {
    dish: {},
    beverage: {},
    dessert: {}
}

const _CUSTOMER = {
    name: null,
    address: null
}

/** 
 * Inserts and update data into order informatios
 * @param {String} key wich data should be added (dish, beverage, dessert or customer)
 * @param {Object} data the data that will be added 
 * @return {void} void  
 */
function setOrderInfo(key, data) {
    const { name, price } = data;
    const intergerPrice = parsePriceToInterger(price);
    const formatedData = {
        name: name,
        price: intergerPrice
    }
    _ORDER[key] = formatedData;
}


/** 
 * Verify if the order is a valid one, with all the fields filled
 * @return {boolean} true if all fields are filled, false otherwise
 */
function isOrderValid() {
    for(let key in _ORDER) {
        if(!_ORDER[key].name || !_ORDER[key].price) return false;
    }
    return true;
}


/** 
 * Turns a string into an integer
 * @example parsePriceToInterger("12,99"); // 1299
 * @param {String} priceString the string that will be transformed
 * @return {Number} An interger that represents the price in cents
 */
function parsePriceToInterger(priceString) {
    const arrayPriceString = priceString.split(",");
    const priceStringInCents = arrayPriceString[0] + arrayPriceString[1];
    const priceInCents = parseInt(priceStringInCents);
    return priceInCents;
}


/**
 * Turns a interger into a string that represents a price
 * @example parsePriceInString(1299); // "12,99"
 * @param priceInt the interger that will be transformed
 * @return {String} the formated price
 */
function parsePriceToString(priceInt) {
    const stringedInt = priceInt.toString();
    let centsSlice = ""; // two last numbers represent the cents
    let intSlice = ""; // the other numbers represents the interger part of the value

    for(let i = 0; i < stringedInt.length; i++) {
        if(i >= stringedInt.length - 2) {
            centsSlice += stringedInt[i]
        } else {
            intSlice += stringedInt[i]
        }
    }

    return intSlice + "," + centsSlice;
}



// ###############################################################################################
//                                      DOM MANIPULATORS:                  
// ###############################################################################################




/** 
 * Function that switches state of div.card between selected and unselected, where a 
 * green border is applied in selected state.
 * @param {Node} selected the element that called the function, therefore shall be set as selected
 * @param {String} wichScroller id name of the scroller that must by iterated over
 * @return void
 */
function toggleSelectedMode(selected, wichScroller) {
    // Verify if there's a selected card already, changing it to unselected
    const scroller = document.querySelector("#" + wichScroller);
    const cards = scroller.getElementsByClassName("card");
    for(let i = 0; i < cards.length; i++) {
        if(cards[i].id) {
            cards[i].id = null;
        }
    }
    
    selected.id = wichScroller + "-" +"card-selected";
    sendDataToOrderer(wichScroller);
    buttonModeSwitcher()
}


/** 
 * Foward cleaned data to the setter method
 * @param wichScrollerIsDataFrom the class name of the scroller where the data come from, it also indentify where the data should go
 * @return {void} void
 */
function sendDataToOrderer(wichScrollerIsDataFrom) {
    const key = wichScrollerIsDataFrom.split("-")[0];

    const selectedCard = document.getElementById(wichScrollerIsDataFrom + "-" + "card-selected");
    const name = selectedCard.querySelector("h3").textContent;
    const price = selectedCard.getElementsByClassName("dish-price")[1].textContent;

    const data = {
        name: name,
        price: price
    }

    setOrderInfo(key, data)
}


/** 
 * it enables the button if customer already chosen his three dishes
 * @return {void} void 
 */
function buttonModeSwitcher() {
    const isOrderAlreadyValid = isOrderValid();
    const disabledButton = document.getElementById("disabled");

    if(isOrderAlreadyValid && disabledButton) { // prevents from trying set to enabled when already is
        disabledButton.disabled = false;
        disabledButton.id = "enabled";
        disabledButton.textContent = "Fechar Pedido";
    }
}



// ###############################################################################################
//                                      ORDER FINISHERS                  
// ###############################################################################################

/** 
 * Generates a proper link based in customer's selections
 * @return {String} custom link for rediecting to WhatApp
 */
function generateLinkToWhatsApp() {
    const baseURL = "https://wa.me/5583996231204";

    const { dish, beverage, dessert } = _ORDER;
    const totalOrderPrice = dish.price + beverage.price + dessert.price;
    const parsedTotalOrderPrice = parsePriceToString(totalOrderPrice)

    const message = `Olá, gostaria de fazer o pedido:\n - Prato: ${_ORDER.dish.name}\n - Bebida: ${_ORDER.beverage.name}\n - Sobremesa: ${_ORDER.dessert.name}\nTotal: R$ ${parsedTotalOrderPrice} \n\n Nome: ${_CUSTOMER["name"]}\nEndereço: ${_CUSTOMER["address"]}`; 
    const encodedMessage = encodeURIComponent(message);
    const finalURL = baseURL + "?text=" + encodedMessage;

    return finalURL;
}


/** 
 * Show pop up in screen and inserts the relevant data in it
 * @return {void} void
 */
function confirmationPopUpActivator() {
    const { dish, beverage, dessert } = _ORDER;
    const totalOrderPrice = parsePriceToString(dish.price + beverage.price + dessert.price);
    const orderedData = [
        dish.name, dish.price, beverage.name,
        beverage.price, dessert.name, dessert.price,
        "TOTAL", "R$ " + totalOrderPrice,
    ];

    const popupContainer = document.querySelector("#popup-container");
    const spans = document.querySelectorAll(".span");

    for(let i = 0; i < spans.length; i++) {
        if(typeof(orderedData[i]) === "number") {
            spans[i].textContent = parsePriceToString(orderedData[i]);
        } else {
            spans[i].textContent = orderedData[i];
        }
    }

    resetPopUpState();
    popupContainer.className = null;
}


/** 
 * Simply reset the state of popup, otherwise, when the client cancel the order to choose
 * something else, the popup wouldn't show the chosen items again for confirmation
 * @return {void} void
 */ 
function resetPopUpState() {
    const orderedItems = document.querySelector("#ordered-items");
    orderedItems.className = null;

    document.querySelector("#address-input-container").className = "hidden"; // hides address inputs
    document.querySelector("#address-confirmation-button").className = "hidden"; // hides address confirmation button
    document.querySelector("#order-confirmation-button").className = "confirmation-button"; // enable confirmation button
    document.querySelector(".popup").style.backgroundColor = "#32b72f"; // var(--stGreen) reset popup color
}


// Nem precisa documentar, mais auto explicativo que isso é impossível kkkkkkk
function hidePopUp() {
    const popupContainer = document.querySelector("#popup-container");
    popupContainer.className = "hidden";
}


/** 
 * Activate the customer data colector in the popup
 * @return {void} void
 */
function askForAddress() {
    const orderedItems = document.querySelector("#ordered-items");
    const addressInput =document.querySelector("#address-input-container");

    // goes to the next stage
    orderedItems.className = "hidden";
    addressInput.className = null;

    // hides the first button and shows the one that will handle the address data
    document.querySelector("#order-confirmation-button").className = "hidden";
    document.querySelector("#address-confirmation-button").className = "confirmation-button";
}


/**
 * Just verify if the data is null or an empty string 
 * @param {String} name customer's name
 * @param {String} address customer's address
 * @return {boolean} true if the provided data is valid, false otherwise
 */
function customerProvidedDataValidator(name, address) {
    if(!name || !address || name === "" || address === "") return false;
    return true;
}


/**
 * Set the inserted data from client, with there is already some data, they are updated
 * @return {void} void
 */
function setCustomerData(name, address) {
    _CUSTOMER["name"] = name;
    _CUSTOMER["address"] = address;
}


/** 
 * Finishes the purchase and redirect customer to whatsapp
 * @return {void} void
 */
function purchaseFinisher() {
    console.log("in")
    const customerName = document.querySelector("#customer-name-input").value;
    const customerAddress = document.querySelector("#customer-address-input").value;
    console.log(customerName);
    console.log(customerAddress);

    if(customerProvidedDataValidator(customerName, customerAddress)) {
        setCustomerData(customerName, customerAddress);
    } else {
        document.querySelector("#popup-title").textContent = "Insira dados válidos";
        document.querySelector(".popup").style.backgroundColor = "#ad001d";
        return; // para a função
    }

    const whatsappRedirectionLink = generateLinkToWhatsApp();
    window.location.replace(whatsappRedirectionLink); // redirection via JS
}