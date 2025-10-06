// ========================
// Add to Cart Function
// ========================
function addToCart(productName, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find(item => item.name === productName);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, price: "₹" + price, quantity: 1, image: image });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(productName + " added to cart!");
}

// ========================
// Load Cart Function
// ========================
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let tableBody = document.querySelector("#cartTable tbody");
  let grandTotalEl = document.getElementById("grandTotal");

  if (!tableBody) return;

  tableBody.innerHTML = "";
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    const itemTotal = parseInt(item.price.replace("₹", "")) * item.quantity;
    grandTotal += itemTotal;

    row.innerHTML = `
      <td><img src="${item.image}" width="50" style="border-radius:5px;"> ${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td>₹${itemTotal}</td>
      <td><button class="remove-btn" onclick="removeFromCart(${index})">❌</button></td>
    `;
    tableBody.appendChild(row);
  });

  grandTotalEl.textContent = `Grand Total: ₹${grandTotal}`;
}

// ========================
// Remove from Cart
// ========================
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// ========================
// Checkout Button
// ========================
document.addEventListener("DOMContentLoaded", () => {
  let checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Proceeding to checkout...");
        localStorage.removeItem("cart");
        loadCart();
      }
    });
  }

  loadCart(); // Auto-load when on cart page
});

// ========================
// Reviews Section
// ========================
/// ========================
// Load Reviews from localStorage
// ========================
function loadReviews() {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const reviewGrid = document.getElementById("reviewGrid");
  if (!reviewGrid) return;

  reviewGrid.innerHTML = "";

  reviews.forEach(review => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <h3>${review.name}</h3>
      <div class="stars">${"⭐".repeat(review.rating)}</div>
      <p>${review.comment}</p>
    `;
    reviewGrid.appendChild(div);
  });
}

// ========================
// Interactive Star Rating
// ========================
let selectedRating = 0;
const starsContainer = document.getElementById("reviewStars");

if (starsContainer) {
  const stars = starsContainer.querySelectorAll(".star");

  stars.forEach(star => {
    const value = parseInt(star.dataset.value);

    // Hover effect
    star.addEventListener("mouseover", () => highlightStars(value));
    star.addEventListener("mouseout", () => highlightStars(selectedRating));

    // Click to select
    star.addEventListener("click", () => {
      selectedRating = value;
      highlightStars(selectedRating);
    });
  });
}

// Highlight stars function
function highlightStars(rating) {
  const stars = starsContainer.querySelectorAll(".star");
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= rating) {
      star.textContent = "⭐";
    } else {
      star.textContent = "☆";
    }
  });
}

// ========================
// Submit Review
// ========================
function submitReview() {
  const name = document.getElementById("reviewerName").value.trim();
  const comment = document.getElementById("reviewComment").value.trim();

  if (!name || !comment || selectedRating === 0) {
    alert("Please enter your name, review, and select a star rating!");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push({ name, comment, rating: selectedRating });
  localStorage.setItem("reviews", JSON.stringify(reviews));

  // Reset form
  document.getElementById("reviewerName").value = "";
  document.getElementById("reviewComment").value = "";
  selectedRating = 0;
  highlightStars(selectedRating);

  loadReviews();
}

// Load existing reviews on page load
document.addEventListener("DOMContentLoaded", loadReviews);


// ========================
// Expandable Product Cards
// ========================
const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {
  const img = card.querySelector("img");
  const addToCartBtn = card.querySelector(".add-to-cart");

  // Populate Add to Cart button inside expandable details
  addToCartBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent toggling card expansion
    addToCart(card.querySelector("h3").innerText, card.dataset.price, card.querySelector("img").src);
  });

  // Toggle details on image click
  img.addEventListener("click", () => {
    const details = card.querySelector(".product-details");
    details.querySelector(".ingredients").innerText = "Ingredients: " + card.dataset.ingredients;
    details.querySelector(".manufacture").innerText = card.dataset.manufacture;
    details.querySelector(".expiry").innerText = card.dataset.expiry;

    // Toggle visibility
    if (details.style.display === "block") {
      details.style.display = "none";
      card.classList.remove("expanded");
    } else {
      details.style.display = "block";
      card.classList.add("expanded");
    }
  });
});

function submitContact() {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields!");
    return;
  }

  // For demo, we’ll just show an alert. You can connect it to email or backend later.
  alert(`Thank you, ${name}! Your message has been sent.`);

  // Clear the form
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactMessage").value = "";
}

document.getElementById("checkoutBtn").addEventListener("click", function() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const billDiv = document.getElementById("checkoutBill");
  
  if (cart.length === 0) {
    billDiv.innerHTML = "<p>Your cart is empty!</p>";
    billDiv.style.display = "block";
    return;
  }

  let billHTML = "<h3>🧾 Your Bill</h3>";
  let grandTotal = 0;

  billHTML += "<table style='width:100%; border-collapse: collapse; margin-bottom:20px;'>"
            + "<tr><th style='padding:8px; border-bottom:1px solid #ccc;'>Product</th>"
            + "<th style='padding:8px; border-bottom:1px solid #ccc;'>Price</th>"
            + "<th style='padding:8px; border-bottom:1px solid #ccc;'>Qty</th>"
            + "<th style='padding:8px; border-bottom:1px solid #ccc;'>Total</th></tr>";

  cart.forEach(item => {
    let total = item.price * item.quantity;
    grandTotal += total;
    billHTML += `<tr>
      <td style="padding:8px;">${item.name}</td>
      <td style="padding:8px;">₹${item.price}</td>
      <td style="padding:8px;">${item.quantity}</td>
      <td style="padding:8px;">₹${total}</td>
    </tr>`;
  });

  billHTML += "</table>";
  billHTML += `<h3>Grand Total: ₹${grandTotal}</h3>`;
  billHTML += `<p class="thankyou">✅ Thank you for visiting Pickle Store!</p>`;

  billDiv.innerHTML = billHTML;
  billDiv.style.display = "block";
});

// Toggle expandable product details
function toggleDetails(button) {
  const allCards = document.querySelectorAll('.product-card');
  allCards.forEach(card => {
    if(card !== button.parentElement) card.classList.remove('expanded');
  });

  const card = button.parentElement;
  card.classList.toggle('expanded');

  // Populate details
  const ingredients = card.getAttribute('data-ingredients');
  const manufacture = card.getAttribute('data-manufacture');
  const expiry = card.getAttribute('data-expiry');

  card.querySelector('.ingredients').innerText = "Ingredients: " + ingredients;
  card.querySelector('.manufacture').innerText = manufacture;
  card.querySelector('.expiry').innerText = expiry;
}

