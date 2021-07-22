
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
}