if (order.length === 0) {
  alert("No order data found!");
}

const order = JSON.parse(localStorage.getItem("lastOrder"));
const items = order.items;

const tbody = document.getElementById("invoice-items");
const grandTotalEl = document.getElementById("grand-total");

// Invoice meta
document.getElementById("invoice-id").innerText =
  "INV-" + Math.floor(Math.random() * 100000);

document.getElementById("invoice-date").innerText =
  new Date().toDateString();

let grandTotal = 0;

// Render items
items.forEach(item => {

  const row = document.createElement("tr");

  const total = item.price * item.quantity;
  grandTotal += total;

  row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.quantity}</td>
    <td>₹${item.price}</td>
    <td>₹${total}</td>
  `;

  tbody.appendChild(row);
  grandTotalEl.innerText = `₹${grandTotal}`

});

grandTotalEl.innerText = "₹" + order.grandTotal;

