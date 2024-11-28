import { clearinputs, PostApi, PostFileApi } from "./api.js";

document.getElementById("refreshButton").addEventListener("click", async () => {
    try {
        const response = await fetch("/phones/partial"); // Route for partial view
        const phoneCardsHTML = await response.text();

        // Create a temporary container to parse the new HTML
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = phoneCardsHTML;

        // Find all new card elements
        const newCards = tempContainer.querySelectorAll(".col-3");

        // Append each new card to the existing container
        const phoneCardContainer = document.getElementById("phoneCardContainer");
        newCards.forEach(card => {
            if (!phoneCardContainer.innerHTML.includes(card.outerHTML)) {
                phoneCardContainer.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error refreshing phone cards:", error);
    }
});


const addPhoneBrand = document.forms.addPhoneBrand;

console.log(addPhoneBrand);

addPhoneBrand.onsubmit = (e) => {
    e.preventDefault();

    const brand = addPhoneBrand.brand.value;
    const description = addPhoneBrand.description.value;
    const imageUrl = addPhoneBrand.imageUrl.files[0];

    addPhoneBrand.querySelector('.btn').innerHTML = "...loading"
    console.log(imageUrl);

    const formData = new FormData();
    formData.append('name', brand);
    formData.append('description', description); // Optional
    formData.append('image', imageUrl);
    console.log(formData);

    PostFileApi('/api/customers/phone-brands', formData,
        (x) => {
            addPhoneBrand.querySelector('.btn').innerHTML = "Add Phone Brand"

            document.querySelector('.mytoast').classList.remove('d-none');
            fetchPhoneBrands()
            clearinputs(addPhoneBrand.brand,addPhoneBrand.description,addPhoneBrand.imageUrl)
            setTimeout(() => {
                
                document.querySelector('.mytoast').classList.add('d-none');
                
            }, 4000);
        }, (x) => {
            addPhoneBrand.querySelector('.btn').innerHTML = "Add Phone Brand"

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

document.querySelector('#refreshButton').onclick = ()=>{
    fetchPhoneBrands()
}

async function fetchPhoneBrands() {
    try {
        const response = await fetch('/api/customers/getallphones'); // Assuming '/api/sales' returns the latest sales data
        const myphones = await response.json();

        // console.log(sales);

        // Clear the current sales table
        const myphonecontainer = document.querySelector('.myphonecontainer');
        myphonecontainer.innerHTML = '';

        // Populate the table with updated sales data
        myphones.forEach((phone, index) => {
            // console.log(phone);

            const div = document.createElement('div');

            div.classList.add('col-3', 'mx-1', 'bg-transperent')
            div.innerHTML = `
               <a href="/api/customers/models/${phone.phone_id}">
                                    <div class="card h-100 pointer" style="overflow: hidden;">
                                        <img src="/img/category/${phone.imageUrl}"
                                            class="card-img-top" alt="${phone.brand}">
                                        <div class="card-img-overlay pointer d-flex ">
                                            <div class="brand-name">${phone.brand}</div>
                                        </div>
                                    </div>
                                   </a>
          `;
            myphonecontainer.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let selectedPhoneId = null; // Store the phone ID for deletion

    // Event listener for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            selectedPhoneId = event.target.dataset.id; // Get phone ID
            // Show the modal
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        });
    });

    // Confirm delete button inside the modal
    document.getElementById('confirmDelete').addEventListener('click', async () => {
        const passwordInput = document.getElementById('deletePassword');
        const passwordError = document.getElementById('passwordError');
        const password = passwordInput.value.trim();

        // Validate password
        if (!password) {
            passwordError.classList.remove('d-none');
            return;
        }

        passwordError.classList.add('d-none'); // Hide error if validation passes

        try {
            // Send DELETE request with password
            const response = await fetch(`/delete/${selectedPhoneId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Remove phone card from DOM
                const phoneCard = document.querySelector(`.delete-btn[data-id="${selectedPhoneId}"]`).closest('.col-3');
                phoneCard.remove();

                alert(result.message || 'Phone deleted successfully.');

                // Close the modal
                const deleteModalInstance = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                deleteModalInstance.hide();
            } else {
                alert(result.message || 'Failed to delete the phone.');
            }
        } catch (error) {
            console.error('Error deleting phone:', error);
            alert('An error occurred while deleting the phone.');
        }
    });
});