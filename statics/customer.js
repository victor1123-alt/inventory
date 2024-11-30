import { clearinputs, PostApi } from "./api.js";

const addCustomers = document.forms.customer_form;

addCustomers.onsubmit = (e) => {
    e.preventDefault();

    const firstname = addCustomers.firstname;
    const lastname = addCustomers.lastname;
    const email = addCustomers.email;
    const phone = addCustomers.phone;
    const physicalAddress = addCustomers.physicalAddress;

    PostApi('/api/customers/add', {
        first_name: firstname.value,
        last_name: lastname.value,
        email: email.value,
        phone_number: phone.value,
        address: physicalAddress.value
    },
        (x) => {
            document.querySelector('.mytoast').classList.remove('d-none');
            fetchSalesData()
            clearinputs(firstname,lastname,email,phone,physicalAddress)
            setTimeout(() => {
                document.querySelector('.mytoast').classList.add('d-none');

            }, 5000);
        }, (x) => {
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
        })
}


async function fetchSalesData() {
    try {
        const response = await fetch('/api/customers/getcustomers'); // Assuming '/api/sales' returns the latest sales data
        const customers = await response.json();

        // console.log(sales);

        // Clear the current sales table
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        // Populate the table with updated sales data
        customers.forEach((customer, index) => {
            const row = document.createElement('tr');
            row.classList.add(index % 2 === 0 ? 'bg-default-blue' : 'myclass');

            row.innerHTML = `
                <td class="py-3 mt-3 px-2">000${customer.customer_id}</td>
                                                <td class="py-3 mt-3 px-2"> ${customer.first_name } ${customer.last_name} </td>
                                                <td class="py-3 mt-3 px-2">${customer.email}</td>
                                                <td class="py-3 mt-3 px-2">${customer.phone_number}</td>
                                                <td class="py-3 mt-3 px-2">${customer.address}</td>
                                                <td class="py-3 mt-3 px-2 text-center"><a href=""><i class="bi bi-pencil-square"></i></a></td>
                                                <td class="py-3 mt-3 px-2 text-center"><a href=""><i class="bi bi-trash3"></i></a></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}





document.getElementById("editCustomerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editCustomerId").value;
    const updatedCustomer = {
        first_name: document.getElementById("editFirstName").value,
        last_name: document.getElementById("editLastName").value,
        email: document.getElementById("editEmail").value,
        phone_number: document.getElementById("editPhone").value,
        address: document.getElementById("editAddress").value,
    };

    try {
        const response = await fetch(`/api/customers/edit/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCustomer),
        });

        if (response.ok) {
            alert("Customer updated successfully!");
            location.reload(); // Refresh the page to show updated data
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error("Failed to update customer:", err);
    }
});


