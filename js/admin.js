let allOrders = [];
let autoRefreshInterval = null; // Initialize as null

// Load orders when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Admin dashboard loaded');
    
    loadOrders();
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', function(e) {
        filterOrders(e.target.value);
    });
    
    // Auto-refresh every 30 seconds
    startAutoRefresh();
});

// Start auto-refresh
function startAutoRefresh() {
    // CRITICAL FIX: Clear any existing interval first to prevent duplicates
    if (autoRefreshInterval) {
        console.log('⚠️ Clearing old refresh interval');
        clearInterval(autoRefreshInterval);
    }
    
    console.log('✅ Starting auto-refresh (every 30 seconds)');
    
    autoRefreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing orders...');
        loadOrders();
    }, 30000); // 30 seconds (reduced from 10)
}

// Stop auto-refresh
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('⏹️ Auto-refresh stopped');
    }
}

// Load orders from API
async function loadOrders() {
    try {
        // Use API_BASE_URL from config.js, or fallback to localhost
        const apiUrl = typeof API_BASE_URL !== 'undefined' 
            ? API_BASE_URL 
            : 'http://localhost:5000';
        
        const response = await fetch(`${apiUrl}/api/orders`);
        const data = await response.json();
        
        if (data.status === 'success') {
            allOrders = data.orders;
            displayOrders(allOrders);
            updateStatistics(allOrders);
            console.log(`✅ Loaded ${data.orders.length} orders`);
        } else {
            showError('Failed to load orders');
        }
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        showError('Error connecting to server');
    }
}

// Display orders in table
function displayOrders(orders) {
    const tbody = document.getElementById('orders-tbody');
    const loading = document.getElementById('loading');
    const table = document.getElementById('orders-table');
    const noOrders = document.getElementById('no-orders');
    
    loading.style.display = 'none';
    
    if (orders.length === 0) {
        table.style.display = 'none';
        noOrders.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    noOrders.style.display = 'none';
    
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(order.createdAt);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Customer info
        const customerInfo = order.customerDetails 
            ? `
                <div class="customer-name">${order.customerDetails.name}</div>
                <div class="customer-details">
                    📧 ${order.customerDetails.email}<br>
                    📱 ${order.customerDetails.phone}
                </div>
            `
            : '<span style="color:#999;">No customer details</span>';
        
        // Items list
        const itemsList = order.items.map(item => 
            `<div class="item">• ${item.name} (${item.quantity}x) - ₹${item.price}</div>`
        ).join('');
        
        row.innerHTML = `
            <td><span class="order-id">${order.orderId}</span></td>
            <td><div class="customer-info">${customerInfo}</div></td>
            <td><div class="items-list">${itemsList}</div></td>
            <td><span class="total-amount">₹${order.total.toLocaleString()}</span></td>
            <td>
                <div class="date-time">
                    📅 ${formattedDate}<br>
                    🕐 ${formattedTime}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewOrder('${order._id}')">
                        👁️ View
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteOrder('${order._id}', '${order.orderId}')">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Update statistics
function updateStatistics(orders) {
    // Total orders
    document.getElementById('total-orders').innerText = orders.length;
    
    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('total-revenue').innerText = '₹' + totalRevenue.toLocaleString();
    
    // Average order value
    const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    document.getElementById('avg-order').innerText = '₹' + avgOrder.toLocaleString();
    
    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
    });
    document.getElementById('today-orders').innerText = todayOrders.length;
}

// Filter orders based on search
function filterOrders(searchTerm) {
    const filtered = allOrders.filter(order => {
        const term = searchTerm.toLowerCase();
        
        // Search in order ID
        if (order.orderId.toLowerCase().includes(term)) return true;
        
        // Search in customer details
        if (order.customerDetails) {
            if (order.customerDetails.name.toLowerCase().includes(term)) return true;
            if (order.customerDetails.email.toLowerCase().includes(term)) return true;
            if (order.customerDetails.phone.includes(term)) return true;
        }
        
        // Search in items
        const itemMatch = order.items.some(item => 
            item.name.toLowerCase().includes(term)
        );
        if (itemMatch) return true;
        
        return false;
    });
    
    displayOrders(filtered);
}

// View order details
function viewOrder(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if (!order) return;
    
    const date = new Date(order.createdAt).toLocaleString('en-IN');
    
    const customerSection = order.customerDetails ? `
        <h3 style="color:#667eea; margin-top:20px;">📋 Customer Details</h3>
        <div class="detail-row">
            <div class="detail-label">Name</div>
            <div class="detail-value">${order.customerDetails.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value">${order.customerDetails.email}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Phone</div>
            <div class="detail-value">${order.customerDetails.phone}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Address</div>
            <div class="detail-value">
                ${order.customerDetails.address}<br>
                ${order.customerDetails.city}, PIN: ${order.customerDetails.pincode}
            </div>
        </div>
    ` : '<p style="color:#999;">No customer details available</p>';
    
    const itemsHtml = order.items.map(item => `
        <div class="detail-row">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color:#666;">Quantity: ${item.quantity} × ₹${item.price}</span>
                </div>
                <strong style="color:#667eea;">₹${item.price * item.quantity}</strong>
            </div>
        </div>
    `).join('');
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>Order Details</h2>
        
        <div class="detail-row">
            <div class="detail-label">Order ID</div>
            <div class="detail-value"><strong>${order.orderId}</strong></div>
        </div>
        
        <div class="detail-row">
            <div class="detail-label">Order Date</div>
            <div class="detail-value">${date}</div>
        </div>
        
        ${customerSection}
        
        <h3 style="color:#667eea; margin-top:20px;">🛒 Items Ordered</h3>
        ${itemsHtml}
        
        <div class="detail-row" style="margin-top:20px; background:#f8f9fa; padding:15px; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:18px;">Total Amount</strong>
                <strong style="font-size:24px; color:#28a745;">₹${order.total.toLocaleString()}</strong>
            </div>
        </div>
    `;
    
    document.getElementById('order-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('order-modal').classList.remove('active');
}

// Delete order
async function deleteOrder(mongoId, orderId) {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) {
        return;
    }
    
    try {
        // Use API_BASE_URL from config.js, or fallback to localhost
        const apiUrl = typeof API_BASE_URL !== 'undefined' 
            ? API_BASE_URL 
            : 'http://localhost:5000';
        
        const response = await fetch(`${apiUrl}/api/order/${orderId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Order deleted successfully!');
            loadOrders(); // Reload orders
        } else {
            alert('Failed to delete order');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
    }
}

// Refresh orders
function refreshOrders() {
    console.log('🔄 Manual refresh triggered');
    loadOrders();
}

// Show loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('orders-table').style.display = 'none';
    document.getElementById('no-orders').style.display = 'none';
}

// Show error
function showError(message) {
    document.getElementById('loading').innerText = '❌ ' + message;
}

// Close modal when clicking outside
document.getElementById('order-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
