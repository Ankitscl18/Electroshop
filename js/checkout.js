// ================================
// Greeting
// ================================
const greeting = document.getElementById("user-greeting");
const user = JSON.parse(localStorage.getItem("user"));

if (user && greeting) {
  greeting.innerText = "Hello, " + user.name + " 👋";
}

// ================================
// Elements
// ================================
const orderItemsDiv = document.getElementById("order-items");
const orderTotalDiv = document.getElementById("order-total");
const form = document.getElementById("checkout-form");

// ================================
// Cart Data
// ================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

// ================================
// Render Cart
// ================================
if (cart.length === 0) {
  orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
} else {
  orderItemsDiv.innerHTML = "";
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

// ================================
// Submit Order (LIVE BACKEND)
// ================================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const orderPayload = {
    items: cart,
    total: total,
    date: new Date().toISOString()
  };

  console.log("Sending order:", orderPayload);

  fetch(`${API_BASE_URL}/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderPayload)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to place order");
      }
      return res.json();
    })
    .then(data => {
      console.log("✅ Order saved in database:", data);

      // Save order for success page
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          id: data._id || "ORD-" + Math.floor(Math.random() * 1000000),
          items: cart,
          grandTotal: total,
          date: new Date().toLocaleString()
        })
      );

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect AFTER backend success
      window.location.href = "order-success.html";
    })
    .catch(err => {
      console.error("❌ Order failed:", err);
      alert("Order failed. Please try again.");
    });
});
