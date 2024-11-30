import { PostApi } from "./api.js";

const addadmin = document.forms.addadmin;

addadmin.onsubmit = (e)=>{
    e.preventDefault();
    addadmin.querySelector(".btn").innerHTML = "loading"

    const first_name = addadmin.first_name;
    const last_name = addadmin.last_name;
    const phonenumber = addadmin.phonenumber;
    const email = addadmin.email;
    const address = addadmin.address;
    const password = addadmin.password;
    // const role = addadmin.role
    const gender = addadmin.gender
    PostApi('/api/users/signup',{email:email.value,password:password.value,first_name:first_name.value,last_name:last_name.value,address:address.value,phonenumber:phonenumber.value,role:"staff",gender:gender.value},(x)=>{
        addadmin.querySelector(".btn").innerHTML = "Add Admin"
         document.location = "/api/customers/viewadmin"
    })
    

}