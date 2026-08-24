// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ========== ALL IMAGES FROM ASSETS FOLDER ==========
import heroImage from './assets/water.jpg';
import molexaImg from './assets/molexa.jpeg';
import reactSvg from './assets/react.svg';
import viteSvg from './assets/vite.svg';
import waterJpg from './assets/water.jpg';
import whatsappImg from './assets/WhatsApp Image 2026-04-26 at 7.57.36 PM.jpeg';

// ========== PRODUCT IMAGES ==========
import bottle500ml from './assets/WhatsApp Image 2026-04-26 at 7.57.36 PM.jpeg';
import bottle15l from './assets/WhatsApp Image 2026-04-26 at 7.57.36 PM.jpeg';

// Local product data (fallback) with images
const localProducts = [
  {
    id: 1,
    name: "500 ml",
    description: "Perfect for on-the-go hydration",
    price: 50,
    image: bottle500ml
  },
  {
    id: 2,
    name: "1.5 L",
    description: "Best for daily home use",
    price: 100,
    image: bottle15l
  }
];

// Sample orders for admin
const sampleOrders = [
  { id: 1, customer: "Ahmed Khan", product: "500 ml", quantity: 10, total: 500, payment: "Cash on Delivery", status: "Pending", date: "2026-01-15" },
  { id: 2, customer: "Sarah Ali", product: "1.5 L", quantity: 5, total: 500, payment: "Bank Transfer", status: "Processing", date: "2026-01-14" }
];

// Sample messages
const sampleMessages = [
  { id: 1, name: "Ali Raza", email: "ali@email.com", subject: "Bulk Order Inquiry", message: "I need 500 bottles for an event.", date: "2026-01-15", status: "Unread" }
];

function App() {
  // Navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Products
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Order
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    paymentMethod: 'cash',
    instructions: ''
  });
  const [orderStatus, setOrderStatus] = useState({ loading: false, success: false, error: false, message: '' });
  const [showOrderSection, setShowOrderSection] = useState(false);

  // Contact
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, error: false, message: '' });

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Admin - Load from localStorage
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('molexa_orders');
    return saved ? JSON.parse(saved) : sampleOrders;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('molexa_messages');
    return saved ? JSON.parse(saved) : sampleMessages;
  });
  const [showInbox, setShowInbox] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('orders');

  // Refs
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const productsRef = useRef(null);
  const privateLabelRef = useRef(null);
  const contactRef = useRef(null);
  const orderRef = useRef(null);
  const adminRef = useRef(null);

  // ✅ Save orders & messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('molexa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('molexa_messages', JSON.stringify(messages));
  }, [messages]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://your-api-url.com/products`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(null);
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit order - LOCAL STORAGE VERSION (No API needed)
  const submitOrder = (orderData) => {
    setOrderStatus({ loading: true, success: false, error: false, message: '' });
    
    try {
      // Validation
      if (!orderData.name || !orderData.phone || !orderData.address || !orderData.city) {
        setOrderStatus({ loading: false, success: false, error: true, message: '⚠️ Please fill all required fields' });
        return;
      }
      
      if (!orderData.product) {
        setOrderStatus({ loading: false, success: false, error: true, message: '⚠️ Please select a product first' });
        return;
      }
      
      // Create new order
      const newOrder = {
        id: orders.length + 1,
        customer: orderData.name,
        product: orderData.product,
        quantity: orderData.quantity,
        total: orderData.total,
        payment: orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      // Add to orders
      setOrders([newOrder, ...orders]);
      
      // Reset form
      setOrderForm({ name: '', phone: '', email: '', address: '', city: '', paymentMethod: 'cash', instructions: '' });
      setOrderQuantity(1);
      setSelectedProduct(null);
      
      setOrderStatus({ loading: false, success: true, error: false, message: '✅ Order placed successfully!' });
      
      // Hide success after 5 seconds
      setTimeout(() => {
        setOrderStatus({ loading: false, success: false, error: false, message: '' });
      }, 5000);
      
    } catch (err) {
      setOrderStatus({ loading: false, success: false, error: true, message: '❌ Something went wrong. Please try again.' });
    }
  };

  // ✅ Submit contact - LOCAL STORAGE VERSION
  const submitContact = (formData) => {
    setContactStatus({ loading: true, success: false, error: false, message: '' });
    
    try {
      // Validation
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        setContactStatus({ loading: false, success: false, error: true, message: '⚠️ Please fill all fields' });
        return;
      }
      
      const newMessage = {
        id: messages.length + 1,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString().split('T')[0],
        status: 'Unread'
      };
      
      setMessages([newMessage, ...messages]);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      
      setContactStatus({ loading: false, success: true, error: false, message: '✅ Message sent successfully!' });
      
      setTimeout(() => {
        setContactStatus({ loading: false, success: false, error: false, message: '' });
      }, 5000);
      
    } catch (err) {
      setContactStatus({ loading: false, success: false, error: true, message: '❌ Something went wrong. Please try again.' });
    }
  };

  // Handle form changes
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleOrderChange = (e) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  // Handle submits
  const handleContactSubmit = (e) => {
    e.preventDefault();
    submitContact(contactForm);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const total = selectedProduct ? selectedProduct.price * orderQuantity : 0;
    const orderData = {
      ...orderForm,
      product: selectedProduct ? selectedProduct.name : 'Custom Order',
      quantity: orderQuantity,
      total: total
    };
    submitOrder(orderData);
  };

  // ✅ Admin Login - FIXED
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('❌ Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
  };

  // Select product and scroll to order
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setShowOrderSection(true);
    setTimeout(() => {
      if (orderRef.current) {
        orderRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Update quantity
  const updateQuantity = (delta) => {
    const newQty = orderQuantity + delta;
    if (newQty >= 1 && newQty <= 100) {
      setOrderQuantity(newQty);
    }
  };

  // Navigate to section
  const navigateTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // ✅ Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  // Number animation for stats
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targets = entry.target.querySelectorAll('.stat-number');
          targets.forEach(target => {
            const finalValue = parseInt(target.getAttribute('data-value'));
            let currentValue = 0;
            const increment = finalValue / 60;
            const timer = setInterval(() => {
              currentValue += increment;
              if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
              }
              target.textContent = Math.floor(currentValue) + (finalValue > 100 ? '+' : '');
            }, 16);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll event for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate total
  const totalPrice = selectedProduct ? selectedProduct.price * orderQuantity : 0;

  return (
    <div className="App">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => navigateTo('home')}>
            <span className="brand-name">MOLEXA WATER</span>
            <span className="brand-tagline">PURITY AT MOLECULAR LEVEL</span>
          </div>
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="navbar-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); navigateTo('products'); }}>Products</a></li>
              <li><a href="#private-label" onClick={(e) => { e.preventDefault(); navigateTo('private-label'); }}>Private Label</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
              <li><a href="#inbox" onClick={(e) => { e.preventDefault(); setShowInbox(!showInbox); }}>Inbox</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}>Admin</a></li>
            </ul>
            <button className="btn-order-nav" onClick={() => { navigateTo('order'); setShowOrderSection(true); }}>ORDER NOW</button>
          </div>
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/923158969879" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">⚡ MOLECULAR PURIFICATION</span>
            <h1 className="hero-title">
              <span className="gold-text">PURITY AT</span>
              <br />
              <span className="hero-highlight">MOLECULAR LEVEL</span>
            </h1>
            <p className="hero-description">MOLEXA — where every drop is engineered for perfection.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigateTo('products')}>Shop Now</button>
              <button className="btn-secondary" onClick={() => navigateTo('about')}>Learn More</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="molecular-structure">
              <div className="molecule-circle"></div>
              <div className="molecule-circle"></div>
              <div className="molecule-circle"></div>
              <div className="molecule-line"></div>
              <div className="molecule-line"></div>
              <div className="molecule-line"></div>
              <div className="water-drop">💧</div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span className="scroll-line"></span>
          <span className="scroll-text">SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* Logo Meaning Section */}
      <section className="logo-meaning animate-on-scroll">
        <div className="container">
          <h2 className="section-title">LOGO MEANING</h2>
          <p className="section-subtitle">Every element reflects purity, science, and life.</p>
          <div className="logo-cards">
            <div className="logo-card animate-on-scroll">
              <div className="logo-icon">💧</div>
              <h3>WATER DROP</h3>
              <p>Symbol of purity, life and hydration.</p>
            </div>
            <div className="logo-card animate-on-scroll">
              <div className="logo-icon">⚛️</div>
              <h3>MOLECULAR STRUCTURE</h3>
              <p>Purification & molecular precision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Purity Guarantee Section */}
      <section className="purity-guarantee animate-on-scroll">
        <div className="container">
          <div className="purity-grid">
            <div className="purity-content">
              <span className="purity-label">MOLECULAR PURIFICATION · PURITY AT MOLEXA LEVEL</span>
              <div className="purity-badge">BALANCED pH LEVEL</div>
              <h2 className="purity-title">Purity at the Molecular Level</h2>
              <p className="purity-text">We don't just filter — we restructure. Every drop of Molexa goes through advanced molecular purification.</p>
              <div className="purity-features">
                <div className="purity-feature">
                  <span className="purity-feature-icon">🔬</span>
                  <div>
                    <h4>MOLECULAR PURIFICATION</h4>
                    <p>Removing impurities at the molecular scale.</p>
                  </div>
                </div>
                <div className="purity-feature">
                  <span className="purity-feature-icon">💧</span>
                  <div>
                    <h4>PURITY AT MOLEXA LEVEL</h4>
                    <p>Our own standard, beyond ordinary.</p>
                  </div>
                </div>
                <div className="purity-feature">
                  <span className="purity-feature-icon">⚖️</span>
                  <div>
                    <h4>BALANCED pH LEVEL</h4>
                    <p>Perfectly tuned for your health.</p>
                  </div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => navigateTo('about')}>Explore Our Process</button>
            </div>
            <div className="purity-visual">
              <div className="purity-molecule">
                <div className="purity-dot"></div>
                <div className="purity-dot"></div>
                <div className="purity-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats animate-on-scroll">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number" data-value="10">0</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-value="50">0</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-value="100">0</span>
              <span className="stat-label">Pure & Safe</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-value="24">0</span>
              <span className="stat-label">Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Private Label Section */}
      <section id="private-label" ref={privateLabelRef} className="private-label animate-on-scroll">
        <div className="container">
          <div className="private-label-content">
            <span className="private-badge">100% PURE</span>
            <h2 className="section-title">PRIVATE LABEL</h2>
            <p className="section-subtitle">Personalized custom branding for events, corporate gifts, and special occasions.</p>
            <div className="private-cta">
              <h3>ORDER NOW: DRINK PURE, LIVE BETTER</h3>
              <p className="private-phone">📞 CALL/WHATSAPP: 0315 8969879</p>
              <button className="btn-primary" onClick={() => { navigateTo('order'); setShowOrderSection(true); }}>ORDER NOW</button>
              <p className="private-location">📍 36B, LANDHI NO 4, KARACHI</p>
              <p className="private-delivery">🚚 Free Delivery All Pakistan</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="about animate-on-scroll">
        <div className="container">
          <h2 className="section-title">About Molexa Water</h2>
          <p className="section-subtitle">Purity at Molecular Level — Since 2016</p>
          <div className="about-grid">
            <div className="about-content">
              <h3>Our Story</h3>
              <p>Molexa Water was born with a single mission: to deliver the purest drinking water through advanced molecular purification technology.</p>
              <p>Based in Karachi, we combine cutting-edge reverse osmosis with molecular-level filtration to ensure every drop meets our stringent quality standards.</p>
              <img 
                src={waterJpg}
                alt="Molexa Story" 
                className="about-image-story"
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
            <div className="about-mission">
              <h3>Our Mission</h3>
              <p>To provide 100% pure, pH-balanced water that promotes health and well-being for every Pakistani household.</p>
              <div className="mission-features">
                <div className="mission-feature">🔬 Molecular Filtration</div>
                <div className="mission-feature">⚖️ Balanced pH 7.5-8.0</div>
                <div className="mission-feature">✅ 100% Quality Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Molexa Section */}
      <section className="why-molexa animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Why Molexa</h2>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🔬</div>
              <h3>Advanced Technology</h3>
              <p>State-of-the-art molecular purification system.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🌿</div>
              <h3>Eco-Friendly</h3>
              <p>Sustainable packaging & zero-waste initiative.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">✅</div>
              <h3>Quality Certified</h3>
              <p>ISO & PSQCA certified purity standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" ref={productsRef} className="products animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">Choose the perfect pack for your needs</p>
          {loading && <div className="loading">Loading products...</div>}
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card animate-on-scroll">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ 
                      width: '100%', 
                      height: '300px', 
                      objectFit: 'cover',
                      borderRadius: '12px 12px 0 0'
                    }} 
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <p className="product-price">₨ {product.price}</p>
                  <p className="product-delivery">🚚 Free Delivery</p>
                  <div className="product-actions">
                    <button className="btn-primary small" onClick={() => selectProduct(product)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders Section */}
      <section className="bulk-orders animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Bulk Orders</h2>
          <p className="section-subtitle">Special pricing for corporate, events & wholesale orders</p>
          <button className="btn-primary" onClick={() => { navigateTo('contact'); }}>Get Quote</button>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" ref={orderRef} className={`order animate-on-scroll ${showOrderSection ? 'active' : ''}`}>
        <div className="container">
          <h2 className="section-title">Place Your Order</h2>
          <p className="section-subtitle">Fill in your details to confirm your purchase</p>
          
          {/* Order Summary */}
          {selectedProduct && (
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Product:</span>
                <span>{selectedProduct.name}</span>
              </div>
              <div className="summary-item">
                <span>Price per unit:</span>
                <span>₨ {selectedProduct.price}</span>
              </div>
              <div className="summary-item">
                <span>Quantity:</span>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(-1)}>−</button>
                  <span>{orderQuantity}</span>
                  <button onClick={() => updateQuantity(1)}>+</button>
                </div>
              </div>
              <div className="summary-item">
                <span>Delivery Charges:</span>
                <span className="gold-text">FREE</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span className="gold-text">₨ {totalPrice}</span>
              </div>
            </div>
          )}

          <form className="order-form" onSubmit={handleOrderSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter your full name" 
                value={orderForm.name}
                onChange={handleOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                name="phone" 
                placeholder="03XX-XXXXXXX" 
                value={orderForm.phone}
                onChange={handleOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="your@email.com" 
                value={orderForm.email}
                onChange={handleOrderChange}
              />
            </div>
            <div className="form-group">
              <label>Delivery Address *</label>
              <input 
                type="text" 
                name="address" 
                placeholder="Enter your delivery address" 
                value={orderForm.address}
                onChange={handleOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input 
                type="text" 
                name="city" 
                placeholder="Karachi, Lahore, Islamabad..." 
                value={orderForm.city}
                onChange={handleOrderChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Method *</label>
              <div className="payment-options">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cash" 
                    checked={orderForm.paymentMethod === 'cash'}
                    onChange={handleOrderChange}
                  />
                  Cash on Delivery — Pay when you receive
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="bank" 
                    checked={orderForm.paymentMethod === 'bank'}
                    onChange={handleOrderChange}
                  />
                  Bank Transfer — Pay via bank
                </label>
              </div>
            </div>

            {orderForm.paymentMethod === 'bank' && (
              <div className="bank-details">
                <h4>Bank Transfer Details</h4>
                <p><strong>Bank:</strong> Meezan Bank</p>
                <p><strong>Account Title:</strong> Molexa Water (Pvt) Ltd</p>
                <p><strong>Account No:</strong> 1234-567890-01</p>
                <p><strong>IBAN:</strong> PK99MEZN0012345678901</p>
                <p className="bank-note">After transfer, send screenshot on WhatsApp</p>
              </div>
            )}

            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea 
                name="instructions" 
                placeholder="Any special instructions..." 
                rows="3"
                value={orderForm.instructions}
                onChange={handleOrderChange}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary full" disabled={orderStatus.loading}>
              {orderStatus.loading ? 'Processing Order...' : 'Confirm Order'}
            </button>
            {orderStatus.success && (
              <div className="success-state">
                <div className="success-icon">✓</div>
                <p className="success-message">{orderStatus.message}</p>
                <a href="https://wa.me/923158969879" className="btn-secondary whatsapp-btn">💬 Contact on WhatsApp</a>
              </div>
            )}
            {orderStatus.error && <p className="error-message">{orderStatus.message}</p>}
          </form>
        </div>
      </section>

      {/* Private Label Detail Section */}
      <section className="private-label-detail animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Private Label</h2>
          <p className="section-subtitle">Custom branded water for your business or event</p>
          <div className="private-detail-content">
            <h3>Your Brand. Our Water.</h3>
            <p>Molexa Water offers premium private label solutions for:</p>
            <ul className="private-list">
              <li>🏢 Corporate Gifts</li>
              <li>💍 Weddings & Events</li>
              <li>🏨 Hotels & Restaurants</li>
              <li>🎓 Schools & Universities</li>
              <li>📢 Brand Promotions</li>
            </ul>
            <button className="btn-primary" onClick={() => navigateTo('contact')}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Order CTA */}
      <section className="order-cta animate-on-scroll">
        <div className="container">
          <h2>ORDER NOW</h2>
          <h3>DRINK PURE, LIVE BETTER</h3>
          <p className="contact-phone">📞 CALL/WHATSAPP: 0315 8969879</p>
          <button className="btn-primary" onClick={() => { navigateTo('order'); setShowOrderSection(true); }}>ORDER NOW</button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="contact animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">We'd love to hear from you</p>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Send Message</h3>
              <form className="contact-form-small" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your name" 
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Your Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder="Subject" 
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    name="message" 
                    placeholder="Your message" 
                    rows="4"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary full" disabled={contactStatus.loading}>
                  {contactStatus.loading ? 'Sending...' : 'Send Message'}
                </button>
                {contactStatus.success && <p className="success-message">{contactStatus.message}</p>}
                {contactStatus.error && <p className="error-message">{contactStatus.message}</p>}
              </form>
            </div>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>0315 8969879</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>shamikkhanzada@gmail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>Zamanabad Park Rd, Sector 36 B Landhi Town, Karachi</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sat: 9AM - 8PM</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>Chat Now</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🚚</span>
                <div>
                  <strong>Delivery</strong>
                  <p>Free Home Delivery All Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map - Aapki exact location ke saath */}
          <div className="map-placeholder">
            <h4>Find Us</h4>
            <p>📍 Zamanabad Park Rd, Sector 36 B Landhi Town, Karachi</p>
            <div className="map-container">
              <iframe 
                title="Molexa Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28950.215473722827!2d67.1189893!3d24.8701053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e6b6b6b6b6b%3A0x6b6b6b6b6b6b6b6b!2sZamanabad%20Park%20Rd!5e0!3m2!1sen!2s!4v1234567890"
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
            {/* Open in Google Maps Button */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <a 
                href="https://www.google.com/maps?q=Zamanabad+Park+Rd+Landhi+Karachi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ display: 'inline-block', padding: '10px 20px' }}
              >
                📍 Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inbox Section */}
      <section id="inbox" className={`inbox ${showInbox ? 'active' : ''}`}>
        <div className="container">
          <h2 className="section-title">Your Inbox</h2>
          <p className="section-subtitle">All messages from customers</p>
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet.</p>
          ) : (
            <div className="inbox-list">
              {messages.map(msg => (
                <div key={msg.id} className={`inbox-item ${msg.status === 'Unread' ? 'unread' : ''}`}>
                  <div className="inbox-header">
                    <span className="inbox-name">{msg.name}</span>
                    <span className="inbox-date">{msg.date}</span>
                    <span className={`inbox-status ${msg.status.toLowerCase()}`}>{msg.status}</span>
                  </div>
                  <div className="inbox-subject">{msg.subject}</div>
                  <div className="inbox-message">{msg.message}</div>
                  <div className="inbox-email">{msg.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Admin Section */}
      <section id="admin" ref={adminRef} className="admin animate-on-scroll">
        <div className="container">
          {!isLoggedIn ? (
            <div className="admin-login">
              <h2 className="section-title">MOLEXA WATER</h2>
              <h3>Admin Login</h3>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="Enter username" 
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter password" 
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                {loginError && <p className="error-message">{loginError}</p>}
                <button type="submit" className="btn-primary full">Login</button>
                <p className="demo-note">Demo: admin / admin123</p>
              </form>
            </div>
          ) : (
            <div className="admin-dashboard">
              <div className="admin-header">
                <h2>MOLEXA WATER — Dashboard</h2>
                <button className="btn-secondary small" onClick={handleLogout}>Logout</button>
              </div>

              <div className="admin-tabs">
                <button 
                  className={`admin-tab ${activeAdminTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveAdminTab('orders')}
                >
                  📦 Orders
                </button>
                <button 
                  className={`admin-tab ${activeAdminTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveAdminTab('messages')}
                >
                  💬 Messages
                </button>
              </div>

              <div className="admin-stats">
                <div className="admin-stat">
                  <span className="admin-stat-number">{orders.length}</span>
                  <span className="admin-stat-label">Total Orders</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat-number">{orders.filter(o => o.status === 'Pending').length}</span>
                  <span className="admin-stat-label">Pending</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat-number">{orders.filter(o => o.status === 'Delivered').length}</span>
                  <span className="admin-stat-label">Delivered</span>
                </div>
                <div className="admin-stat">
                  <span className="admin-stat-number">{orders.filter(o => o.status === 'Processing').length}</span>
                  <span className="admin-stat-label">Processing</span>
                </div>
              </div>

              {activeAdminTab === 'orders' && (
                <div className="admin-orders">
                  <h3>All Orders</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>₨ {order.total}</td>
                            <td>{order.payment}</td>
                            <td>
                              <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{order.date}</td>
                            <td>
                              <select 
                                className="status-select" 
                                defaultValue={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeAdminTab === 'messages' && (
                <div className="admin-messages">
                  <h3>All Messages</h3>
                  {messages.length === 0 ? (
                    <p className="no-messages">No messages yet.</p>
                  ) : (
                    <div className="messages-list">
                      {messages.map(msg => (
                        <div key={msg.id} className={`message-item ${msg.status === 'Unread' ? 'unread' : ''}`}>
                          <div className="message-header">
                            <span className="message-name">{msg.name}</span>
                            <span className="message-email">{msg.email}</span>
                            <span className="message-date">{msg.date}</span>
                            <span className={`message-status ${msg.status.toLowerCase()}`}>{msg.status}</span>
                          </div>
                          <div className="message-subject">{msg.subject}</div>
                          <div className="message-text">{msg.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="admin-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="btn-secondary small">➕ Add Product</button>
                  <button className="btn-secondary small">👥 Manage Customers</button>
                  <button className="btn-secondary small">📊 View Reports</button>
                  <button className="btn-secondary small">⚙️ Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>MOLEXA WATER</h2>
            <p>Purity at Molecular Level. Premium drinking water with advanced molecular purification technology.</p>
            <p className="footer-whatsapp">💬 WhatsApp: 0315 8969879</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a>
            <a href="#products" onClick={(e) => { e.preventDefault(); navigateTo('products'); }}>Products</a>
            <a href="#private-label" onClick={(e) => { e.preventDefault(); navigateTo('private-label'); }}>Private Label</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a>
          </div>
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <p>📞 0315 8969879</p>
            <p>✉️ shamikkhanzada@gmail.com</p>
            <p>📍 Zamanabad Park Rd, Sector 36 B Landhi Town, Karachi</p>
            <p>🕐 Mon-Sat: 9AM - 8PM</p>
            <p>🚚 Free Delivery All Pakistan</p>
          </div>
          <div className="footer-newsletter">
            <h4>Subscribe for updates & offers</h4>
            <input type="email" placeholder="Your Email" />
            <p className="newsletter-note">We never share your data</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-brand-text">MOLEXA WATER</p>
          <p>© 2026 Molexa Water — Purity at Molecular Level. All Rights Reserved.</p>
          <p>Made with ❤️ in Karachi</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
