import { PostApi, PostFileApi } from "./api.js";

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

    console.log(imageUrl);

    const formData = new FormData();
    formData.append('name', brand);
    formData.append('description', description); // Optional
    formData.append('image', imageUrl);
    console.log(formData);

    PostFileApi('/api/customers/phone-brands', formData,
        (x) => {
            document.querySelector('.mytoast').classList.remove('d-none');
            fetchPhoneBrands()
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