let products = document.getElementById("products");
let admin = document.getElementById("admin");
let customer = document.getElementById("customer");
let income = document.getElementById("income");

var saveToken = JSON.parse(sessionStorage.getItem("token"));

if (!saveToken) {
    // alert("Please Log in First")
    container.innerHTML = null;
    container.innerHTML = `<h3> Please Log in First</h3>`
}
fetchDetails()

function fetchDetails() {
    fetch(`http://localhost:4500/products/`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    }).then((res) => res.json()).then((res) => {
        products.innerText = res.products.length;
    });

    fetch(`http://localhost:4500/users/`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${saveToken.token}`
        }
    }).then((res) => res.json()).then((res) => {
        let adminUser = 0;
        let customerUser = 0;
        // console.log(res.users);
        for (let i = 0; i < res.users.length; i++) {
            // console.log(res.users[i]);
            if (res.users[i].role == "Admin") {
                adminUser++;
            } else {
                customerUser++;
            }
            admin.innerText = adminUser;
            customer.innerText = customerUser;
        }
        // console.log(adminUser,customerUser)
    });

    fetch(`http://localhost:4500/myorder/allorders`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${saveToken.token}`
        }
    }).then((res) => res.json()).then((res) => {
        console.log(res)
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
        income.innerText = orders.length;
    }).catch((err) => console.log(err));

    // fetch(`http://localhost:4500/product/`, {
    //     method: "GET",
    //     headers: {
    //         "content-type": "application/json",
    //         "authorization": `Bearer ${saveToken.token}`
    //     }
    // }).then((res)=>res.json()).then((res)=>{
    //     products.innerText = res.products.length;
    // })
}
