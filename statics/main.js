// main.js
import {  clearinputs, PostApi } from "./api.js";

// console.log(myphones);
const filter = document.forms.filter;
let filtervalue = "first_name"
filter.onchange = ()=>{
    filtervalue = filter.filtertype.value
    console.log(filtervalue);
    
}

document.querySelector('#search').oninput = (e)=>{
    console.log(filtervalue);
    
   if(e.target.value != "" && filtervalue !="") {
    fetchSalesDatas(filtervalue,e.target.value)

   }else {
    fetchSalesData()

   }
}

async function fetchSalesDatas(x,y) {
    try {
        const response = await fetch('/api/customers/sales'); // Assuming '/api/sales' returns the latest sales data
        const sales = await response.json();

        console.log(sales);
        
        // Clear the current sales table
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        // Populate the table with updated sales data
        sales.forEach((sale, index) => {
           if(sale[x]?.includes(y) || sale?.Customer[x]?.includes(y)) {
               
            const row = document.createElement('tr');
            row.classList.add(index % 2 === 0 ? 'bg-default-blue' : 'myclass');
            let itemprice = 0

            sale.allitems.forEach((item)=>{itemprice += item.price * item.qty})
            row.innerHTML = `
            <td class="py-4 px-2">${sale.Customer.first_name} ${sale.Customer.last_name}</td>
            <td class="py-4 px-2 text-center">${myphones.find(id=> id.phone_id ==  sale.allitems[0].brand).brand} ${sale.allitems[0].model}...</td>
            <td class="py-4 px-2 text-center">ORD-${sale.sale_id}</td>
            <td class="py-4 px-2 text-center">${sale.createdAt}</td>
            <td class="py-4 px-2 text-center"> ${itemprice}</td>
            <td class="py-4 px-2 text-center"><a href="#" class="btn btn-sm btn-primary">print</a></td>
        `;
        tableBody.appendChild(row);
           } else if(x == "item"){
            sale.allitems.forEach((item)=>{
                if (item.model.includes(y) || item.part.includes(y)) {
                        
            const row = document.createElement('tr');
            row.classList.add(index % 2 === 0 ? 'bg-default-blue' : 'myclass');
            let itemprice = 0
            sale.allitems.forEach((item)=>{itemprice += item.price * item.qty})
            row.innerHTML = `
                <td class="py-4 px-2">${sale.Customer.first_name} ${sale.Customer.last_name}</td>
                <td class="py-4 px-2 text-center">${myphones.find(id=> id.phone_id ==  sale.allitems[0].brand).brand} ${sale.allitems[0].model}...</td>
                <td class="py-4 px-2 text-center">ORD-${sale.sale_id}</td>
                <td class="py-4 px-2 text-center">${sale.createdAt}</td>
                <td class="py-4 px-2 text-center"> ${itemprice}</td>
                <td class="py-4 px-2 text-center"><a href="#" class="btn btn-sm btn-primary">print</a></td>
            `;
            tableBody.appendChild(row);
                }
            })
           }   else {
            
           }
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}


const invent_oryForm = document.forms.invent_ory;

invent_oryForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const customersName = invent_oryForm.customersname.value;
    const purchasedItem = document.querySelectorAll('.orders');
    const status = invent_oryForm.status.value;
    invent_oryForm.querySelector('.btn').innerHTML = "...loading"
    const allitems = [];
    purchasedItem.forEach((item) => {
        allitems.push({
            model: item.querySelector('.model').value,
            brand: item.querySelector('.brand').value,
            part: item.querySelector('.part').value,
            qty: item.querySelector('.qty').value,
            price: item.querySelector('.price').value,
            selling_price: item.querySelector('.selling_price').value
        });
    });

    try {
        const response = await PostApi('/api/customers/createsale', {
            customer_id: customersName,
            allitems,
            status
        },()=>{
            invent_oryForm.querySelector('.btn').innerHTML = "Add order";
            clearinputs(invent_oryForm.customersName,invent_oryForm.revenue)

        });
        
        // After adding the sale, refresh the sales table
        fetchSalesData();
    } catch (error) {
        console.error('Error adding sale:', error);
    }
}

// Function to fetch the updated sales data
async function fetchSalesData(x,y) {
    try {
        const response = await fetch('/api/customers/sales'); // Assuming '/api/sales' returns the latest sales data
        const sales = await response.json();

        console.log(sales);
        
        // Clear the current sales table
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        // Populate the table with updated sales data
        sales.forEach((sale, index) => {
            console.log(sale);
            
            const row = document.createElement('tr');
            row.classList.add(index % 2 === 0 ? 'bg-default-blue' : 'myclass');
            let itemprice = 0
            sale.allitems.forEach((item)=>{itemprice += item.price * item.qty})
            
            row.innerHTML = `
            <td class="py-4 px-2">${sale.Customer.first_name} ${sale.Customer.last_name}</td>
            <td class="py-4 px-2 text-center">${myphones.find(id=> id.phone_id ==  sale.allitems[0].brand).brand} ${sale.allitems[0].model}...</td>
            <td class="py-4 px-2 text-center">ORD-${sale.sale_id}</td>
            <td class="py-4 px-2 text-center">${sale.createdAt}</td>
            <td class="py-4 px-2 text-center"> ${itemprice}</td>
            <td class="py-4 px-2 text-center"><a href="#" class="btn btn-sm btn-primary">print</a></td>
        `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}
