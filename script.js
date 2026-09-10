let products = [];
let cart = [];

fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        products = data;
        displayProducts(products);
    });


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
    let container = document.getElementById("product-container");
    container.innerHTML = "";
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

            <button class="btn-cart" onclick="addToCart(${product.id})">
                <i class="fa-solid fa-cart-shopping"></i>
                Add to Cart
            </button>
        </div>
        `;
    });
}


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

