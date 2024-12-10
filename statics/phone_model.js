import { clearinputs, PostApi } from "./api.js";


const phone_model = document.forms.phone_model;


phone_model.onsubmit = (e) => {
    e.preventDefault();

    const phoneBrandId = document.querySelector('#phone_id').value
    const name = phone_model.name.value;
    const parts = phone_model.parts.value;
    const stockstatus = phone_model.stockstatus.value;
    const selling_price = phone_model.selling_price.value;

    console.log({ phone_id, name, parts, stockstatus, selling_price });

    PostApi('/api/customers/createmodel', {
        name,
        parts: parts,
        stockstatus,
        selling_price,
        phoneBrandId
    },
        (x) => {
            console.log(x);
            fetchSalesData()
            clearinputs(phone_model.name, phone_model.parts, phone_model.stockstatus)
        }, (y) => {
            console.log(y)
        })
}

let selectedPhoneId = null;
let newStockStatus = null;
let selectedItemId = null;

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
                    <td class="py-3 mt-3 px-2">${model.User.first_name} ${model.User.last_name}</td>
                    <td class="py-3 mt-3 px-2  ">000${model.id}</td>
                    <td class="py-3 mt-3 px-2 text-center">${model.name}</td>
                    <td class="py-3 mt-3 px-2 text-center">${model.parts}</td>
                    <td class="py-3 mt-3 px-2 text-center ">
                        <button 
                            class="btn ${model.stockstatus == 1 ? 'btn-success' : 'btn-danger'} btn-sm toggle-stock-btn" 
                            data-id="${model.id}" 
                            data-status="${model.stockstatus}" 
                            data-bs-toggle="modal" 
                            data-bs-target="#confirmPasswordModal">
                            ${model.stockstatus == 1 ? "In Stock" : "Out of Stock"}
                        </button>
                    </td>    
                    <td class="py-3 mt-3 px-2 text-center">
                        <button 
                            class="btn btn-danger btn-sm delete-btn" 
                            data-id="${model.id}" 
                            data-bs-toggle="modal" 
                            data-bs-target="#confirmDeleteModal">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
           `;
            tableBody.appendChild(row);

            row.querySelector('.toggle-stock-btn').addEventListener("click", (e) => {
                selectedPhoneId = row.querySelector('.toggle-stock-btn').getAttribute("data-id");
                newStockStatus = row.querySelector('.toggle-stock-btn').getAttribute("data-status") === "1" ? 0 : 1;
            });

            row.querySelector('.delete-btn').addEventListener("click", (e) => {
                selectedItemId = row.querySelector('.delete-btn').getAttribute("data-id");

                document.getElementById("confirmDeleteButton").onclick = () => deletitem(selectedItemId)

            });
        });



    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    // Handle stock toggle button clicks
    document.querySelectorAll(".toggle-stock-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            selectedPhoneId = button.getAttribute("data-id");
            newStockStatus = button.getAttribute("data-status") === "1" ? 0 : 1;
        });
    });

    // Handle password submission
    document.getElementById("passwordForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("adminPassword").value;

        try {
            const response = await fetch(`/api/customers/toggle-stock/${selectedPhoneId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newStockStatus,
                    password,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                // Update button style and text dynamically
                const button = document.querySelector(`.toggle-stock-btn[data-id="${selectedPhoneId}"]`);
                button.textContent = newStockStatus === 1 ? "In Stock" : "Out of Stock";
                button.className = `btn btn-sm toggle-stock-btn ${newStockStatus === 1 ? "btn-success" : "btn-danger"
                    }`;
            } else {
                alert(result.message || "Failed to update stock status.");
            }
        } catch (error) {
            console.error("Error updating stock status:", error);
            alert("An error occurred. Please try again.");
        }

        // Hide modal and reset form
        document.getElementById("confirmPasswordModal").querySelector(".btn-close").click();
        document.getElementById("passwordForm").reset();
    });
});


async function deletitem(selectedItemId) {
    if (!selectedItemId) return;

    const password = document.getElementById("deletePassword").value;

    if (!password) {
        alert("Please enter your password.");
        return;
    }

    try {
        const response = await fetch(`/api/customers/phone-models/delete/${selectedItemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Item deleted successfully.");
            // const deleteModalInstance = bootstrap.Modal.getInstance(document.getElementById('confirmDelete'));
            // deleteModalInstance.hide();
            // Remove the deleted row from the table
            const row = document.querySelector(`.delete-btn[data-id="${selectedItemId}"]`).closest("tr");
            row.remove();
        } else {
            alert(result.message || "Failed to delete item.");
        }
    } catch (error) {
        console.error("Error deleting item:", error);
        alert("An error occurred while trying to delete the item.");
    }

    // Hide modal

}

document.addEventListener("DOMContentLoaded", () => {
    // Capture delete button click
    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => {
            selectedItemId = button.getAttribute("data-id"); // Store the ID of the item to delete
        });
    });

    // Handle delete confirmation
    document.getElementById("confirmDeleteButton").onclick = () => deletitem(selectedItemId)
});


