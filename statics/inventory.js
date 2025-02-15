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
    const os = addPhoneBrand.os.value;

    document.querySelectorAll('.err').forEach((err) => {
        err.innerHTML = ""
    })

    addPhoneBrand.querySelector('.btn').innerHTML = "...loading"


    PostApi('/api/customers/phone-brands', { brand, description, os },
        (x) => {
            addPhoneBrand.querySelector('.btn').innerHTML = "Add Phone Brand"

            document.querySelector('.mytoast').classList.remove('d-none');
            fetchPhoneBrands()
            clearinputs(addPhoneBrand.brand, addPhoneBrand.description, addPhoneBrand.os)
            setTimeout(() => {

                document.querySelector('.mytoast').classList.add('d-none');

            }, 4000);
        }, (x) => {
            addPhoneBrand.querySelector('.btn').innerHTML = "Add Phone Brand"
            console.log(x);
            console.log({ brand, description, os });


            if (x?.validationerror) {
                x.error.forEach((err) => {
                    if (err.type == "Validation error") {
                        // console.log(err);

                        document.querySelectorAll('.err').forEach((ele) => {
                            if (ele.dataset.err == err.path) {
                                ele.textContent = err.message

                            }
                        })
                    }
                })
            }
        })
}

document.querySelector('#refreshButton').onclick = () => {
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

            div.classList.add("card","me-4")
            div.style.width = "18rem"
            let distinctNames = [...new Map(phone.phoneModels.map(item => [item.name, item])).values()];

            div.innerHTML = `
                                        <div class="card-body">
                                          <h5 class="card-title text-capitalize pb-2">${phone.brand}</h5>
                                          <h6 class="card-subtitle mb-2 text-muted">iphone operating system</h6>
                                          <div class="card-text py-1"><span class="text-muted fw-bold">description: </span>${phone.description}</div>
                                          <div class="card-text py-1"><span class="text-muted fw-bold">Amount of model : </span> ${distinctNames.length}</div>
                                          <div class="card-text py-1 pb-3"><span class="text-muted fw-bold">Amount of parts : </span>${phone.phoneModels.length}</div>

                                          <div class="d-flex justify-content-between">
                                            <button class="btn btn-danger w-50 mx-3 delete-btn" data-id="${phone.phone_id}">Delete</button>
                                            <a href="/api/customers/models/${phone.phone_id}" class="w-50 mx-3 btn btn-primary">view</a>
                                        </div>

          `;
            myphonecontainer.appendChild(div);
            div.querySelector('.delete-btn').onclick = deleteoneitem

        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}

function deleteoneitem(event) {
    // console.log(event.target);

    // console.log(event.target.dataset.id);

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    document.getElementById('confirmDelete').onclick=() => {deleteitem(event.target.dataset.id)}
    


}

document.addEventListener('DOMContentLoaded', () => {
    let selectedPhoneId = null; // Store the phone ID for deletion

    console.log(selectedPhoneId);
    
    
    // Event listener for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            selectedPhoneId = event.target.dataset.id; // Get phone ID
            // Show the modal

            console.log(selectedPhoneId);

            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();

            document.getElementById('confirmDelete').onclick= ()=> deleteitem(selectedPhoneId)

        });
    });

})

// Confirm delete button inside the modal

async function deleteitem(selectedPhoneId) {
    if (!selectedPhoneId) {
        console.log(selectedPhoneId); selectedPhoneId = null;
        return
    };
    // console.log(selectedPhoneId);

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
        const response = await fetch(`/api/customers/deleteinvent/${selectedPhoneId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Remove phone card from DOM
            const phoneCard = document.querySelector(`.delete-btn[data-id="${selectedPhoneId}"]`).closest('.card');
            phoneCard.remove();
            selectedPhoneId = null;

            alert(result.message || 'Phone deleted successfully.');

            // Close the modal
            const deleteModalInstance = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModalInstance.hide();
        } else {
            selectedPhoneId = null;
            alert(result.message || 'Failed to delete the phone.');
        }
    } catch (error) {
        console.error('Error deleting phone:', error);
        alert('An error occurred while deleting the phone.');
    }
}

