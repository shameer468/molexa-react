const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// ============ CORS ============
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ============ DATA STORAGE ============
let users = [
    { id: 1, name: 'Rahul', email: 'rahul@email.com' },
    { id: 2, name: 'Priya', email: 'priya@email.com' }
];

let orders = [];
let messages = [];
let orderIdCounter = 1;
let messageIdCounter = 1;

// ============ YOUR CONTACT DETAILS ============
const YOUR_PHONE = '923158969879';  // WhatsApp number
const YOUR_EMAIL = 'shamikkhanzada@gmail.com';  // Your email

// ============ WHATSAPP NOTIFICATION ============
const sendWhatsAppNotification = (type, data) => {
    let message = '';
    if (type === 'order') {
        message = `🆕 *NEW ORDER!*\n━━━━━━━━━━━━━━━━\n👤 Customer: ${data.name}\n📞 Phone: ${data.phone || 'N/A'}\n📦 Product: ${data.product}\n🔢 Quantity: ${data.quantity}\n💰 Total: Rs. ${data.total}\n📍 Address: ${data.address}\n📅 ${new Date().toLocaleString()}\n━━━━━━━━━━━━━━━━\n🔗 Reply: https://wa.me/${YOUR_PHONE}`;
    } else if (type === 'message') {
        message = `📩 *NEW MESSAGE!*\n━━━━━━━━━━━━━━━━\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📝 Subject: ${data.subject}\n💬 Message: ${data.message}\n📅 ${new Date().toLocaleString()}\n━━━━━━━━━━━━━━━━\n🔗 Reply: https://wa.me/${YOUR_PHONE}`;
    }
    
    const whatsappUrl = `https://wa.me/${YOUR_PHONE}?text=${encodeURIComponent(message)}`;
    console.log(`\n📱 ===== WHATSAPP NOTIFICATION =====`);
    console.log(`📝 ${message}`);
    console.log(`🔗 Click to send: ${whatsappUrl}`);
    console.log(`✅ Send to: ${YOUR_PHONE}`);
    console.log(`===================================\n`);
    
    return whatsappUrl;
};

// ============ EMAIL NOTIFICATION ============
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: YOUR_EMAIL,
        pass: 'ptbmddueszaoavxq'  // ✅ App Password daal diya (bina brackets ke)
   },
    tls: {
         rejectUnauthorized: false  // ✅ Ye line add karo!
    }
});

const sendEmailNotification = async (type, data) => {
    let subject, html;
    
    if (type === 'order') {
        subject = `🆕 New Order - ${data.name}`;
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #C9A227;">🆕 New Order Received!</h2>
                <hr style="border: 1px solid #C9A227;">
                <table style="width: 100%;">
                    <tr><td><strong>👤 Customer:</strong></td><td>${data.name}</td></tr>
                    <tr><td><strong>📞 Phone:</strong></td><td>${data.phone || 'N/A'}</td></tr>
                    <tr><td><strong>📧 Email:</strong></td><td>${data.email || 'N/A'}</td></tr>
                    <tr><td><strong>📦 Product:</strong></td><td>${data.product}</td></tr>
                    <tr><td><strong>🔢 Quantity:</strong></td><td>${data.quantity}</td></tr>
                    <tr><td><strong>💰 Total:</strong></td><td>Rs. ${data.total}</td></tr>
                    <tr><td><strong>📍 Address:</strong></td><td>${data.address}</td></tr>
                    <tr><td><strong>🏙️ City:</strong></td><td>${data.city || 'N/A'}</td></tr>
                    <tr><td><strong>📅 Date:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                </table>
                <hr style="border: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">This is an automated notification from Molexa Water.</p>
            </div>
        `;
    } else if (type === 'message') {
        subject = `📩 New Message - ${data.name}`;
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #C9A227;">📩 New Message Received!</h2>
                <hr style="border: 1px solid #C9A227;">
                <table style="width: 100%;">
                    <tr><td><strong>👤 Name:</strong></td><td>${data.name}</td></tr>
                    <tr><td><strong>📧 Email:</strong></td><td>${data.email}</td></tr>
                    <tr><td><strong>📝 Subject:</strong></td><td>${data.subject}</td></tr>
                    <tr><td><strong>💬 Message:</strong></td><td>${data.message}</td></tr>
                    <tr><td><strong>📅 Date:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                </table>
                <hr style="border: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">This is an automated notification from Molexa Water.</p>
            </div>
        `;
    }

    try {
        await emailTransporter.sendMail({
            from: `"Molexa Water" <${YOUR_EMAIL}>`,
            to: YOUR_EMAIL,
            subject: subject,
            html: html
        });
        console.log(`📧 Email sent to ${YOUR_EMAIL}`);
        return true;
    } catch (error) {
        console.log(`⚠️ Email error: ${error.message}`);
        return false;
    }
};

// ============ API ROUTES ============

// Get orders
app.get('/api/orders', (req, res) => {
    res.json({ success: true, count: orders.length, data: orders });
});

// Create order - WITH NOTIFICATIONS
app.post('/api/orders', async (req, res) => {
    const { name, phone, email, address, city, product, quantity, total, paymentMethod, instructions } = req.body;
    
    if (!name || !phone || !address || !city || !product) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill all required fields' 
        });
    }
    
    const newOrder = {
        id: orderIdCounter++,
        customer: name,
        phone,
        email: email || '',
        address,
        city,
        product,
        quantity: quantity || 1,
        total: total || 0,
        payment: paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer',
        status: 'Pending',
        instructions: instructions || '',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
    };
    
    orders.push(newOrder);
    
    // ✅ SEND NOTIFICATIONS
    sendWhatsAppNotification('order', {
        name,
        phone,
        product,
        quantity: quantity || 1,
        total: total || 0,
        address
    });
    
    await sendEmailNotification('order', {
        name,
        phone,
        email,
        address,
        city,
        product,
        quantity: quantity || 1,
        total: total || 0
    });
    
    res.status(201).json({ 
        success: true, 
        message: '✅ Order placed successfully! Notifications sent!',
        data: newOrder 
    });
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    orders[index] = { ...orders[index], ...req.body };
    res.json({ success: true, message: 'Order updated', data: orders[index] });
});

// Get messages
app.get('/api/messages', (req, res) => {
    res.json({ success: true, count: messages.length, data: messages });
});

// Create message - WITH NOTIFICATIONS
app.post('/api/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill all fields' 
        });
    }
    
    const newMessage = {
        id: messageIdCounter++,
        name,
        email,
        subject,
        message,
        status: 'Unread',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
    };
    
    messages.push(newMessage);
    
    // ✅ SEND NOTIFICATIONS
    sendWhatsAppNotification('message', { name, email, subject, message });
    await sendEmailNotification('message', { name, email, subject, message });
    
    res.status(201).json({ 
        success: true, 
        message: '✅ Message sent successfully! Notifications sent!',
        data: newMessage 
    });
});

// Mark message as read
app.put('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Message not found' });
    }
    messages[index] = { ...messages[index], status: 'Read' };
    res.json({ success: true, message: 'Message marked as read', data: messages[index] });
});

// Users
app.get('/api/users', (req, res) => {
    res.json({ success: true, count: users.length, data: users });
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email required' });
    }
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json({ success: true, message: 'User created', data: newUser });
});

// Products
app.get('/api/products', (req, res) => {
    res.json([
        { id: 1, name: '500 ml', price: 50, description: 'Perfect for on-the-go hydration' },
        { id: 2, name: '1.5 L', price: 100, description: 'Best for daily home use' }
    ]);
});

// Stats
app.get('/api/stats', (req, res) => {
    res.json({
        totalOrders: orders.length,
        totalMessages: messages.length,
        pendingOrders: orders.filter(o => o.status === 'Pending').length,
        deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
        processingOrders: orders.filter(o => o.status === 'Processing').length,
        unreadMessages: messages.filter(m => m.status === 'Unread').length
    });
});

// ============ START SERVER ============
const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ ====================================`);
    console.log(`   🚀 MOLEXA API IS RUNNING!`);
    console.log(`   📡 http://localhost:${PORT}`);
    console.log(`   📚 /api/orders`);
    console.log(`   📚 /api/messages`);
    console.log(`   📚 /api/products`);
    console.log(`   📚 /api/users`);
    console.log(`   📊 /api/stats`);
    console.log(`✅ ====================================`);
    console.log(`\n📱 WhatsApp: ${YOUR_PHONE}`);
    console.log(`📧 Email: ${YOUR_EMAIL}`);
    console.log(`✅ Notifications Enabled!\n`);
});