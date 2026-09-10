import emailjs from '@emailjs/browser';
// ============ EMAILJS CONFIG ============
const EMAILJS_SERVICE_ID = 'service_8pondab';      // ✅ SERVICE ID
const EMAILJS_TEMPLATE_ID = 'template_fwit88a';    // ✅ TEMPLATE ID
const EMAILJS_PUBLIC_KEY = 'Ky0GmyAXGcmgAffmD';    // ✅ PUBLIC KEY

// ============ LOCAL STORAGE HELPERS ============
const getOrdersFromStorage = () => {
    const saved = localStorage.getItem('molexa_orders');
    return saved ? JSON.parse(saved) : [];
};

const saveOrdersToStorage = (orders) => {
    localStorage.setItem('molexa_orders', JSON.stringify(orders));
};

const getMessagesFromStorage = () => {
    const saved = localStorage.getItem('molexa_messages');
    return saved ? JSON.parse(saved) : [];
};

const saveMessagesToStorage = (messages) => {
    localStorage.setItem('molexa_messages', JSON.stringify(messages));
};

// ============ EMAIL NOTIFICATION (EmailJS) ============
const sendEmailNotification = async (type, data) => {
    try {
        let templateParams = {};
        
        if (type === 'order') {
            templateParams = {
                customer_name: data.name,
                customer_phone: data.phone || 'N/A',
                product: data.product,
                quantity: data.quantity,
                total: data.total,
                address: data.address,
                date: new Date().toLocaleString(),
                to_email: 'shamikkhanzada@gmail.com',
                title: 'New Order'
            };
        } else if (type === 'message') {
            templateParams = {
                customer_name: data.name,
                customer_email: data.email,
                subject: data.subject,
                message: data.message,
                date: new Date().toLocaleString(),
                to_email: 'shamikkhanzada@gmail.com',
                title: 'New Message'
            };
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Email sent successfully!', response);
        return true;
    } catch (error) {
        console.error('❌ Email error:', error);
        return false;
    }
};

// ============ ORDERS ============
export const createOrder = async (orderData) => {
    const orders = getOrdersFromStorage();
    const newOrder = {
        id: orders.length + 1,
        customer: orderData.name,
        product: orderData.product,
        quantity: orderData.quantity,
        total: orderData.total,
        payment: orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        phone: orderData.phone,
        email: orderData.email || '',
        address: orderData.address,
        city: orderData.city,
        instructions: orderData.instructions || ''
    };
    orders.push(newOrder);
    saveOrdersToStorage(orders);
    
    // ✅ SIRF EMAIL — WhatsApp HATAYA!
    await sendEmailNotification('order', orderData);
    
    return { data: { success: true, data: newOrder } };
};

export const getOrders = () => {
    return { data: { data: getOrdersFromStorage() } };
};

export const updateOrder = (id, data) => {
    const orders = getOrdersFromStorage();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...data };
        saveOrdersToStorage(orders);
    }
    return { data: { data: orders[index] } };
};

// ============ MESSAGES ============
export const createMessage = async (formData) => {
    const messages = getMessagesFromStorage();
    const newMessage = {
        id: messages.length + 1,
        ...formData,
        status: 'Unread',
        date: new Date().toISOString().split('T')[0]
    };
    messages.push(newMessage);
    saveMessagesToStorage(messages);
    
    // ✅ SIRF EMAIL — WhatsApp HATAYA!
    await sendEmailNotification('message', formData);
    
    return { data: { success: true, data: newMessage } };
};

export const getMessages = () => {
    return { data: { data: getMessagesFromStorage() } };
};

export const markMessageRead = (id) => {
    const messages = getMessagesFromStorage();
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
        messages[index].status = 'Read';
        saveMessagesToStorage(messages);
    }
    return { data: { data: messages[index] } };
};

// ============ PRODUCTS (Local Data) ============
export const getProducts = () => {
    return {
        data: [
            { id: 1, name: '500 ml', price: 50, description: 'Perfect for on-the-go hydration' },
            { id: 2, name: '1.5 L', price: 100, description: 'Best for daily home use' }
        ]
    };
};

// ============ USERS (Local Data) ============
export const getUsers = () => {
    return { data: { data: [] } };
};

export const createUser = (data) => {
    console.log('User created:', data);
    return { data: { success: true, data } };
};

// ============ STATS ============
export const getStats = () => {
    const orders = getOrdersFromStorage();
    const messages = getMessagesFromStorage();
    return {
        data: {
            totalOrders: orders.length,
            totalMessages: messages.length,
            pendingOrders: orders.filter(o => o.status === 'Pending').length,
            deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
            processingOrders: orders.filter(o => o.status === 'Processing').length,
            unreadMessages: messages.filter(m => m.status === 'Unread').length
        }
    };
};

export default {
    getProducts,
    getUsers,
    createUser,
    getOrders,
    createOrder,
    updateOrder,
    getMessages,
    createMessage,
    markMessageRead,
    getStats
};