import {PostApi} from "./api.js"

const loginform =  document.forms.loginform;
console.log(loginform);

loginform.onsubmit = (e) =>{
    e.preventDefault();
    console.log('hello');
    loginform.querySelector(".btn").innerHTML = "...loading"
    const email =  loginform.email;
    const password = loginform.password;

    PostApi('/api/users/login',{email:email.value,password:password.value},(x)=>{if (x.message == "success") {
        loginform.querySelector(".btn").innerHTML = "Login"

         document.location = x.redirect
    }
    },(x)=>{
        loginform.querySelector(".btn").innerHTML = "Login"

        if (x.type == "validation") {

            x.forEach((err) => {

                if (err.type == "Validation error") {
                    // console.log(err);
    
                    document.querySelectorAll('.err').forEach((ele) => {
                        if (ele.dataset.err == err.path) {
                            ele.textContent = err.message
    
                        }
                    })
                }
            })
        }else {
            document.querySelector('.err#general').innerHTML = x.error
        }

    })
}