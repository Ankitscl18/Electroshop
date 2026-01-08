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

// SHOW ETA
const etaDiv = document.getElementById("delivery-eta");
if (etaDiv) {
  etaDiv.innerText = getDeliveryETA();
}


// FORCE FIX image size on Order Success page
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

// Order Tracking Auto Progress
const steps = document.querySelectorAll(".step");
let currentStep = 0;

setInterval(() => {
  if (currentStep < steps.length) {
    steps[currentStep].classList.add("active");
    currentStep++;
  }
}, 1200);



// ===== ORDER TRACKING WITH REAL DATES =====

function formatDate(date) {
  return date.toDateString();
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

// Put dates into HTML
document.getElementById("date-placed").innerText = formatDate(placedDate);
document.getElementById("date-packed").innerText = formatDate(packedDate);
document.getElementById("date-shipped").innerText = formatDate(shippedDate);
document.getElementById("date-out").innerText = formatDate(outDate);
document.getElementById("date-delivered").innerText = formatDate(deliveredDate);

// Activate steps based on today's date
const step = document.querySelectorAll(".step");
const today = new Date();

const stepDates = [
  placedDate,
  packedDate,
  shippedDate,
  outDate,
  deliveredDate
];

steps.forEach((step, index) => {
  if (today >= stepDates[index]) {
    step.classList.add("active");
  }
});




