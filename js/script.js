// Mobile Nav Toggle
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('translate-x-0');
    mobileNav.classList.toggle('-translate-x-full');
    document.body.classList.toggle('overflow-hidden');
  }
  
  function closeMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.add('-translate-x-full');
    mobileNav.classList.remove('translate-x-0');
    document.body.classList.remove('overflow-hidden');
  }
  
  // Cart Functions
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  function updateCartCount() {
    const cartCountEl = document.querySelector('.cart-count');
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = itemCount;
  }
  
  function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} added to cart`);
    if (!document.querySelector('.cart-panel').classList.contains('translate-x-full')) {
      renderCartItems();
    }
  }
  
  function renderCartItems() {
    const cartItemsEl = document.querySelector('.cart-items');
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="text-center text-gray-500">Your cart is empty</p>';
    } else {
      cart.forEach((item, index) => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'flex mb-4 pb-4 border-b';
        cartItemEl.innerHTML = `
          <img src="assets/images/${item.image}" alt="${item.name}" class="w-20 h-20 object-contain mr-4">
          <div class="flex-1">
            <h4 class="font-semibold">${item.name}</h4>
            <p class="text-gray-600">Rs ${(item.price * item.quantity).toLocaleString()}</p>
            <div class="flex items-center mt-2">
              <button class="quantity-btn minus bg-gray-200 px-2 py-1 rounded" data-index="${index}">-</button>
              <span class="quantity mx-2">${item.quantity}</span>
              <button class="quantity-btn plus bg-gray-200 px-2 py-1 rounded" data-index="${index}">+</button>
              <button class="remove-item ml-4 text-red-500" data-index="${index}">Remove</button>
            </div>
          </div>
        `;
        cartItemsEl.appendChild(cartItemEl);
      });
      updateCart();
      attachCartEventListeners();
    }
  }
  
  function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        renderCartItems();
      });
    });
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        cart[index].quantity++;
        renderCartItems();
      });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        cart.splice(index, 1);
        renderCartItems();
      });
    });
  }
  
  function updateCart() {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    document.querySelector('.cart-subtotal').textContent = `Rs ${subtotal.toLocaleString()}`;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
  
  function openCart() {
    document.querySelector('.cart-panel').classList.remove('translate-x-full');
    document.querySelector('.cart-overlay').classList.remove('hidden');
    renderCartItems();
  }
  
  function closeCart() {
    document.querySelector('.cart-panel').classList.add('translate-x-full');
    document.querySelector('.cart-overlay').classList.add('hidden');
  }
  
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded ${type === 'error' ? 'bg-red-500' : 'bg-yellow-600'} text-black`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
  
  function renderProducts(containerId, filter = 'all') {
    const container = document.getElementById(containerId);
    let filteredProducts;
    if (typeof filter === 'string') {
      if (filter === 'all') {
        filteredProducts = products;
      } else {
        filteredProducts = products.filter(product => product.category === filter);
      }
    } else if (typeof filter === 'function') {
      filteredProducts = products.filter(filter);
    } else {
      filteredProducts = [];
    }
    container.innerHTML = '';
    filteredProducts.forEach(product => {
      const productHtml = `
        <div class="product-item bg-white rounded-lg shadow-md overflow-hidden">
          <div class="product-image-container p-4">
            <img src="assets/images/${product.image}" alt="${product.name}" class="w-full h-48 object-contain">
          </div>
          <div class="product-content p-4">
            <h3 class="text-lg font-bold">${product.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${product.description}</p>
            <p class="price text-xl font-semibold">Rs ${product.price.toLocaleString()}</p>
            <button class="add-to-cart mt-4 w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 transition" data-product="${product.name}" data-price="${product.price}" data-image="${product.image}">ADD TO CART</button>
          </div>
        </div>
      `;
      container.innerHTML += productHtml;
    });
  }
  
  function setActiveCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
      if (btn.dataset.category === category) {
        btn.classList.add('bg-yellow-500', 'text-black');
        btn.classList.remove('bg-gray-200');
      } else {
        btn.classList.remove('bg-yellow-500', 'text-black');
        btn.classList.add('bg-gray-200');
      }
    });
  }
  
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;
      renderProducts('product-grid', category);
      setActiveCategory(category);
      window.location.hash = category;
    });
  });
  
  // DOM Content Loaded

  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
      menuIcon.addEventListener('click', function() {
        console.log('Menu icon clicked');
        toggleMobileNav();
      });
    } else {
      console.log('Menu icon not found');
    }
    document.querySelector('.close-mobile-nav').addEventListener('click', closeMobileNav);
    document.addEventListener('click', function(e) {
      if (!document.getElementById('mobileNav').contains(e.target) && !document.querySelector('.menu-icon').contains(e.target)) {
        closeMobileNav();
      }
    });
  
    document.querySelector('.cart-icon').addEventListener('click', openCart);
    document.querySelector('.close-cart').addEventListener('click', closeCart);
    document.querySelector('.cart-overlay').addEventListener('click', closeCart);
  
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('add-to-cart')) {
        const name = e.target.dataset.product;
        const price = parseFloat(e.target.dataset.price);
        const image = e.target.dataset.image;
        addToCart(name, price, image);
      }
    });
  
    document.querySelector('.checkout-btn').addEventListener('click', function() {
      if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
      }
      document.getElementById('checkoutModal').classList.remove('hidden');
    });
  
    document.querySelector('.close-checkout').addEventListener('click', function() {
      document.getElementById('checkoutModal').classList.add('hidden');
    });
  
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
      input.addEventListener('change', function() {
        const onlineOptions = document.getElementById('online-payment-options');
        onlineOptions.classList.toggle('hidden', this.value !== 'online');
      });
    });
  
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
      const cartDataInput = document.getElementById('cart-data');
      cartDataInput.value = formatCartForEmail(cart);
      setTimeout(() => {
        cart = [];
        updateCart();
        renderCartItems();
        document.getElementById('checkoutModal').classList.add('hidden');
        showNotification('Order submitted successfully!');
      }, 500);
    });
  
    function formatCartForEmail(cart) {
      let items = cart.map(item => `${item.name} x ${item.quantity} - Rs ${item.price * item.quantity}`);
      let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return `Items:\n${items.join('\n')}\nTotal: Rs ${total}`;
    }
  
    if (document.getElementById('product-grid')) {
      renderProducts('product-grid', product => product.featured); // For index.html
    }
  
    updateCartCount();
  });

  window.addEventListener('hashchange', function() {
    const category = window.location.hash.substring(1) || 'all';
    renderProducts('product-grid', category);
    setActiveCategory(category);
  });