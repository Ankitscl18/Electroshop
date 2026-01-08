let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productName, price, image) {

  const existing = cart.find(item => item.name === productName);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1,
      image: image
    });
  }

  // ✅ 1. SAVE CART
  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ 2. SHOW TOAST
  showToast(productName + " added to cart 🛒");

  // ✅ 3. UPDATE CART COUNT (if function exists)
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}


{
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(productName + " added to cart 🛒", "success");

    console.log(cart);
}
function buyNow(productName, price) {
    addToCart(productName, price);
    window.location.href = "checkout.html";
}
// CART COUNT BADGE
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countSpan = document.getElementById("cart-count");

    if (!countSpan) return;

    let count = 0;
    cart.forEach(item => {
        count += item.quantity;
    });

    if (count > 0) {
        countSpan.innerText = count;
        countSpan.style.display = "inline-block";
    } else {
        countSpan.style.display = "none";
    }
}

function searchProducts() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();

  const products = document.querySelectorAll(".product-card");

  products.forEach(product => {
    const title = product.querySelector("h3").innerText.toLowerCase();

    if (title.includes(filter)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
