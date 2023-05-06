let counter = 1;
setInterval(function () {
  document.getElementById("radio" + counter).checked = true;
  counter++;
  if (counter > 5) {
    counter = 1;
  }
}, 4000)

// <-- Navbar JS -->

var navbar = document.querySelector('.navbar');
var sticky = navbar.offsetTop;
function stickyNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add('sticky')
  } else {
    navbar.classList.remove('sticky');
  }
}
window.onscroll = function () { stickyNav(), fetchCartLength(), fetchWishlistLength() };

// session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"));
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
      console.log(res.wishlist);
      let length = res.wishlist.length;
      wishlistCounter.innerText = length;
    }).catch((err) => {
      console.log(err);
    })
};





