// Get order from localStorage
const order = JSON.parse(localStorage.getItem("lastOrder"));

// Check if order exists
if (!order || !order.items || order.items.length === 0) {
  alert("No order data found!");
  window.location.href = "index.html";
}

const items = order.items;
const tbody = document.getElementById("invoice-items");
const grandTotalEl = document.getElementById("grand-total");

// Invoice meta
document.getElementById("invoice-id").innerText = order.id || "INV-" + Math.floor(Math.random() * 100000);
document.getElementById("invoice-date").innerText = new Date().toLocaleDateString('en-IN');

let grandTotal = 0;

// Render items
items.forEach(item => {
  const row = document.createElement("tr");
  
  const itemTotal = item.price * item.quantity;
  grandTotal += itemTotal;
  
  row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.quantity}</td>
    <td>₹${item.price.toLocaleString()}</td>
    <td>₹${itemTotal.toLocaleString()}</td>
  `;
  
  tbody.appendChild(row);
});

// Set grand total (use calculated total or order.grandTotal)
grandTotalEl.innerText = grandTotal.toLocaleString();