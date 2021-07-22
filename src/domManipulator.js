const order = {
    dish: {},
    beverage: {},
    dessert: {}
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
    order[key] = formatedData;
}


/** 
 * Verify if the order is a valid one, with all the fields filled
 * @return {boolean} true if all fields are filled, false otherwise
 */
function isOrderValid() {
    for(let key in order) {
        if(!order[key].name || !order[key].price) return false;
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
function parcePriceToString(priceInt) {
    const stringedInt = toString(priceInt);
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
    const scroller = document.getElementById(wichScroller);
    const cards = scroller.getElementsByClassName("card");
    for(let i = 0; i < cards.length; i++) {
        if(cards[i].id) {
            cards[i].id = null;
        }
    }
    
    selected.id = "card-selected";
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

    const selectedCard = document.getElementById("card-selected");
    const name = selectedCard.querySelector("h3").textContent;
    const price = selectedCard.getElementsByClassName("dish-price")[1].textContent;

    const data = {
        name: name,
        price: price
    }

    setOrderInfo(key, data)
}


/** 
 * it enables the button if customer already chosen his dishes
 * @return {void} void 
 */
function buttonModeSwitcher() {
    const isOrderAlreadyValid = isOrderValid();

    if(isOrderAlreadyValid) {
        const disabledButton = document.getElementById("disabled");
        disabledButton.disabled = false;
        disabledButton.id = "enabled";
        disabledButton.textContent = "Fechar Pedido";
    }

}