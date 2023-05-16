

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
            console.log(res.cart);
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

window.addEventListener("load", () => {
    fetchData();
})

function fetchData() {
    fetch(`https://moral-riddle-2098-project-server.onrender.com/wishlist/`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    }).then((res) => res.json()).then((res) => {
        console.log(res.wishlist)
        if (res.wishlist.length == 0) {
            container.innerHTML = `<h3>Your Wishlist is Empty.</h3>`
            return;
        }
        getCardList(res.wishlist)
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

    let cartButton = document.createElement("button");
    cartButton.classList = "card_item";
    cartButton.classList = "card_addCart";
    cartButton.setAttribute("data-id", dataId);
    cartButton.id=dataId;

    cartButton.innerHTML = `<i data-id=${dataId} class="fa-solid fa-cart-shopping fa-bounce"></i> Add To Cart`
    cartButton.addEventListener("click", (e) => {
        let cartObject = {
            "title": title,
            "brand": brand,
            "category": category,
            "rating": rating,
            "price": price,
            "img": avatar,
            "quantity": 1,
            "prodID": e.target.dataset.id
        };
        console.log(cartObject);
        // console.log(saveToken.token);
        fetch(`https://moral-riddle-2098-project-server.onrender.com/wishlist/delete/${e.target.dataset.id}`, {
            method: "DELETE",
            headers: {
                "authorization": `Bearer ${saveToken.token}`
            }
        }).then((res) => res.json()).then((res) => {
            // console.log(res)
            alert("Product is added to cart.")
        }).catch((err) => console.log(err))
        fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/add/`, {
            method: "POST",
            headers: {
                'Content-type': "application/json",
                "authorization": `Bearer ${saveToken.token}`
            },
            body: JSON.stringify(cartObject)
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            fetchData();
            fetchCartLength(), fetchWishlistLength()
        })
    })
    let removeButton = document.createElement("button");
    removeButton.classList = "card_item";
    removeButton.classList = "card_addWishlist";
    removeButton.setAttribute("data-id",dataId)
    removeButton.innerHTML = `Remove`
    removeButton.addEventListener("click", (e) => {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/wishlist/delete/${e.target.dataset.id}`, {
            method: "DELETE",
            headers: {
                "authorization": `Bearer ${saveToken.token}`
            }
        }).then((res) => res.json()).then((res) => {
            console.log(res)
            alert(res.msg)
            fetchData();
            fetchCartLength(), fetchWishlistLength()
        }).catch((err) => console.log(err))
    })
    buttonDiv.append(cartButton, removeButton)

    cardBody.append(ratingCard, nameCard, priceCard, buttonDiv)

    imageCard.append(image)

    card.append(imageCard, cardBody)

    return card;
};
