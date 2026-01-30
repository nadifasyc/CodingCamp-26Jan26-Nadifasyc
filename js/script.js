// JavaScript to display a welcome message to the user
welcomeMessage();

// Function to display a welcome message to the user
function welcomeMessage() {
    // Prompt the user for their name
    let userResponse = prompt("Welcome to Nadifa Space! What is your name?");

    // Handle case where user cancels or enters an empty name
    if (userResponse === null || userResponse.trim() === "") {
        userResponse = "Guest";
    }

    // Display the welcome message
    document.getElementById("welcome-speech").innerText = `Hello, ${userResponse}! Welcome to Nadifa Space.`;
    
    // Store user name for later use
    localStorage.setItem('userName', userResponse);
}

// Initialize messages array from localStorage or create empty array
let messages = JSON.parse(localStorage.getItem('messages')) || [];

// DOM Elements
const messageForm = document.getElementById('messageForm');
const messagesContainer = document.getElementById('messagesContainer');
const totalMessagesElement = document.getElementById('totalMessages');
const clearFormBtn = document.getElementById('clearForm');
const clearAllMessagesBtn = document.getElementById('clearAllMessages');

// Display existing messages on page load
displayMessages();

// Update message count
updateMessageCount();

// Form submission handler
messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate name
    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (isValid) {
        // Create message object
        const newMessage = {
            id: Date.now(), // Unique ID based on timestamp
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Add to messages array
        messages.unshift(newMessage); // Add to beginning for newest first
        
        // Save to localStorage
        localStorage.setItem('messages', JSON.stringify(messages));
        
        // Display the new message
        displayMessages();
        
        // Update message count
        updateMessageCount();
        
        // Reset form
        messageForm.reset();
        
        // Show success message
        showSuccessNotification('Message sent successfully!');
    }
});

// Clear form button
clearFormBtn.addEventListener('click', function() {
    messageForm.reset();
    clearErrors();
});

// Clear all messages button
clearAllMessagesBtn.addEventListener('click', function() {
    if (messages.length > 0) {
        if (confirm('Are you sure you want to delete all messages?')) {
            messages = [];
            localStorage.setItem('messages', JSON.stringify(messages));
            displayMessages();
            updateMessageCount();
            showSuccessNotification('All messages cleared!');
        }
    } else {
        alert('No messages to clear!');
    }
});

// Helper function to display messages
function displayMessages() {
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No messages yet. Be the first to send a message!</p>
            </div>
        `;
        return;
    }
    
    let messagesHTML = '';
    
    messages.forEach(msg => {
        messagesHTML += `
            <div class="message-card" data-id="${msg.id}">
                <div class="message-header">
                    <div>
                        <div class="message-sender">${escapeHTML(msg.name)}</div>
                        <div class="message-email">${escapeHTML(msg.email)}</div>
                    </div>
                    <div class="message-time">${msg.timestamp}</div>
                </div>
                <div class="message-content">${escapeHTML(msg.message)}</div>
            </div>
        `;
    });
    
    messagesContainer.innerHTML = messagesHTML;
}

// Helper function to update message count
function updateMessageCount() {
    totalMessagesElement.textContent = messages.length;
}

// Helper function to show error messages
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Highlight the input field
    const inputElement = document.getElementById(elementId.replace('Error', ''));
    inputElement.classList.add('input-error');
}

// Helper function to clear all errors
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    // Remove error class from inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.classList.remove('input-error');
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show success notification
function showSuccessNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        ${message}
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
