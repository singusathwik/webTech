// Add interactivity to the "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    alert('Product added to cart!');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
// Cart functionality
let cart = [];

// DOM elements
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Product data
const products = [
  {
    id: 1,
    name: 'Iphone 16',
    price: 69000,
    image: 'iphone16.png'
  },
  {
    id: 2,
    name: 'Iphone 16 Pro',
    price: 105100,
    image: 'iphone16pro.webp'
  },
  {
    id: 3,
    name: 'Iphone 16 Pro Max',
    price: 144900,
    image: 'iphone16promax3.png'
  }
];

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach((button, index) => {
  button.addEventListener('click', () => {
    const product = products[index];
    addToCart(product);
    updateCartUI();
    // Show feedback
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">${product.name}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Added to cart successfully!
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  });
});

// Add item to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  saveCart();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = parseInt(newQuantity) || 1;
    if (item.quantity < 1) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-muted">Your cart is empty</p>';
    cartTotal.textContent = '₹0';
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h6 class="cart-item-title">${item.name}</h6>
        <div class="d-flex align-items-center">
          <div class="cart-item-quantity">
            <button class="quantity-btn minus">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
            <button class="quantity-btn plus">+</button>
          </div>
          <span class="cart-item-price ms-3">₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      </div>
      <span class="remove-item">&times;</span>
    </div>
  `).join('');

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `₹${total.toLocaleString()}`;

  // Add event listeners to quantity buttons
  document.querySelectorAll('.quantity-btn.minus').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
      const item = cart.find(item => item.id === itemId);
      if (item) {
        updateQuantity(itemId, item.quantity - 1);
      }
    });
  });

  document.querySelectorAll('.quantity-btn.plus').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
      const item = cart.find(item => item.id === itemId);
      if (item) {
        updateQuantity(itemId, item.quantity + 1);
      }
    });
  });

  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
      updateQuantity(itemId, e.target.value);
    });
  });

  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
      removeFromCart(itemId);
    });
  });
}

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
  alert('Thank you for your purchase!');
  cart = [];
  saveCart();
  updateCartUI();
  const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
  modal.hide();
});

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});