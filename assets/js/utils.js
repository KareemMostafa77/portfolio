/**
 * Utility functions for the portfolio website
 */

// DOM manipulation utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function to limit API calls
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Smooth scroll to element
const scrollToElement = (selector, offset = 0) => {
    const element = $(selector);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Add loading state
const showLoading = () => {
    $('#loading').classList.add('loading--active');
};

const hideLoading = () => {
    $('#loading').classList.remove('loading--active');
};

// Local storage utilities
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Fetch data with error handling
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
};

// Format date utility
const formatDate = (dateString, locale = 'en') => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
};

// Validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Generate unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Intersection Observer utility for animations
const observeElements = (selector, callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(callback, { ...defaultOptions, ...options });
    
    $$(selector).forEach(element => {
        observer.observe(element);
    });
    
    return observer;
};

// Add animation classes when elements come into view
const initScrollAnimations = () => {
    const animateOnScroll = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    };
    
    // Add base animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Add animation class to elements
    $$('.project-card, .timeline-item, .skill-item, .certification-card').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    observeElements('.animate-on-scroll', animateOnScroll);
};

// Mobile detection
const isMobile = () => {
    return window.innerWidth <= 768;
};

// Get preferred language from browser
const getBrowserLanguage = () => {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ar') ? 'ar' : 'en';
};

// Copy text to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
};

// Show notification
const showNotification = (message, type = 'info', duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already added
    if (!$('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 9999;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .notification--info {
                background-color: #3b82f6;
            }
            
            .notification--success {
                background-color: #10b981;
            }
            
            .notification--error {
                background-color: #ef4444;
            }
            
            .notification--show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('notification--show');
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
};

// Performance monitoring
const performanceMetrics = {
    start: (name) => {
        performance.mark(`${name}-start`);
    },
    
    end: (name) => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        if (measure) {
            console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
    }
};

// Export utilities for use in other modules
window.Utils = {
    $,
    $$,
    debounce,
    throttle,
    scrollToElement,
    showLoading,
    hideLoading,
    storage,
    fetchData,
    formatDate,
    isValidEmail,
    generateId,
    observeElements,
    initScrollAnimations,
    isMobile,
    getBrowserLanguage,
    copyToClipboard,
    showNotification,
    performanceMetrics
};
