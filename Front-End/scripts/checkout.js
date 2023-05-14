
const address = document.getElementById('adr');
// session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"));
var wishlistCounter = document.getElementById("wishlistCounter");
var cartCounter = document.getElementById("cartCounter");
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


let submit = document.querySelector("form");

submit.addEventListener("submit", (e) => {
  e.preventDefault();
  let cost = 0;
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
    // console.log(value, qty);
    cost = value * qty;

    let obj = {
      address: address.value,
      date: new Date().toUTCString(),
      cost: cost
    };
    console.log(obj)
    fetch(`https://moral-riddle-2098-project-server.onrender.com/myorder/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${saveToken.token}`
      },
      body: JSON.stringify(obj)
    }).then((res) => res.json()).then((res) => {
      fetchCartLength(), fetchWishlistLength();
      alert(res.msg);
      alert("Redirecting You To My Order Section.")
      window.location.href = "./myorder.html"
    })
  })
})
