function login()
{
    let email=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    let error=document.getElementById('error');

    if(email==="admin@1234" && password==="1234")//input takes string input by default
    {
        localStorage.setItem("isLoggedIn","true"); //why??
        localStorage.setItem("user",email);

        window.location.href= "home.html";
    }
    else{
        error.innerHTML="Invalid email or password";
    }
}

function togglePassword()
{
    let passwordInput = document.getElementById("password");

    if (passwordInput.type === "password")
    {
        passwordInput.type = "text";
    }
    else
    {
        passwordInput.type = "password";
    }
}

function toggleMenu()
{
   let navMenu = document.getElementById("navMenu");
   let menuIcon = document.getElementById("menuIcon");
   navMenu.classList.toggle("show");
   if(navMenu.classList.contains("show"))
   {
       menuIcon.classList.remove("fa-bars");
       menuIcon.classList.add("fa-xmark");
   }
   else
   {
       menuIcon.classList.remove("fa-xmark");
       menuIcon.classList.add("fa-bars");
   }
}

// ==================== CART FUNCTIONALITY ====================

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Add a book to the cart
 * @param {string} name - Name of the book
 * @param {string} price - Price of the book
 * @param {string} image - Image path of the book
 */
function addToCart(name, price, image) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // If item exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // If item doesn't exist, add new item
        cart.push({
            name: name,
            price: parseInt(price),
            image: image,
            quantity: 1
        });
    }

    // Save cart to localStorage
    saveCart();
    // Update cart count display
    updateCartCount();
    // Show alert to user
    alert(`${name} added to cart!`);
}

/**
 * Remove an item from the cart
 * @param {string} name - Name of the book to remove
 */
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    displayCart();
    updateCartCount();
}

/**
 * Increase quantity of an item in cart
 * @param {string} name - Name of the book
 */
function increaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        saveCart();
        displayCart();
    }
}

/**
 * Decrease quantity of an item in cart
 * @param {string} name - Name of the book
 */
function decreaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // If quantity is 1, remove the item
            removeFromCart(name);
            return;
        }
        saveCart();
        displayCart();
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Display cart items on the cart page
 */
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const grandTotalElement = document.getElementById('grand-total');

    // Clear existing items
    cartItemsContainer.innerHTML = '';

    // Check if cart is empty
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        grandTotalElement.textContent = 'Rs 0';
        return;
    } else {
        emptyCartMessage.style.display = 'none';
    }

    let grandTotal = 0;

    // Loop through cart items and display them
    cart.forEach(item => {
        const total = item.price * item.quantity;
        grandTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="item">
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
            </td>
            <td>Rs ${item.price}</td>
            <td class="qty-box">
                <button onclick="decreaseQuantity('${item.name}')">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity('${item.name}')">+</button>
            </td>
            <td>Rs ${total}</td>
            <td><button class="Remove" onclick="removeFromCart('${item.name}')">X</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    // Update grand total
    grandTotalElement.textContent = `Rs ${grandTotal}`;
}

/**
 * Update cart count badge in navigation
 */
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        // Check if cart count badge already exists
        let badge = link.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            link.appendChild(badge);
        }
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'inline' : 'none';
    });
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// ==================== CHECKOUT FUNCTIONALITY ====================

/**
 * Display order summary on checkout page
 */
function displayOrderSummary() {
    const orderSummaryContainer = document.getElementById('orderSummary');
    const checkoutTotalElement = document.getElementById('checkoutTotal');

    if (!orderSummaryContainer) return;

    // Clear existing items
    orderSummaryContainer.innerHTML = '';

    if (cart.length === 0) {
        orderSummaryContainer.innerHTML = '<p>Your cart is empty</p>';
        checkoutTotalElement.textContent = 'Rs 0';
        return;
    }

    let grandTotal = 0;

    // Loop through cart items and display them
    cart.forEach(item => {
        const total = item.price * item.quantity;
        grandTotal += total;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-summary-item';
        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <p style="font-weight: bold;">${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="item-price">Rs ${item.price} each</p>
                </div>
            </div>
            <div class="item-price">Rs ${total}</div>
        `;
        orderSummaryContainer.appendChild(itemDiv);
    });

    // Update total
    checkoutTotalElement.textContent = `Rs ${grandTotal}`;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number (simple validation)
 */
function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

/**
 * Validate card number (simple validation - checks if it's 16 digits)
 */
function validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
}

/**
 * Validate expiry date (MM/YY format)
 */
function validateExpiryDate(expiry) {
    const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return re.test(expiry);
}

/**
 * Validate CVV (3 digits)
 */
function validateCVV(cvv) {
    const re = /^\d{3}$/;
    return re.test(cvv);
}

/**
 * Format card number with spaces
 */
function formatCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
}

/**
 * Format expiry date
 */
function formatExpiryDate(expiry) {
    const cleaned = expiry.replace(/\//g, '');
    if (cleaned.length >= 2) {
        return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    return cleaned;
}

/**
 * Process payment
 */
function processPayment(event) {
    event.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const cardholderName = document.getElementById('cardholderName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    // Validate fields
    let isValid = true;

    if (fullName.trim() === '') {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    if (!validateEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    if (!validatePhone(phone)) {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
    }

    if (address.trim() === '') {
        document.getElementById('addressError').style.display = 'block';
        isValid = false;
    }

    if (!validateCardNumber(cardNumber)) {
        document.getElementById('cardError').style.display = 'block';
        isValid = false;
    }

    if (!validateExpiryDate(expiryDate)) {
        document.getElementById('expiryError').style.display = 'block';
        isValid = false;
    }

    if (!validateCVV(cvv)) {
        document.getElementById('cvvError').style.display = 'block';
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Disable pay button
    const payButton = document.getElementById('payButton');
    payButton.disabled = true;
    payButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    // Simulate payment processing (2 seconds delay)
    setTimeout(() => {
        // Generate random order ID
        const orderId = 'ORD' + Date.now().toString().slice(-8);

        // Display success message
        document.getElementById('checkoutForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('orderId').textContent = orderId;

        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();

        // Scroll to top
        window.scrollTo(0, 0);
    }, 2000);
}

/**
 * Add input formatting for card number
 */
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formatted = formatCardNumber(value);
            e.target.value = formatted;
        });
    }

    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\//g, '').replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // If on checkout page, display order summary
    if (window.location.pathname.includes('checkout.html') || window.location.href.includes('checkout.html')) {
        displayOrderSummary();
    }
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // If on cart page, display cart items
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        displayCart();
    }
    // Update cart count on all pages
    updateCartCount();
});