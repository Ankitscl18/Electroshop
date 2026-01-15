const orderDetailsDiv = document.getElementById("order-details");
const orderTotalDiv = document.getElementById("order-total");
const orderIdSpan = document.getElementById("order-id");

const order = JSON.parse(localStorage.getItem("lastOrder"));

if (!order) {
    orderDetailsDiv.innerHTML = "<p>No order found.</p>";
} else {
    let total = 0;

    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const p = document.createElement("p");
        p.innerHTML = `
            <img src="${item.image}" class="success-img">
            ${item.name} × ${item.quantity} — ₹${itemTotal}
        `;

        orderDetailsDiv.appendChild(p);
    });

    orderTotalDiv.innerText = "Total Paid: ₹" + total;
    orderIdSpan.innerText = order.id;
}

// ===== DELIVERY ETA =====
function getDeliveryETA() {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };

    return `📦 Estimated Delivery: ${minDate.toLocaleDateString('en-IN', options)} – ${maxDate.toLocaleDateString('en-IN', options)}`;
}

// Show ETA (check if element exists first)
const etaDiv = document.getElementById("delivery-eta");
if (etaDiv) {
    etaDiv.innerText = getDeliveryETA();
}

// ===== FORCE FIX IMAGE SIZE =====
window.addEventListener("load", () => {
    const imgs = document.querySelectorAll("img");

    imgs.forEach(img => {
        img.style.width = "120px";
        img.style.height = "120px";
        img.style.maxWidth = "120px";
        img.style.maxHeight = "120px";
        img.style.objectFit = "contain";
        img.style.display = "block";
        img.style.margin = "12px auto";
    });
});

// ===== ORDER TRACKING WITH REAL DATES =====
function formatDate(date) {
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

// Base date = order placed date (today)
const placedDate = new Date();

const packedDate = new Date(placedDate);
packedDate.setDate(placedDate.getDate() + 1);

const shippedDate = new Date(placedDate);
shippedDate.setDate(placedDate.getDate() + 2);

const outDate = new Date(placedDate);
outDate.setDate(placedDate.getDate() + 3);

const deliveredDate = new Date(placedDate);
deliveredDate.setDate(placedDate.getDate() + 4);

// ✅ SAFELY set dates - check if elements exist first
function safeSetText(selector, text) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        elements.forEach(el => {
            if (el) el.innerText = text;
        });
    }
}

// Set dates for ALL matching elements (safely)
safeSetText("#date-placed", formatDate(placedDate));
safeSetText("#date-packed", formatDate(packedDate));
safeSetText("#date-shipped", formatDate(shippedDate));
safeSetText("#date-out", formatDate(outDate));
safeSetText("#date-delivered", formatDate(deliveredDate));

// ✅ Activate only first step initially
const steps = document.querySelectorAll(".step");
if (steps.length > 0 && steps[0]) {
    steps[0].classList.add("active");
}

console.log("✅ Order success page loaded successfully");