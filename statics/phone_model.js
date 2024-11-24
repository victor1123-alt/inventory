import { clearinputs, PostApi } from "./api.js";
let id = "<%- myphone.brand %>"
console.log(id)

const phone_model = document.forms.phone_model;


phone_model.onsubmit = (e)=>{
    e.preventDefault();
    
    const phoneBrandId = document.querySelector('#phone_id').value
    const name = phone_model.name.value;
    const parts = phone_model.parts.value;
    const stockstatus = phone_model.stockstatus.value;
    const selling_price  = phone_model.selling_price.value;

    console.log({phone_id,name,parts,stockstatus,selling_price});
    
    PostApi('/api/customers/createmodel',{
        name,
        parts:parts,
        stockstatus,
        selling_price,
        phoneBrandId
    },
    (x)=>{
        console.log(x);
        fetchSalesData()
        clearinputs(name,parts,stockstatus,selling_price,phoneBrandId)
    },(y)=>{
        console.log(y)
    })
}

async function fetchSalesData() {
    try {
        const response = await fetch('/api/customers/getphonemodels'); // Assuming '/api/sales' returns the latest sales data
        const phonemodel = await response.json();

        // console.log(sales);

        // Clear the current sales table
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        // Populate the table with updated sales data
        phonemodel.forEach((model, index) => {
            console.log(model);
            
            const row = document.createElement('tr');
            row.classList.add(index % 2 === 0 ? 'bg-default-blue' : 'myclass');

            row.innerHTML = `
               <td class="py-3 mt-3 px-2">000${model.id} </td>
                                                <td class="py-3 mt-3 px-2"> ${ model.name }</td>
                                                <td class="py-3 mt-3 px-2">${model.parts}</td>
                                                <td class="py-3 mt-3 px-2"><a href="" class="btn ${model.stockstatus == 1? 'btn-success' : 'btn-danger' } btn-sm">${ model.stockstatus == 1?"instock":"outof stock" }</a></td>
                                                <td class="py-3 mt-3 px-2 text-center"><a href=""><i
                                                            class="bi bi-trash3"></i></a></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}