const BaseUrl = "https://moral-riddle-2098-project-server.onrender.com";
const registrationUrl = `${BaseUrl}/users/register`

let firstnameError = document.getElementById("firstname-error")
let lastnameError = document.getElementById("lastname-error")
let emailError = document.getElementById("email-error")
let passwordError = document.getElementById("password-error")
let submitError = document.getElementById("submit-error")

// validation for first name from input

function validationFirstName() {
    let name = document.getElementById("name").value;
    if (name.length <= 2) {
        firstnameError.innerHTML = "First Name is required";
        return false;
    }
    firstnameError.innerHTML = '<i class="fas fa-check-circle"></i>';
    return true;

}

//validation for mobile from input

function validationMobile() {
    let mobile = document.getElementById("mobile").value;
    if (mobile.length < 10) {
        lastnameError.innerHTML = "Mobile Number is required";
        return false;
    }
    lastnameError.innerHTML = '<i class="fas fa-check-circle"></i>';
    return true
}

//validation for email id from input

function validationEmail() {
    let email = document.getElementById("email").value;
    if (email.length == 0) {
        emailError.innerHTML = "Email is required";
        return false;
    }
    if (!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
        emailError.innerHTML = "Email Invalid"
        return false;
    }
    emailError.innerHTML = '<i class="fas fa-check-circle"></i>';
    return true;
}

// validation for password from input

function validationPassword() {
    let password = document.getElementById("password").value;
    if (password.length == 0) {
        passwordError.innerHTML = "Password Invalid!";
        return false;
    }
    if (password.length < 8) {
        passwordError.innerHTML = "8 character is required";
        return false;
    }
    passwordError.innerHTML = '<i class="fas fa-check-circle"></i>';
    return true;
}

// validation for form all inputs are working or data provided working fine or not

// let flag = false;
function validateSubmit() {
    if (!validationPassword() || !validationEmail() || !validationMobile() || !validationFirstName()) {
        submitError.innerHTML = "Please fill the data to submit."
        return false
    } else {
        // flag = true;
        RegisterUser();
        return true;
    }
}
//submit event created here
var Submitbutton = document.getElementById("Submit");
Submitbutton.addEventListener("click", function (e) {
    e.preventDefault();
    validateSubmit()
})
// catching all input values after validation
var username = document.getElementById("name");
var mobile = document.getElementById("mobile");
var email = document.getElementById("email");
var password = document.getElementById("password");

// posting new Admin user data to server 
function RegisterUser() {
    let newUserObject = {
        "name": username.value,
        "password": password.value,
        "mobile": mobile.value,
        "email": email.value
    };
    console.log(newUserObject)
    fetch(`${registrationUrl}`, {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(newUserObject)
    })
        .then((res) => res.json())
        .then((data) => {
            alert(`${data.msg}`);
            if (data.err == false) return;
            alert("Redirecting to Login Page");
            redirectToLogin();
        })
}

// redirecting to dashboard

function redirectToLogin() {
    location.href = "./login.html"
};

