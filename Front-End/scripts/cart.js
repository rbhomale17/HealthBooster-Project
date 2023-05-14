
    // session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"));

let container = document.getElementById("container");
let cartStutus = document.getElementById("cart");
let originalprice = document.getElementById('originalprice');
let savings = document.getElementById("savings");
let totalPrice = document.getElementById("total");

if (!saveToken) {
    // alert("Please Log in First")
    // console.log(cartStutus);
    cartStutus.innerHTML = null;
    cartStutus.innerHTML = `<h3> Please Log in First</h3>`
}

var wishlistCounter = document.getElementById("wishlistCounter");
var cartCounter = document.getElementById("cartCounter");
var cartValue = document.getElementById("allPlaceOrderButton_cartValue");
var cartQuntity = document.getElementById("allPlaceOrderButton_cartQuntity");
// console.log(cartValue )
// console.log("********8");

// getting wishlist and cart length by this functions
window.onscroll = function(){fetchCartLength(), fetchWishlistLength()}
fetchCartLength(), fetchWishlistLength();


function fetchCartLength() {
    // console.log("HIII");
    fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    })
        .then((res) => res.json()).then((res) => {
            // console.log(res.cart);
            let length = res.cart.length;
            cartCounter.innerText = length;
        }).catch((err) => {
            // console.log(err);
        })
};


function fetchWishlistLength() {
    // console.log("HIII");
    fetch(`https://moral-riddle-2098-project-server.onrender.com/wishlist/`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    })
        .then((res) => res.json()).then((res) => {
            // console.log(res.wishlist);
            let length = res.wishlist.length;
            wishlistCounter.innerText = length;
        }).catch((err) => {
            // console.log(err);
        })
};

window.addEventListener("load", () => {
    fetchData();
})
// console.log(cartValue,cartQuntity);
function fetchData() {
    fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    }).then((res) => res.json()).then((res) => {
        let value = 0;
        let qty = 0;
        for (let i = 0; i < res.cart.length; i++) {
            value += Math.ceil((res.cart[i].price * res.cart[i].quantity));
            qty += res.cart[i].quantity;
        }
        // console.log(value,qty)
        // console.log(cartValue,cartQuntity);
        originalprice.textContent = `₹ ${value}`;
        savings.textContent = `₹ ${value*0.15}`;
        totalPrice.textContent = `₹ ${value - (value*0.15)}`;
        
        cartValue.innerText = `Total Cart Value : ₹ ${value}`;
        cartQuntity.innerText = `Total Cart Quntity : ${qty}`
        getCardList(res.cart)
    }).catch((err) => console.log(err));
}


// getCardList(product)
function getCardList(data) {
    let brand = {};
    let category = {};
    container.innerHTML = null;
    let cardList = document.createElement("div");
    cardList.classList = "card-list";
    container.append(cardList);
    // console.log(data);
    data.forEach((element) => {
        if (brand[element.brand] == undefined) {
            brand[element.brand] = 1;
        } else {
            brand[element.brand]++;
        }
        if (category[element.category] == undefined) {
            category[element.category] = 1;
        } else {
            category[element.category]++;
        }
        let card = getCard(element._id, element.title, element.brand, element.category, element.rating, element.price, element.img, element.quantity);
        cardList.append(card)
    });
    console.log("Brand", brand);
    console.log("category", category);
    return cardList;
}
function getCard(dataId, title, brand, category, rating, price, avatar, quantity) {
    // console.log({dataId:dataId, title:title, brand:brand, category:category, rating:rating, price:price, avatar:avatar, quantity:quantity});
    let card = document.createElement("div");
    card.classList = "card";
    card.setAttribute("data-id", dataId);
    // card.innerText=username;

    let imageCard = document.createElement("div");
    imageCard.classList = "card_img";

    let image = document.createElement("img");
    // console.log(avatar);
    image.src = avatar;
    image.setAttribute("alt", `${title} image`);

    let cardBody = document.createElement("div");
    cardBody.classList = "card_body";

    let nameCard = document.createElement("h4");
    nameCard.classList = "card_item";
    nameCard.classList = "card_title";
    nameCard.innerText = `${title}`;

    let ratingCard = document.createElement("h4");
    ratingCard.classList = "card_item"
    ratingCard.classList = "card_rating";
    ratingCard.innerHTML = `<i class="fa-sharp fa-solid fa-star" style="color: #212121;"></i> ${rating}`
    // `Rating: ${rating}  Price: ${price}`;

    let priceCard = document.createElement("h4");
    priceCard.classList = "card_item"
    priceCard.classList = "card_price";
    priceCard.innerText = `₹ ${price}`;

    let buttonDiv = document.createElement("div");
    buttonDiv.classList = "card_button";

    let quantityDecrease = document.createElement("button");
    quantityDecrease.classList = "card_item";
    quantityDecrease.classList = "card_addCart";
    quantityDecrease.setAttribute("data-id", dataId)

    quantityDecrease.innerHTML = `<i data-id=${dataId} class="fa-solid fa-minus" style="color: #141414;"></i>`

    let itemQuntinty = document.createElement("p");
    itemQuntinty.classList = "card-quntity"
    itemQuntinty.textContent = quantity;

    if (quantity > 1) {
        quantityDecrease.addEventListener("click", (e) => {
            let newQuntityObject = {
                quantity: `${quantity - 1}`
            }
            // console.log(newQuntityObject);
            const id = e.target.dataset.id;
            fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/update/${id}`, {
                method: "PATCH",
                headers: {
                    "authorization": `Bearer ${saveToken.token}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify(newQuntityObject)
            }).then((res) => res.json()).then((res) => {
                fetchData();
                // console.log(res.msg)
            }).catch((err) => console.log(err))
        })
    }

    let quantityIncrease = document.createElement("button");
    quantityIncrease.classList = "card_item";
    quantityIncrease.classList = "card_addCart";
    quantityIncrease.id = dataId

    quantityIncrease.innerHTML = `<i data-id=${dataId} class="fa-solid fa-plus" style="color: #020a17;"></i>`

    quantityIncrease.addEventListener("click", (e) => {
        let newQuntityObject = {
            quantity: `${quantity + 1}`
        }
        // console.log(newQuntityObject);
        const id = e.target.dataset.id;
        fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/update/${id}`, {
            method: "PATCH",
            headers: {
                "authorization": `Bearer ${saveToken.token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(newQuntityObject)
        }).then((res) => res.json()).then((res) => {
            fetchData();
            // console.log(res.msg)
        }).catch((err) => console.log(err))
    })

    let removeButton = document.createElement("button");
    removeButton.classList = "card_item";
    removeButton.classList = "card_addWishlist";
    removeButton.setAttribute("data-id", dataId);
    removeButton.innerHTML = `<i data-id=${dataId} class="fa-solid fa-trash fa-fade" style="color: #010813;"></i>`
    removeButton.addEventListener("click", (e) => {
        let id = e.target.dataset.id
console.log(id);
        fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/delete/${id}`, {
            method: "DELETE",
            headers: {
                "authorization": `Bearer ${saveToken.token}`
            }
        }).then((res) => res.json()).then((res) => {
            alert(res.msg)
            console.log(res.msg)
            fetchData()
            console.log("HIIII")
            fetchCartLength();
            fetchWishlistLength();
        }).catch((err)=>{
            console.log(err)
        })
    })
    buttonDiv.append(quantityDecrease, itemQuntinty, quantityIncrease, removeButton)

    //     let quantityCard = document.createElement("h5");
    //     quantityCard.classList = "card_item"
    //     quantityCard.classList = "card_quantity";
    //     quantityCard.innerText = `Out Of Stock`;
    //     // quantityCard.innerHTML = `2`

    cardBody.append(ratingCard, nameCard, priceCard, buttonDiv)

    imageCard.append(image)

    card.append(imageCard, cardBody)

    return card;
};

