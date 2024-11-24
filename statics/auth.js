import {PostApi} from "./api.js"

const loginform =  document.forms.loginform;
console.log(loginform);

loginform.onsubmit = (e) =>{
    e.preventDefault();
    console.log('hello');
    
    const email =  loginform.email;
    const password = loginform.password;

    PostApi('/api/users/login',{email:email.value,password:password.value},(x)=>{if (x.message == "success") {
         document.location = x.redirect
    }
    },(y)=>{console.log(y);
    })
}