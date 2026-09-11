let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let container = document.getElementById("product-container");

// function updateCartCount() {
//     document.getElementById("cart-count").innerText = cart.length;
// }


function updateCartCount() {
    let cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}


async function getProducts() {
    container.innerHTML = `
        <p class="loading">Loading products...</p> 
        `;
    try {
        let response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) { throw new Error("Failed to fetch products"); }
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
// getProducts();
// updateCartCount();


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


// document.getElementById("search").addEventListener("input", function () {
//     let value = this.value.toLowerCase();
//     let result = products.filter(product =>
//         product.title.toLowerCase().includes(value)
//     );
//     displayProducts(result);
// });



let search = document.getElementById("search");
if (search) {
    search.addEventListener("input", function () {
        let value = this.value.toLowerCase();
        let result = products.filter(product =>
            product.title.toLowerCase().includes(value)
        );
        displayProducts(result);
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
    let existing = cart.find(item => item.product.id === id);
    if (existing) {
        existing.quantity += quantity;
    }
    else {
        cart.push({
            product: product,
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // document.getElementById("cart-count").innerText = cart.length;

    updateCartCount();

    alert(quantity + " " + product.title + " added to cart!");
    document.getElementById(`quantity-${id}`).innerText = 1;
}


// document.getElementById("cart-btn").onclick = function () {
//     if (cart.length === 0) {
//         alert("Cart is empty!");
//         return;
//     }
//     let message = "Your Cart:\n\n";
//     let grandTotal = 0;
//     cart.forEach(item => {
//         let productTotal =
//             item.product.price * item.quantity;
//         grandTotal += productTotal;
//         message += `${item.product.title}\n`;
//         message += `Price: $${item.product.price}\n`;
//         message += `Quantity: ${item.quantity}\n`;
//         message += `Total: $${productTotal.toFixed(2)}\n\n`;
//     });
//     message += "----------------------\n";
//     message += `Grand Total: $${grandTotal.toFixed(2)}`;
//     // alert(message);
// };




let cartContainer = document.getElementById("cart-container");
// if (cartContainer) {
//     displayCart();
// }

function displayCart() {
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Your Cart is Empty</h2>
                <p>
                    You haven't added any products yet.
                </p>
                <a href="index.html#products">
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }

    let grandTotal = 0;
    let totalItems = 0;
    cart.forEach((item, index) => {
        let product = item.product;
        let itemTotal =
            product.price * item.quantity;
        grandTotal += itemTotal;
        totalItems += item.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-image">
                    <img src="${product.image}">
                </div>
                <div class="cart-details">
                    <h3>
                        ${product.title}
                    </h3>
                    <p>
                        Category: ${product.category}
                    </p>

                    <p class="cart-price">
                        $${product.price}
                    </p>

                    <div class="cart-quantity">
                        <button
                            onclick="decreaseCartQuantity(${index})">
                            <i class="fa-solid fa-minus"></i>
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="increaseCartQuantity(${index})">
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>

                    <p class="item-total">
                        Item Total:
                        <strong>
                            $${itemTotal.toFixed(2)}
                        </strong>
                    </p>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">
                        <i class="fa-solid fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
    });


    cartContainer.innerHTML += `
        <div class="cart-summary">
            <h2>Cart Summary</h2>
            <div class="summary-row">
                <span>Total Products</span>
                <span>${cart.length}</span>
            </div>

            <div class="summary-row">
                <span>Total Items</span>
                <span>${totalItems}</span>
            </div>

            <div class="summary-row grand-total">
                <span>Grand Total</span>
                <span>
                    $${grandTotal.toFixed(2)}
                </span>
            </div>

            <button class="checkout-btn">
                <i class="fa-solid fa-credit-card"></i>
                Proceed to Checkout
            </button>
        </div>
    `;
}


function increaseCartQuantity(index) {
    cart[index].quantity++;
    saveCart();
    displayCart();
}

function decreaseCartQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    }
    saveCart();
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
    alert("Product remove from cart!");
}


function saveCart() {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

if (container) {
    getProducts();
    updateCartCount();
}

if (cartContainer) {
    displayCart();
}
