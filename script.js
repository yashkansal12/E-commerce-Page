let products = [];
let cart = [];

let container = document.getElementById("product-container");
async function getProducts() {
    container.innerHTML = `
        <p class="loading">Loading products...</p> 
        `;
    try {
        let response = await fetch("https://fakestoreapi.com/poducts");
        if (!response.ok) {throw new Error("Failed to fetch products");}
        products = await response.json();
        displayProducts(products);
    } 
    catch (error) {
        container.innerHTML = `
            <div class="message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Something went wrong</h3>
                <p>Unable to load products.</p>
                <button onclick="getProducts()">
                    Try Again
                </button>
            </div>
        `;
    }
}
getProducts();


function getStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(rating)) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}


function displayProducts(data) {
    container.innerHTML = "";
    if (data.length === 0) {
        container.innerHTML = `
            <div class="message">
                <i class="fa-solid fa-box-open"></i>
                <h3>No Products Found</h3>
                <p>Try searching for something else.</p>
            </div>
        `;
        return;
    }

    data.forEach(product => {
        container.innerHTML += `
        <div class="card">
            <img src="${product.image}">
            <h3>${product.title}</h3>
            <p>${product.category}</p>
            <h4>$${product.price}</h4>
            <p class="rating">
                ${getStars(product.rating.rate)}
                <span>${product.rating.rate}</span>
            </p>

            <div class="quantity">
                <button onclick="changeQuantity(${product.id}, -1)">
                    -
                </button>
                <span id="quantity-${product.id}">1</span>
                <button onclick="changeQuantity(${product.id}, 1)">
                    +
                </button>
            </div>

            <button
                class="btn-cart"
                onclick="addToCart(${product.id})">
                <i class="fa-solid fa-cart-shopping"></i>
                Add to Cart
            </button>
        </div>
        `;
    });
}


document.getElementById("search").addEventListener("input", function () {
    let value = this.value.toLowerCase();
    let result = products.filter(product =>
        product.title.toLowerCase().includes(value)
    );
    displayProducts(result);
});


function changeQuantity(id, value) {
    let quantity = document.getElementById(`quantity-${id}`);
    let current = Number(quantity.innerText);
    current += value;
    if (current < 1) {
        current = 1;
    }
    quantity.innerText = current;
}


function addToCart(id) {
    let product = products.find(p => p.id === id);
    let quantity = Number(
        document.getElementById(`quantity-${id}`).innerText
    );
    cart.push({
        product: product,
        quantity: quantity
    });
    document.getElementById("cart-count").innerText = cart.length;
    alert(quantity + " " + product.title + " added to cart!");
}

