

// session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"));

let container = document.getElementById("container");

if (!saveToken) {
    // alert("Please Log in First")
    container.innerHTML = null;
    container.innerHTML = `<h3> Please Log in First</h3>`
}


var wishlistCounter = document.getElementById("wishlistCounter");
var cartCounter = document.getElementById("cartCounter");
// console.log(cartCounter);

// getting wishlist and cart length by this functions
window.onscroll = () => { fetchCartLength(), fetchWishlistLength() }
fetchCartLength(), fetchWishlistLength()

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
            console.log(err);
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
            console.log(err);
        })
};

window.addEventListener("load", () => fetchData())

function fetchData() {
    fetch(`https://moral-riddle-2098-project-server.onrender.com/myorder/`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    }).then((res) => res.json()).then((res) => {
        // console.log(res)
        if (res.orders.length == 0) {
            container.innerHTML = `<h3>Orders Not Available</h3>`
            return;
        }
        let orders = [];
        for (let i = 0; i < res.orders.length; i++) {
            for (let j = 0; j < res.orders[i].orders.length; j++) {
                // console.log(res.orders[i]);
                res.orders[i].orders[j].status = res.orders[i].status;
                res.orders[i].orders[j].date = res.orders[i].date;
                orders.push(res.orders[i].orders[j])
            }
        }
        console.log(orders);
        // let data = orders.flat();
        getCardList(orders)
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
        let card = getCard(element._id, element.title, element.rating, element.price, element.img, element.date, element.status);
        cardList.append(card)
    });
    console.log("Brand", brand);
    console.log("category", category);
    return cardList;
}
function getCard(dataId, title, rating, price, avatar, date, status) {
    // console.log({dataId:dataId, title:title,rating:rating, price:price, avatar:avatar, date:orderDate, orderStatus:status});
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

    // let priceCard = document.createElement("h4");
    // priceCard.classList = "card_item"
    // priceCard.classList = "card_price";
    // priceCard.innerText = `₹ ${price}`;

    // let buttonDiv = document.createElement("div");
    // buttonDiv.classList = "card_button";

    let orderStatus = document.createElement("h5");
    orderStatus.classList = "card_item";
    orderStatus.classList = "card_addCart";
    orderStatus.id = dataId

    orderStatus.innerHTML = `Order Status: ${status}`

    let orderDate = document.createElement("h5");
    orderDate.classList = "card_item";
    orderDate.classList = "card_addCart";
    orderDate.id = dataId

    orderDate.innerHTML = `Order Date: ${date}`

    // buttonDiv.append(orderStatus)
    cardBody.append(ratingCard, nameCard, orderStatus, orderDate)

    imageCard.append(image)

    card.append(imageCard, cardBody)

    return card;
};
