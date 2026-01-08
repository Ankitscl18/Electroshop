const cartItemsDiv = document.getElementById("cart-items");
const totalDiv = document.getElementById("total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveAndReload() {
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

function increaseQty(index) {
    cart[index].quantity += 1;
    saveAndReload();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1); // remove item if qty becomes 0
    }
    saveAndReload();
}

let total = 0;

if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
} else {
    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "product-card";

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        div.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-img">
    <h3>${item.name}</h3>
    <p>Price: ₹${item.price}</p>
    <p>
        Quantity:
        <button onclick="decreaseQty(${index})">−</button>
        <strong> ${item.quantity} </strong>
        <button onclick="increaseQty(${index})">+</button>
    </p>
`;



        cartItemsDiv.appendChild(div);
    });

    totalDiv.innerText = "Total: ₹" + total;
}
function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    location.reload();
}
document.getElementById("clear-cart").onclick = clearCart;
const checkoutBtn = document.getElementById("checkout-btn");

if (cart.length === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerText = "Cart is Empty";
    checkoutBtn.style.opacity = "0.6";
    checkoutBtn.style.cursor = "not-allowed";
} else {
    checkoutBtn.onclick = function () {
        window.location.href = "checkout.html";
    };
}

