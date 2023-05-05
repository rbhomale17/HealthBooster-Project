
const address = document.getElementById('adr');
// session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"));
var wishlistCounter = document.getElementById("wishlistCounter");
var cartCounter = document.getElementById("cartCounter");
if (cartCounter.innerText == 1) {
  console.log(true)
} else {
  console.log(false);
}
console.log("*******");

// getting wishlist and cart length by this functions
fetchCartLength(), fetchWishlistLength();


function fetchCartLength() {
  // console.log("HIII");
  fetch(`http://localhost:4500/cart/`, {
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
  fetch(`http://localhost:4500/wishlist/`, {
    method: "GET",
    headers: {
      "authorization": `Bearer ${saveToken.token}`
    }
  })
    .then((res) => res.json()).then((res) => {
      console.log(res.wishlist);
      let length = res.wishlist.length;
      wishlistCounter.innerText = length;
    }).catch((err) => {
      console.log(err);
    })
};


let submit = document.querySelector("form");

  submit.addEventListener("submit", (e) => {
    e.preventDefault();
    let obj = {
      address: address.value,
      date:new Date().toUTCString()
    };
    // console.log(obj)
    fetch(`http://localhost:4500/myorder/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${saveToken.token}`
      },
      body: JSON.stringify(obj)
    }).then((res) => res.json()).then((res) => {
      fetchCartLength(), fetchWishlistLength();
      alert(res.msg);
    })
  })
