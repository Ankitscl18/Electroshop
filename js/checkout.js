const greeting = document.getElementById("user-greeting");
const user = JSON.parse(localStorage.getItem("user"));

if (user && greeting) {
    greeting.innerText = "Hello, " + user.name + " 👋";
}

const orderItemsDiv = document.getElementById("order-items");
const orderTotalDiv = document.getElementById("order-total");
const form = document.getElementById("checkout-form");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

if (cart.length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
} else {
    cart.forEach(item => {
        const div = document.createElement("div");
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        div.innerHTML = `
            <img src="${item.image}" class="checkout-img">
            <p>${item.name} × ${item.quantity} — ₹${itemTotal}</p>
        `;

        orderItemsDiv.appendChild(div);
    });

    orderTotalDiv.innerText = "Total: ₹" + total;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Create order object FIRST
    const order = {
        id: "ORD-" + Math.floor(Math.random() * 1000000),
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            total: item.price * item.quantity
        })),
        grandTotal: total,
        date: new Date().toLocaleString()
    };

    // Save order BEFORE sending to backend
    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");

    // Send to backend (but don't wait for it)
    fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: cart,
            total: total
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ Backend received order:", data);
    })
    .catch(err => {
        console.error("❌ Backend error (but order still placed locally):", err);
    });

    // Redirect immediately (don't wait for backend)
    window.location.href = "order-success.html";
});

