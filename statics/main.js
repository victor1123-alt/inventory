// main.js
import {  PostApi } from "./api.js";

// console.log(myphones);


const invent_oryForm = document.forms.invent_ory;

invent_oryForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const customersName = invent_oryForm.customersname.value;
    const purchasedItem = document.querySelectorAll('.orders');
    const status = invent_oryForm.status.value;
    
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
        });
        
        // After adding the sale, refresh the sales table
        fetchSalesData();
    } catch (error) {
        console.error('Error adding sale:', error);
    }
}

// Function to fetch the updated sales data
async function fetchSalesData() {
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

            row.innerHTML = `
                <td class="py-4 px-2">${sale.Customer.first_name} ${sale.Customer.last_name}</td>
                <td class="py-4 px-2">${myphones.find(id=> id.phone_id ==  sale.allitems[0].brand).brand} ${sale.allitems[0].model}...</td>
                <td class="py-4 px-2">ORD-${sale.sale_id}</td>
                <td class="py-4 px-2">${sale.createdAt}</td>
                <td class="py-4 px-2">${sale.totalRevenue}</td>
                <td class="py-4 px-2"><a href="#" class="text-decoration-none">view</a></td>
                <td class="py-4 px-2"><a href="#" class="btn btn-sm btn-primary">print</a></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}
