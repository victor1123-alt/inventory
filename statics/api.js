// import { removeItems } from "./main.js";

async function name(api, fufillfunc, rejectfunc) {
    const myPromise = new Promise(async (accept, reject) => {
        const response = await fetch(api, {
            method: 'GET'
        });

        const json = await response.json();

        if (response.ok) {
            fufillfunc(json)
        } else {
            rejectfunc(json)
        }
    })

    myPromise.then(fufillfunc).then(rejectfunc)
}



async function PostApi(api, postData, fufillfunc, rejectfunc) {
    const myPromise = new Promise(async (resolve, reject) => {
        const response = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData)
        });

        const json = await response.json();

        if (response.ok) {
            fufillfunc(json)
        } else {
            rejectfunc(json)
        }
    })
}

async function PostFileApi(api, postData, fufillfunc, rejectfunc) {
    const myPromise = new Promise(async (resolve, reject) => {
        const response = await fetch(api, {
            method: "POST",
            body: postData  
        });

        const json = await response.json();

        if (response.ok) {
            fufillfunc(json)
        } else {
            rejectfunc(json)
        }
    })
}





function clearinputs (...input) {
    input.forEach((inp)=>{
        inp.value = ""
    })
}


function showAlert (){
    document.querySelector('.mytoast').classList.remove('d-none');

   
}


function hideAlert(){

        document.querySelector('.mytoast').classList.add('d-none');

}


export { name, PostApi,PostFileApi,clearinputs,showAlert,hideAlert}