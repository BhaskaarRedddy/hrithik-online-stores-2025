let searchForm=document.querySelector('.search-form');
document.querySelector('#search-btn').onclick=()=>{
    searchForm.classList.toggle('active');
    Menu.classList.remove('active');
    ShoppingCart.classList.remove('active');
    Login.classList.remove('active');
}
let ShoppingCart=document.querySelector('.shopping-cart');
document.querySelector('#cart-btn').onclick=()=>{
    ShoppingCart.classList.toggle('active');
    Menu.classList.remove('active');
    searchForm.classList.remove('active');
    Login.classList.remove('active');
}
let Login=document.querySelector('.login-form');
document.querySelector('#login-btn').onclick=()=>{
    Login.classList.toggle('active');
    Menu.classList.remove('active');
    searchForm.classList.remove('active');
    ShoppingCart.classList.remove('active');
}
let Menu=document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick=()=>{
    Menu.classList.toggle('active');
    searchForm.classList.remove('active');
    ShoppingCart.classList.remove('active');
    Login.classList.remove('active');
}
window.onscroll=()=>{
    Menu.classList.remove('active');
    searchForm.classList.remove('active');
    ShoppingCart.classList.remove('active');
    Login.classList.remove('active');
}


// Enhanced Swiper Configuration
var swiper = new Swiper(".product-slider", {
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    750: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let cartTotal = 0;
let appliedPromo = localStorage.getItem('appliedPromo') || '';
let deliveryPincode = localStorage.getItem('deliveryPincode') || '560117';

// Add to Cart Function
function addToCart(productName, price, image) {
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: parseFloat(price),
      image: image,
      quantity: 1
    });
  }
  
  updateCartDisplay();
  showNotification(`${productName} added to cart!`);
}

// Update Cart Display
function updateCartDisplay() {
  const cartContainer = document.querySelector('.shopping-cart');
  if (!cartContainer) return;
  const cartItems = cartContainer.querySelectorAll('.box');
  const promoEl = cartContainer.querySelector('.promo');

  // Clear existing items
  cartItems.forEach(item => item.remove());
  
  cartTotal = 0;
  
  // Add cart items
  cart.forEach(item => {
    cartTotal += item.price * item.quantity;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'box';
    cartItem.innerHTML = `
      <i class="fas fa-trash" onclick="removeFromCart('${item.name}')"></i>
      <img src="${item.image}" alt="${item.name}">
      <div class="content">
        <h3>${item.name}</h3>
        <span class="price">₹${item.price.toFixed(0)}/-</span>
        <span class="quantity">qty : ${item.quantity}</span>
      </div>
    `;
    
    if (promoEl) {
      cartContainer.insertBefore(cartItem, promoEl);
    } else {
      cartContainer.appendChild(cartItem);
    }
  });
  
  // Calculate discount & update summary
  let discount = 0;
  if (appliedPromo === 'HRITHIK10') {
    discount = Math.round(cartTotal * 0.1);
  }
  const finalTotal = Math.max(cartTotal - discount, 0);

  const subtotalEl = document.getElementById('summarySubtotal');
  const discountEl = document.getElementById('summaryDiscount');
  const totalEl = document.getElementById('summaryTotal');
  if (subtotalEl) subtotalEl.textContent = `₹${cartTotal.toFixed(0)}/-`;
  if (discountEl) discountEl.textContent = `- ₹${discount.toFixed(0)}/-`;
  if (totalEl) totalEl.textContent = `₹${finalTotal.toFixed(0)}/-`;
  
  // Update cart icon badge
  updateCartBadge();

  // Persist
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove from Cart
function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  updateCartDisplay();
  showNotification(`${productName} removed from cart!`);
}

// Update Cart Badge
function updateCartBadge() {
  const cartBtn = document.querySelector('#cart-btn');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Remove existing badge
  const existingBadge = cartBtn.querySelector('.cart-badge');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  // Add new badge if items in cart
  if (totalItems > 0) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = totalItems;
    badge.style.cssText = `
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--orange);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    cartBtn.style.position = 'relative';
    cartBtn.appendChild(badge);
  }
}

// Notification System
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--orange);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Search Functionality
function searchProducts(query) {
  const products = document.querySelectorAll('.products .box h3');
  const productCards = document.querySelectorAll('.products .box');
  
  products.forEach((product, index) => {
    const productName = product.textContent.toLowerCase();
    const card = productCards[index];
    
    if (productName.includes(query.toLowerCase())) {
      card.style.display = 'block';
      card.classList.add('animate-fadeInUp');
    } else {
      card.style.display = 'none';
    }
  });
}

// Newsletter Subscription
function subscribeNewsletter(email) {
  if (email && email.includes('@')) {
    showNotification('Thank you for subscribing to our newsletter!');
    // Here you would typically send the email to your backend
    console.log('Newsletter subscription:', email);
  } else {
    showNotification('Please enter a valid email address.');
  }
}

// Wishlist Functionality
let wishlist = [];

function toggleWishlist(productName, price, image) {
  const existingItem = wishlist.find(item => item.name === productName);
  
  if (existingItem) {
    wishlist = wishlist.filter(item => item.name !== productName);
    showNotification(`${productName} removed from wishlist!`);
  } else {
    wishlist.push({
      name: productName,
      price: price,
      image: image
    });
    showNotification(`${productName} added to wishlist!`);
  }
  
  updateWishlistDisplay();
}

function updateWishlistDisplay() {
  const wishlistBtn = document.querySelector('#wishlist-btn');
  if (wishlistBtn) {
    const totalItems = wishlist.length;
    
    // Remove existing badge
    const existingBadge = wishlistBtn.querySelector('.wishlist-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Add new badge if items in wishlist
    if (totalItems > 0) {
      const badge = document.createElement('span');
      badge.className = 'wishlist-badge';
      badge.textContent = totalItems;
      badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      wishlistBtn.style.position = 'relative';
      wishlistBtn.appendChild(badge);
    }
  }
}

// Scroll to Top Functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Show/Hide Scroll to Top Button
window.addEventListener('scroll', () => {
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  }
});

// Simple Auth (localStorage-based)
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

function updateUserGreeting() {
  const greet = document.getElementById('userGreeting');
  if (!greet) return;
  if (currentUser && currentUser.name) {
    greet.textContent = `Hi, ${currentUser.name}`;
    greet.style.display = 'inline';
  } else {
    greet.style.display = 'none';
  }
}

// Add event listeners for enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
  // Delivery banner removed; skip pincode logic if elements absent

  // Add to cart buttons (delegated) - prefer data attributes, then qty-quick, then DOM
  document.addEventListener('click', function(e){
    const addBtn = e.target.closest('.products .btn');
    if (!addBtn) return;
    e.preventDefault();
    const productCard = addBtn.closest('.box');
    if (!productCard) { showNotification('Unable to add item.'); return; }
    let productName = '';
    let price = 0;
    let image = '';
    if (addBtn.dataset.product) {
      productName = addBtn.dataset.product;
      price = parseInt(addBtn.dataset.price || '0', 10);
      image = addBtn.dataset.image || '';
    } else {
      const quick = productCard.querySelector('.qty-quick');
      if (quick) {
      productName = quick.getAttribute('data-product') || '';
      price = parseInt(quick.getAttribute('data-price') || '0', 10);
      image = quick.getAttribute('data-image') || '';
      } else {
        productName = productCard.querySelector('h3')?.textContent || '';
        price = parseInt(((productCard.querySelector('.price')?.textContent || '').match(/\d+/)||['0'])[0],10);
        image = productCard.querySelector('img')?.src || '';
      }
    }
    addToCart(productName, price, image);
  });
  
  // Search functionality
  const searchInput = document.querySelector('#search-box');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchProducts(this.value);
    });
  }
  
  // Newsletter subscription
  document.querySelectorAll('.newsletter form, .footer .box form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      subscribeNewsletter(email);
      this.reset();
    });
  });
  
  // Add scroll to top button
  const scrollTopBtn = document.createElement('div');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.onclick = scrollToTop;
  document.body.appendChild(scrollTopBtn);
  
  // Add loading animation
  window.addEventListener('load', function() {
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.style.display = 'none';
    }
  });
  
  // Add animation classes on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Quick qty controls (delegated)
  document.addEventListener('click', function(e){
    const inc = e.target.closest('.qty-quick .incr');
    const dec = e.target.closest('.qty-quick .decr');
    if (inc || dec) {
      const wrap = e.target.closest('.qty-quick');
      if (!wrap) return;
      const name = wrap.getAttribute('data-product');
      const price = parseInt(wrap.getAttribute('data-price'), 10);
      const image = wrap.getAttribute('data-image');
      const countEl = wrap.querySelector('.count');
      if (inc) {
        addToCart(name, price, image);
      } else if (dec) {
        const item = cart.find(i => i.name === name);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
          updateCartDisplay();
        }
      }
      const item = cart.find(i => i.name === name);
      if (countEl) countEl.textContent = item ? item.quantity : 0;
    }
  });

  // Promo apply
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('promoCodeInput');
  if (applyPromoBtn && promoInput) {
    if (appliedPromo) promoInput.value = appliedPromo;
    applyPromoBtn.addEventListener('click', () => {
      const code = (promoInput.value || '').trim().toUpperCase();
      if (code === 'HRITHIK10') {
        appliedPromo = code;
        localStorage.setItem('appliedPromo', appliedPromo);
        showNotification('Promo applied: 10% off');
      } else {
        appliedPromo = '';
        localStorage.removeItem('appliedPromo');
        showNotification('Invalid promo code');
      }
      updateCartDisplay();
    });
  }

  // Render cart from storage on load
  updateCartDisplay();
  // Render Recently Viewed initially
  (function renderRVInit(){
    const list = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (list.length) {
      const section = document.getElementById('recentlyViewed');
      const container = document.querySelector('.recently-viewed .rv-container');
      if (section && container) {
        section.style.display='block';
        container.innerHTML='';
        list.forEach(i=>{
          const el=document.createElement('div');
          el.className='rv-item';
          el.innerHTML=`<img src="${i.image}" alt="${i.name}"><div><h4>${i.name}</h4><div class="price">₹${parseInt(i.price,10)}/-</div></div>`;
          container.appendChild(el);
        });
      }
    }
  })();

  // Link between login and signup forms
  const loginForm = document.querySelector('.login-form');
  const signupForm = document.querySelector('.signup-form');
  const openSignup = document.getElementById('openSignup');
  const openLogin = document.getElementById('openLogin');

  if (openSignup && loginForm && signupForm) {
    openSignup.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.style.display = 'block';
      signupForm.classList.add('active');
      loginForm.classList.remove('active');
    });
  }
  if (openLogin && loginForm && signupForm) {
    openLogin.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('active');
      signupForm.classList.remove('active');
      signupForm.style.display = 'none';
    });
  }

  // Handle signup submit
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = signupForm.querySelectorAll('.box');
      const name = inputs[0].value.trim();
      const email = inputs[1].value.trim().toLowerCase();
      const password = inputs[2].value;
      if (!name || !email || !password) return;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        showNotification('Account already exists. Please login.');
        return;
      }
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      currentUser = { name, email };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showNotification('Signup successful!');
      signupForm.classList.remove('active');
      signupForm.style.display = 'none';
      updateUserGreeting();
    });
  }

  // Handle login submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = loginForm.querySelectorAll('.box');
      const email = inputs[0].value.trim().toLowerCase();
      const password = inputs[1].value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Login successful!');
        Login.classList.remove('active');
        updateUserGreeting();
      } else {
        showNotification('Invalid credentials');
      }
    });
  }

  // Initialize greeting
  updateUserGreeting();

  // Recently Viewed
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  function pushRecentlyViewed(item){
    const exists = recentlyViewed.find(i=>i.name===item.name);
    if(!exists){
      recentlyViewed.unshift({name:item.name, price:item.price, image:item.image});
      if (recentlyViewed.length>8) recentlyViewed.pop();
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
    renderRecentlyViewed();
  }
  function renderRecentlyViewed(){
    const section = document.getElementById('recentlyViewed');
    const container = document.querySelector('.recently-viewed .rv-container');
    if(!section || !container) return;
    if(recentlyViewed.length===0){ section.style.display='none'; return; }
    section.style.display='block';
    container.innerHTML='';
    recentlyViewed.forEach(i=>{
      const el = document.createElement('div');
      el.className='rv-item';
      el.innerHTML = `<img src="${i.image}" alt="${i.name}"><div><h4>${i.name}</h4><div class="price">₹${parseInt(i.price,10)}/-</div></div>`;
      container.appendChild(el);
    });
  }

  // Modify addToCart to also push recently viewed
  const _addToCartOrig = addToCart;
  addToCart = function(productName, price, image){
    _addToCartOrig(productName, price, image);
    pushRecentlyViewed({name:productName, price:price, image:image});
  };

  // Enhance cart display with qty controls and clear cart
  const _updateCartDisplayOrig = updateCartDisplay;
  updateCartDisplay = function(){
    _updateCartDisplayOrig();
    const cartContainer = document.querySelector('.shopping-cart');
    if(!cartContainer) return;
    // add qty controls per item
    cartContainer.querySelectorAll('.box').forEach(box=>{
      const name = box.querySelector('h3')?.textContent;
      if(!name) return;
      if(box.querySelector('.qty-ctrl')) return;
      const ctrl = document.createElement('div');
      ctrl.className='qty-ctrl';
      ctrl.innerHTML = `<button class="dec">-</button><span class="qv">${(cart.find(i=>i.name===name)||{}).quantity||1}</span><button class="inc">+</button>`;
      box.appendChild(ctrl);
      ctrl.querySelector('.inc').onclick = ()=>{ addToCart(name, (cart.find(i=>i.name===name)||{}).price, (cart.find(i=>i.name===name)||{}).image); };
      ctrl.querySelector('.dec').onclick = ()=>{
        const item = cart.find(i=>i.name===name);
        if(!item) return;
        item.quantity -= 1;
        if(item.quantity<=0){ cart = cart.filter(i=>i.name!==name); }
        updateCartDisplay();
      };
    });
    // add actions row (clear cart)
    if(!cartContainer.querySelector('.actions-row')){
      const actions = document.createElement('div');
      actions.className='actions-row';
      actions.innerHTML = `<button class="btn" id="clearCartBtn">Clear Cart</button>`;
      const checkoutBtn = document.getElementById('checkoutBtn');
      if(checkoutBtn){ checkoutBtn.parentNode.insertBefore(actions, checkoutBtn); }
      const clearBtn = actions.querySelector('#clearCartBtn');
      if(clearBtn){
        clearBtn.onclick = ()=>{ cart = []; localStorage.setItem('cart','[]'); updateCartDisplay(); updateCartBadge(); };
      }
    }
    // persist after changes
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Initial render for recently viewed on DOM ready
  document.addEventListener('DOMContentLoaded', renderRecentlyViewed);
});

// Fallback inline handlers to guarantee clicks work
function addToCartFromBtn(el){
  const name = el.getAttribute('data-product');
  const price = parseInt(el.getAttribute('data-price')||'0',10);
  const image = el.getAttribute('data-image');
  addToCart(name, price, image);
  return false;
}
function incQtyQuick(button){
  const wrap = button.closest('.qty-quick');
  if(!wrap) return false;
  const name = wrap.getAttribute('data-product');
  const price = parseInt(wrap.getAttribute('data-price')||'0',10);
  const image = wrap.getAttribute('data-image');
  addToCart(name, price, image);
  const count = wrap.querySelector('.count');
  const item = cart.find(i=>i.name===name);
  if(count) count.textContent = item ? item.quantity : 0;
  return false;
}
function decQtyQuick(button){
  const wrap = button.closest('.qty-quick');
  if(!wrap) return false;
  const name = wrap.getAttribute('data-product');
  const item = cart.find(i=>i.name===name);
  if(item){
    item.quantity -= 1;
    if(item.quantity<=0){ cart = cart.filter(i=>i.name!==name); }
    updateCartDisplay();
  }
  const count = wrap.querySelector('.count');
  const cur = cart.find(i=>i.name===name);
  if(count) count.textContent = cur ? cur.quantity : 0;
  return false;
}
// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);