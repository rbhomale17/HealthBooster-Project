window.onscroll = function () { fetchCartLength(), fetchWishlistLength() };

// session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"));
//  let container = document.getElementById("container");

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


// fetching Session Storage 
var saveToken = JSON.parse(sessionStorage.getItem("token")) || {};

// category things
let vital = document.getElementById("vital");
let biotin = document.getElementById("biotin");
let fitness = document.getElementById("fitness");
let massGainer = document.getElementById("massGainer");
let proteins = document.getElementById("proteins");
let instrument = document.getElementById("instrument");

// Brand things
let BPI = document.getElementById("BPI");
let Beurer = document.getElementById("Beurer");
let DrMorepen = document.getElementById("Dr. Morepen");
let HealthKart = document.getElementById("HealthKart");
let MBFuelOne = document.getElementById("MB Fuel One");
let MuscleBlaze = document.getElementById("MuscleBlaze");
let Onetouch = document.getElementById("Onetouch");

// controll button
let ApplyButton = document.getElementById("applyfilter");
let removefilter = document.getElementById("removefilter");



let c1; let c2; let c3; let c4; let c5; let c6;
let b1; let b2; let b3; let b4; let b5; let b6; let b7;
// let rating = undefined; 
// let price = undefined;
ApplyButton.addEventListener("click", () => {
    // category
    (vital.checked) ? c1 = vital.value : undefined;
    (biotin.checked) ? c2 = biotin.value : undefined;
    (fitness.checked) ? c3 = fitness.value : undefined;
    (massGainer.checked) ? c4 = massGainer.value : undefined;
    (instrument.checked) ? c5 = instrument.value : undefined;
    (proteins.checked) ? c6 = proteins.value : undefined;
    // brand
    (BPI.checked) ? b1 = BPI.value : undefined;
    (Beurer.checked) ? b2 = Beurer.value : undefined;
    (DrMorepen.checked) ? b3 = DrMorepen.value : undefined;
    (HealthKart.checked) ? b4 = HealthKart.value : undefined;
    (MBFuelOne.checked) ? b5 = MBFuelOne.value : undefined;
    (MuscleBlaze.checked) ? b6 = MuscleBlaze.value : undefined;
    (Onetouch.checked) ? b7 = Onetouch.value : undefined;

    let rating = document.getElementById("rating").value;
    // console.log(rating);
    let price = document.getElementById("price").value;
    // console.log(price);

    fetchData(c1, c2, c3, c4, c5, c6, b1, b2, b3, b4, b5, b6, b7, rating, price)
    c1 = undefined, c2 = undefined, c3 = undefined, c4 = undefined, c5 = undefined, c6 = undefined;
    b1 = undefined, b2 = undefined, b3 = undefined, b4 = undefined, b5 = undefined, b6 = undefined, b7 = undefined;
    rating = undefined; price = undefined;
});

removefilter.addEventListener("click", () => {
    c1 = undefined, c2 = undefined, c3 = undefined, c4 = undefined, c5 = undefined, c6 = undefined;
    b1 = undefined, b2 = undefined, b3 = undefined, b4 = undefined, b5 = undefined, b6 = undefined, b7 = undefined;
    rating = undefined;
    // e.preventDefault()
    fetchData();//c1, c2, c3, c4, c5, c6, b1, b2, b3, b4, b5, b6, b7, rating
    document.location.reload();
})

window.addEventListener("load", () => {
    fetchData()
})
let page = 1; ProductLimit = 12
function createbtn(page, id, query) {
    let button = document.createElement("button");
    button.setAttribute("data-id", id);
    button.textContent = page;
    button.addEventListener("click", (e) => {
        page = e.target.dataset.id;
        fetchDataAfterPagination(page, query)
        // console.log(e.target.dataset.id,query)
    })
    return button
}
function fetchDataAfterPagination(page, query) {
    // console.log(page);
    fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?page=${page}&limit=${ProductLimit}&${query}`).then((res) => res.json()).then((res) => {
        // console.log(res.products);
        getCardList(res.products)
    })
}

function fetchData(c1, c2, c3, c4, c5, c6, b1, b2, b3, b4, b5, b6, b7, rating, price) {
    // console.log(!c1 && !c2 && !c3 && !c4 && !c5 && !c6);
    // pagination
    let pagination = document.getElementById("pagination");

    if (!c1 && !c2 && !c3 && !c4 && !c5 && !c6 && !b1 && !b2 && !b3 && !b4 && !b5 && !b6 && !b7 && !rating && !price) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, ``))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    } else if (rating && (!b1 && !b2 && !b3 && !b4 && !b5 && !b6 && !b7 && !c1 && !c2 && !c3 && !c4 && !c5 && !c6 && !price)) {
        // console.log(b1, b2, b3, b4, b5, b6, b7, rating, price);
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?rating=${rating}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `rating=${rating}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
        }).catch((err) => {
            console.log(err);
        });
    }
    else if ((c1 || c2 || c3 || c4 || c5 || c6) && (!b1 && !b2 && !b3 && !b4 && !b5 && !b6 && !b7) && (!rating) && !price) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            //console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    } else if ((b1 || b2 || b3 || b4 || b5 || b6 || b7) && (!c1 && !c2 && !c3 && !c4 && !c5 && !c6) && (!rating) && !price) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    }
    else if ((c1 || c2 || c3 || c4 || c5 || c6 || rating) && (!b1 && !b2 && !b3 && !b4 && !b5 && !b6 && !b7 && !price)) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}&rating=${rating}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}&rating=${rating}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    } else if ((price || rating) && (!b1 && !b2 && !b3 && !b4 && !b5 && !b6 && !b7 && !c1 && !c2 && !c3 && !c4 && !c5)) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?rating=${rating}&price=${price}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `rating=${rating}&price=${price}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    }
    else if ((rating || b1 || b2 || b3 || b4 || b5 || b6 || b7) && (!c1 && !c2 && !c3 && !c4 && !c5 && !c6 && !price)) {
        // console.log(b1, b2, b3, b4, b5, b6, b7, rating);
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?rating=${rating}&brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `rating=${rating}&brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    }
    else if ((rating || b1 || b2 || b3 || b4 || b5 || b6 || b7 || price) && (!c1 && !c2 && !c3 && !c4 && !c5 && !c6)) {
        console.log(b1, b2, b3, b4, b5, b6, b7, rating, "XXX", price);
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}&price=${price}&rating=${rating}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}&price=${price}&rating=${rating}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    }
    else if ((c1 || c2 || c3 || c4 || c5 || c6 || price) && (!b1 && !b2 && !b3 && !b4 && !b5 && !b6 && !b7 && !rating)) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}&price=${price}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}&price=${price}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    } else if ((price || b1 || b2 || b3 || b4 || b5 || b6 || b7) && (!c1 && !c2 && !c3 && !c4 && !c5 && !c6 && !rating)) {
        // console.log(b1, b2, b3, b4, b5, b6, b7, rating);
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?price=${price}&brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `price=${price}&brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    }
    else if (c1 || c2 || c3 || c4 || c5 || c6 || b1 || b2 || b3 || b4 || b5 || b6 || b7 || rating || price) {
        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/?category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}&brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}&rating=${rating}&price=${price}`).then((res) => res.json()).then((res) => {
            let length = res.products.length;
            // console.log(page)
            let total = Math.ceil(length / 12);
            pagination.innerHTML = null;
            for (let i = 1; i <= total; i++) {
                pagination.append(createbtn(i, i, `category=${c1}&category=${c2}&category=${c3}&category=${c4}&category=${c5}&category=${c6}&brand=${b1}&brand=${b2}&brand=${b3}&brand=${b4}&brand=${b5}&brand=${b6}&brand=${b7}&rating=${rating}&price=${price}`))
            }
            let diff = length - 12;
            let arr = res.products.slice(diff)
            getCardList(arr)
            // getCardList(res.products)
        }).catch((err) => {
            console.log(err);
        });
    }
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

    // let brandCard = document.createElement("h4");
    // brandCard.classList = "card_item"
    // brandCard.classList = "card_description";
    // brandCard.innerHTML = `Brand:${brand} Catgory: ${category}`;

    // let categoryCard = document.createElement("div");
    // categoryCard.classList = "card_item"
    // categoryCard.classList = "card_description";
    // categoryCard.innerText = category;

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
    cartButton.setAttribute("data-id",dataId);
    cartButton.id=dataId;

    if (quantity !== 0) {

        cartButton.innerHTML = `<i data-id=${dataId} class="fa-solid fa-cart-shopping fa-bounce"></i> Add To Cart`
        cartButton.addEventListener("click", (e) => {
            console.log(1);
            fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/`, {
                method: "GET",
                headers: {
                    'Content-type': "application/json",
                    "authorization": `Bearer ${saveToken.token}`
                }
            }).then((res) => res.json()).then((res) => {
                console.log(res.cart);
                console.log(2);
                let sameProductFlag = false;
                if (res.cart.length !== 0) {
                    for (let i = 0; i < res.cart.length; i++) {
                        // console.log(e.target.id ,res.cart[i].prodID,e.target.id == res.cart[i].prodID);
                        // console.log((res.cart[i] == undefined) , (e.target.id !== res.cart[i].prodID), res.cart.length==0);
                        if (e.target.id !== res.cart[i].prodID) {
                            sameProductFlag = true;
                            // console.log((res.cart[i] == undefined));
                            // console.log((e.target.id !== res.cart[i].prodID));
                            // console.log(res.cart.length == 0);
                            // console.log(3);
                        }else{
                            sameProductFlag = false;
                            break;
                        }
                    }
                    if (sameProductFlag) {
                        let cartObject = {
                            "title": title,
                            "brand": brand,
                            "category": category,
                            "rating": rating,
                            "price": price,
                            "img": avatar,
                            "quantity": 1,
                            "prodID": e.target.id
                        };
                        // console.log(cartObject);
                        // console.log(saveToken.token);
                        fetch(`https://moral-riddle-2098-project-server.onrender.com/products/updateAfterAddCart/${e.target.id}`, {
                            method: "PATCH",
                            headers: {
                                'Content-type': "application/json"
                            },
                            body: JSON.stringify({ quantity: quantity - 1 })
                        }).then((res) => res.json()).then((res) => console.log(res)).catch((err) => console.log(err))
                        fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/add/`, {
                            method: "POST",
                            headers: {
                                'Content-type': "application/json",
                                "authorization": `Bearer ${saveToken.token}`
                            },
                            body: JSON.stringify(cartObject)
                        }).then((res) => res.json()).then((res) => {
                            console.log(res);
                            alert(res.msg);
                            fetchCartLength(), fetchWishlistLength();
                        })
                    }else{
                        alert("Product is already Added to Cart.");
                    }
                } else {
                    let cartObject = {
                        "title": title,
                        "brand": brand,
                        "category": category,
                        "rating": rating,
                        "price": price,
                        "img": avatar,
                        "quantity": 1,
                        "prodID": e.target.id
                    };
                    // console.log(cartObject);
                    // console.log(saveToken.token);
                    fetch(`https://moral-riddle-2098-project-server.onrender.com/products/updateAfterAddCart/${e.target.id}`, {
                        method: "PATCH",
                        headers: {
                            'Content-type': "application/json"
                        },
                        body: JSON.stringify({ quantity: quantity - 1 })
                    }).then((res) => res.json()).then((res) => console.log(res)).catch((err) => console.log(err))
                    fetch(`https://moral-riddle-2098-project-server.onrender.com/cart/add/`, {
                        method: "POST",
                        headers: {
                            'Content-type': "application/json",
                            "authorization": `Bearer ${saveToken.token}`
                        },
                        body: JSON.stringify(cartObject)
                    }).then((res) => res.json()).then((res) => {
                        console.log(res);
                        alert(res.msg);
                        fetchCartLength(), fetchWishlistLength();
                    })
                }
                // fetchCartLength(), fetchWishlistLength();
            })
        })
    } else {
        cartButton.innerHTML = `Out Of Stock`;
    }
    let wishlistButton = document.createElement("button");
    wishlistButton.classList = "card_item";
    wishlistButton.classList = "card_addWishlist";
    wishlistButton.setAttribute("data-id",dataId);
    wishlistButton.innerHTML = `<i data-id=${dataId} class="fa-regular fa-heart fa-bounce" ></i>Wishlist`
    wishlistButton.addEventListener("click", (e) => {
        let wishlistObject = {
            "title": title,
            "brand": brand,
            "category": category,
            "rating": rating,
            "price": price,
            "img": avatar,
            "quantity": 1
        };
        // console.log(wishlistObject);
        // console.log(saveToken.token);
        // fetch(`https://moral-riddle-2098-project-server.onrender.com/products/updateAfterAddCart/${e.target.id}`,{
        //     method:"PATCH",
        //     headers:{
        //         'Content-type':"application/json"
        //     },
        //     body:JSON.stringify({quantity:quantity-1})
        // }).then((res)=>res.json()).then((res)=>console.log(res)).catch((err)=>console.log(err))
        fetch(`https://moral-riddle-2098-project-server.onrender.com/wishlist/add/`, {
            method: "POST",
            headers: {
                'Content-type': "application/json",
                "authorization": `Bearer ${saveToken.token}`
            },
            body: JSON.stringify(wishlistObject)
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            alert(res.msg);
            fetchCartLength(), fetchWishlistLength();
        })
    })
    buttonDiv.append(cartButton, wishlistButton)

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