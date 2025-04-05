let deliveryFee = 180; 
(function() {
  emailjs.init("gbUhLoENN_pjcWMZe"); 
})();


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
  function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + deliveryFee;
    return { subtotal, total };
}

function updateOrderSummary() {
  const { subtotal, total } = calculateTotal();
  document.getElementById('subtotal').textContent = subtotal;
  document.getElementById('delivery-fee').textContent = deliveryFee;
  document.getElementById('total').textContent = total;
}

// Add this after the existing event listeners (e.g., after the cart button listeners)
document.getElementById('delivery-option').addEventListener('change', function() {
  const selectedOption = this.options[this.selectedIndex];
  deliveryFee = parseInt(selectedOption.getAttribute('data-fee')) || 0;
  updateOrderSummary();
});


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
      updateOrderSummary();
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
  if (!container) {
      console.error(`Container with ID ${containerId} not found.`);
      return;
  }

  let filteredProducts;
  if (!products || !Array.isArray(products)) {
      console.error('Products array is undefined or not an array. Ensure products.js is loaded correctly.');
      container.innerHTML = '<p class="text-center text-red-500">Error: Unable to load products. Please try again later.</p>';
      return;
  }

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
  if (filteredProducts.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500">No products found.</p>';
      return;
  }

  filteredProducts.forEach(product => {
      const productHtml = `
          <div class="product-item bg-white rounded-lg shadow-md overflow-hidden">
              <div class="product-image-container p-4">
                  <img src="assets/images/${product.image}" alt="${product.name}" class="w-full h-48 object-contain" loading="lazy">
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
      e.preventDefault(); // Prevent the default form submission for now
  
      // Get form data
      const form = e.target;
      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const address = form.querySelector('#address').value;
      const paymentMethod = form.querySelector('input[name="payment-method"]:checked').value;
      const deliveryOption = form.querySelector('#delivery-option').value;
      const cartData = formatCartForEmail(cart);
  
      // Set the cart-data field for Formspree
      const cartDataInput = document.getElementById('cart-data');
      cartDataInput.value = cartData;
  
      // Prepare the email parameters for EmailJS
      const emailParams = {
          name: name,
          cart_data: cartData,
          address: address,
          payment_method: paymentMethod,
          delivery_option: deliveryOption,
          delivery_fee: deliveryFee,
          to_email: email
      };
  
      // Send the confirmation email to the customer using EmailJS
      emailjs.send('service_17n2kvh', 'template_b7b3w2b', emailParams)
          .then(function(response) {
              console.log('Email sent successfully:', response.status, response.text);

              form.submit(); // Manually submit the form to Formspree
          }, function(error) {
              console.error('Failed to send email:', error);
              showNotification('Failed to send confirmation email. Please contact support.', 'error');
              form.submit(); 
          });
  

      setTimeout(() => {
          cart = [];
          deliveryFee = 180;
          updateCart();
          renderCartItems();
          document.getElementById('checkoutModal').classList.add('hidden');
          showNotification('Order submitted successfully! A confirmation email has been sent.');
      }, 500);
  });

  function formatCartForEmail(cart) {
    const nameWidth = 20; 
    const quantityWidth = 8; 
    const priceWidth = 12; 

    let output = `Items:\n`;
    output += `${"Item Name".padEnd(nameWidth)}${"Qty".padEnd(quantityWidth)}${"Price".padEnd(priceWidth)}\n`;
    output += "-".repeat(nameWidth + quantityWidth + priceWidth) + "\n";

    cart.forEach(item => {
        const itemName = item.name.slice(0, nameWidth).padEnd(nameWidth); // Truncate long names
        const quantity = `x ${item.quantity}`.padEnd(quantityWidth);
        const price = `Rs ${item.price * item.quantity}`.padEnd(priceWidth);
        output += `${itemName}${quantity}${price}\n`;
    });

    const { subtotal, total } = calculateTotal();
    output += "-".repeat(nameWidth + quantityWidth + priceWidth) + "\n";
    output += `${"Subtotal".padEnd(nameWidth + quantityWidth)}${"Rs " + subtotal}\n`;
    output += `${"Delivery Fee".padEnd(nameWidth + quantityWidth)}${"Rs " + deliveryFee}\n`;
    output += `${"Total".padEnd(nameWidth + quantityWidth)}${"Rs " + total}\n`;

    return output;
}
updateCartCount();
initializeProductRendering();
    function initializeProductRendering() {
      const productGrid = document.getElementById('product-grid');
      if (productGrid) {
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
          console.log('Rendering featured products on index');
          renderProducts('product-grid', product => product.featured);
        } else if (window.location.pathname.endsWith('shop.html')) {
          const category = window.location.hash.substring(1) || 'all';
          console.log('Rendering products for category:', category);
          renderProducts('product-grid', category);
          setActiveCategory(category);
        }
      } else {
        console.log('Product grid not found on this page');
      }
    }

  });
  

  window.addEventListener('hashchange', function() {
    if (window.location.pathname.endsWith('shop.html')) {
      const category = window.location.hash.substring(1) || 'all';
      console.log('Hash changed, rendering products for category:', category);
      renderProducts('product-grid', category);
      setActiveCategory(category);
    }
  });

