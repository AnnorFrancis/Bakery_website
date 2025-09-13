// Menu page //
// Simple reveal on scroll
function reveal() {
  document.querySelectorAll(".reveal").forEach(function (el) {
    var windowHeight = window.innerHeight;
    var elementTop = el.getBoundingClientRect().top;
    var elementVisible = 80;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", reveal);
window.addEventListener("DOMContentLoaded", reveal);

// Menu filter and search functionality
document.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const menuSections = document.querySelectorAll(".menu-category");
  const searchInput = document.getElementById("menu-search");
  let currentCategory = "all";

  function showAllMenu() {
    menuSections.forEach((section) => {
      section.style.display = "";
      section.querySelectorAll(".menu-card").forEach((card) => {
        card.style.display = "";
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentCategory = this.getAttribute("data-category");
      searchInput.value = "";
      menuSections.forEach((section) => {
        if (
          currentCategory === "all" ||
          section.getAttribute("data-category") === currentCategory
        ) {
          section.style.display = "";
        } else {
          section.style.display = "none";
        }
        // Show all cards in visible sections
        section.querySelectorAll(".menu-card").forEach((card) => {
          card.style.display = "";
        });
      });
    });
  });

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    let anySectionVisible = false;
    menuSections.forEach((section) => {
      // Only search in visible categories
      if (
        currentCategory !== "all" &&
        section.getAttribute("data-category") !== currentCategory
      ) {
        section.style.display = "none";
        return;
      }
      let hasMatch = false;
      section.querySelectorAll(".menu-card").forEach((card) => {
        const name = card.querySelector(".item-name").textContent.toLowerCase();
        if (name.includes(query)) {
          card.style.display = "";
          hasMatch = true;
        } else {
          card.style.display = "none";
        }
      });
      section.style.display = hasMatch || query === "" ? "" : "none";
      if (hasMatch || query === "") anySectionVisible = true;
    });
    // If search is cleared, show all menu items in the current category
    if (query === "") {
      menuSections.forEach((section) => {
        if (
          currentCategory === "all" ||
          section.getAttribute("data-category") === currentCategory
        ) {
          section.style.display = "";
          section.querySelectorAll(".menu-card").forEach((card) => {
            card.style.display = "";
          });
        } else {
          section.style.display = "none";
        }
      });
    }
  });
});
// --- Order Cart Functionality --- //
document.addEventListener("DOMContentLoaded", function () {
  // Inject cart sidebar if not present
  if (!document.getElementById("order-cart")) {
    const cartDiv = document.createElement("div");
    cartDiv.id = "order-cart";
    cartDiv.innerHTML = `
      <div class="cart-overlay" id="cart-overlay" style="display:none;"></div>
      <aside class="cart-sidebar" id="cart-sidebar" style="display:none;">
        <div class="cart-header">
          <h3>Your Order</h3>
          <button id="close-cart" aria-label="Close Cart">&times;</button>
        </div>
        <ul class="cart-items" id="cart-items"></ul>
        <div class="cart-footer">
          <div class="cart-total">Total: <span id="cart-total">GH₵0</span></div>
          <div style="display: flex; gap: 0.7rem;">
            <button class="btn btn-ghost" id="clear-cart">Clear Cart</button>
            <button class="btn btn-primary" id="make-order">Make Order</button>
          </div>
        </div>
      </aside>
    `;
    document.body.appendChild(cartDiv);
  }

  // Cart state
  let cart = [];

  // Utility: parse price string (e.g. 'GH₵250')
  function parsePrice(str) {
    return parseFloat(str.replace(/[^\d.]/g, ""));
  }

  // Utility: format price
  function formatPrice(num) {
    return `GH₵${num}`;
  }

  // Show/hide cart sidebar
  function openCart() {
    document.getElementById("cart-sidebar").style.display = "block";
    document.getElementById("cart-overlay").style.display = "block";
  }
  function closeCart() {
    document.getElementById("cart-sidebar").style.display = "none";
    document.getElementById("cart-overlay").style.display = "none";
  }

  // Render cart items
  function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = cart.length
      ? cart
          .map(
            (item, idx) => `
          <li class="cart-item">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">${formatPrice(item.price)}</span>
            <div class="cart-qty-controls">
              <button class="cart-qty-btn" data-idx="${idx}" data-action="decrease">-</button>
              <span class="cart-item-qty">${item.qty}</span>
              <button class="cart-qty-btn" data-idx="${idx}" data-action="increase">+</button>
              <button class="cart-remove-btn" data-idx="${idx}" title="Remove">&times;</button>
            </div>
          </li>
        `
          )
          .join("")
      : '<li class="cart-empty">No items yet.</li>';
    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    document.getElementById("cart-total").textContent = formatPrice(total);
    // Enable/disable Make Order button
    const makeOrderBtn = document.getElementById("make-order");
    if (makeOrderBtn) makeOrderBtn.disabled = cart.length === 0;
  }
  // Make Order button
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "make-order") {
      if (cart.length === 0) return;
      // For now, just show a confirmation and clear cart
      alert("Thank you for your order! We are processing it.");
      cart = [];
      renderCart();
      closeCart();
    }
  });

  // Add item to cart
  function addToCart(name, price) {
    const idx = cart.findIndex((item) => item.name === name);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    renderCart();
    openCart();
  }

  // Handle menu card clicks
  document.querySelectorAll(".menu-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Prevent click if clicking a button inside cart
      if (
        e.target.closest(".cart-qty-btn") ||
        e.target.closest(".cart-remove-btn")
      )
        return;
      const name = card.querySelector(".item-name").textContent;
      const price = parsePrice(card.querySelector(".item-price").textContent);
      addToCart(name, price);
    });
  });

  // Open cart when clicking nav 'view order' button
  document.querySelectorAll('a[href="#cart"]').forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openCart();
      renderCart();
    });
  });

  // Cart sidebar close
  document.getElementById("close-cart").onclick = closeCart;
  document.getElementById("cart-overlay").onclick = closeCart;

  // Cart item quantity and remove
  document.getElementById("cart-items").onclick = function (e) {
    const btn = e.target.closest(".cart-qty-btn, .cart-remove-btn");
    if (!btn) return;
    const idx = +btn.getAttribute("data-idx");
    if (btn.classList.contains("cart-qty-btn")) {
      const action = btn.getAttribute("data-action");
      if (action === "increase") cart[idx].qty++;
      if (action === "decrease") {
        cart[idx].qty--;
        if (cart[idx].qty < 1) cart.splice(idx, 1);
      }
    } else if (btn.classList.contains("cart-remove-btn")) {
      cart.splice(idx, 1);
    }
    renderCart();
  };

  // Clear cart
  document.getElementById("clear-cart").onclick = function () {
    cart = [];
    renderCart();
  };

  // Initial render
  renderCart();
});
// --- End Order Cart Functionality --- //
// End of Menu page //
