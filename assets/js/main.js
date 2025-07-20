/**
 * Main application entry point
 */

class PortfolioApp {
    constructor() {
        this.isInitialized = false;
        this.loadStartTime = performance.now();
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Portfolio Application...');
            
            // Show loading indicator
            Utils.showLoading();
            
            // Wait for all critical components to be ready
            await this.waitForComponents();
            
            // Initialize performance monitoring
            this.initPerformanceMonitoring();
            
            // Initialize analytics (if needed)
            this.initAnalytics();
            
            // Initialize PWA features
            this.initPWA();
            
            // Initialize accessibility features
            this.initAccessibility();
            
            // Initialize keyboard shortcuts
            this.initKeyboardShortcuts();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Hide loading indicator
            Utils.hideLoading();
            
            // Log initialization time
            const loadTime = performance.now() - this.loadStartTime;
            console.log(`✅ Portfolio initialized in ${loadTime.toFixed(2)}ms`);
            
            // Fire initialization complete event
            this.fireInitializationComplete();
            
        } catch (error) {
            console.error('❌ Failed to initialize portfolio:', error);
            this.handleInitializationError(error);
        }
    }
    
    async waitForComponents() {
        // Wait for critical components to be available
        const maxWaitTime = 10000; // 10 seconds
        const checkInterval = 100; // 100ms
        let waited = 0;
        
        return new Promise((resolve, reject) => {
            const checkComponents = () => {
                const componentsReady = 
                    window.navigationManager &&
                    window.componentRenderer;
                
                if (componentsReady) {
                    resolve();
                } else if (waited >= maxWaitTime) {
                    reject(new Error('Components initialization timeout'));
                } else {
                    waited += checkInterval;
                    setTimeout(checkComponents, checkInterval);
                }
            };
            
            checkComponents();
        });
    }
    
    initPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observeWebVitals();
        
        // Monitor resource loading
        this.observeResourceTiming();
        
        // Monitor JavaScript errors
        this.observeErrors();
    }
    
    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            
            // Track LCP in analytics
            this.trackMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                
                // Track FID in analytics
                this.trackMetric('FID', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
            
            // Track CLS in analytics
            this.trackMetric('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    observeResourceTiming() {
        // Monitor slow loading resources
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 1000) { // Resources taking more than 1 second
                    console.warn('Slow resource:', entry.name, entry.duration + 'ms');
                }
            });
        }).observe({ entryTypes: ['resource'] });
    }
    
    observeErrors() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
            
            // Track error in analytics
            this.trackError(event.error);
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            
            // Track error in analytics
            this.trackError(event.reason);
        });
    }
    
    initAnalytics() {
        // Initialize Google Analytics or other analytics service
        // This is a placeholder - replace with actual analytics implementation
        
        console.log('📊 Analytics initialized');
        
        // Track page view
        this.trackPageView();
        
        // Track user engagement
        this.trackEngagement();
    }
    
    initPWA() {
        // Register service worker for PWA functionality
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        // Handle install prompt
        this.handleInstallPrompt();
        
        // Handle online/offline status
        this.handleConnectionStatus();
    }
    
    async registerServiceWorker() {
        try {
            // Note: You'll need to create a service worker file
            // const registration = await navigator.serviceWorker.register('/sw.js');
            // console.log('📱 Service Worker registered:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }
    
    handleInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or banner
            console.log('💾 App install prompt available');
        });
        
        // Handle app installation
        window.addEventListener('appinstalled', () => {
            console.log('📱 App was installed');
            deferredPrompt = null;
        });
    }
    
    handleConnectionStatus() {
        const updateConnectionStatus = () => {
            if (navigator.onLine) {
                console.log('🌐 Back online');
                Utils.showNotification('Connection restored', 'success', 2000);
            } else {
                console.log('📴 Gone offline');
                Utils.showNotification('You are offline', 'info', 3000);
            }
        };
        
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
    }
    
    initAccessibility() {
        // Focus management
        this.initFocusManagement();
        
        // Keyboard navigation
        this.initKeyboardNavigation();
        
        // Screen reader announcements
        this.initScreenReaderSupport();
        
        console.log('♿ Accessibility features initialized');
    }
    
    initFocusManagement() {
        // Focus visible polyfill for better focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add focus styles for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            body:not(.keyboard-navigation) *:focus {
                outline: none;
            }
            
            .keyboard-navigation *:focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    initKeyboardNavigation() {
        // Close modals/menus with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu
                if (window.navigationManager) {
                    window.navigationManager.closeMobileMenu();
                }
                
                // Close any open modals or overlays
                const modals = Utils.$$('.modal.active, .overlay.active');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }
    
    initScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        
        const srOnlyStyle = document.createElement('style');
        srOnlyStyle.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(srOnlyStyle);
        
        document.body.appendChild(liveRegion);
        
        // Make live region globally accessible
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }
    
    initKeyboardShortcuts() {
        const shortcuts = {
            // Navigation shortcuts
            'h': () => Utils.scrollToElement('#home', 70),
            'a': () => Utils.scrollToElement('#about', 70),
            'p': () => Utils.scrollToElement('#projects', 70),
            'e': () => Utils.scrollToElement('#experience', 70),
            's': () => Utils.scrollToElement('#skills', 70),
            'c': () => Utils.scrollToElement('#contact', 70),
            
            // Utility shortcuts (Ctrl/Cmd + key)
            'ctrl+shift+t': () => window.themeManager?.toggleTheme(),
            
            // Debug shortcuts (Ctrl/Cmd + Shift + D)
            'ctrl+shift+d': () => this.showDebugInfo()
        };
        
        document.addEventListener('keydown', (e) => {
            const key = this.getShortcutKey(e);
            
            if (shortcuts[key] && !this.isInputFocused()) {
                e.preventDefault();
                shortcuts[key]();
            }
        });
        
        console.log('⌨️ Keyboard shortcuts initialized');
    }
    
    getShortcutKey(event) {
        const modifiers = [];
        
        if (event.ctrlKey || event.metaKey) modifiers.push('ctrl');
        if (event.shiftKey) modifiers.push('shift');
        if (event.altKey) modifiers.push('alt');
        
        const key = event.key.toLowerCase();
        
        return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }
    
    showDebugInfo() {
        const debugInfo = {
            theme: window.themeManager?.getCurrentTheme(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : 'Not available',
            performance: {
                timing: performance.timing,
                memory: performance.memory
            }
        };
        
        console.table(debugInfo);
        Utils.showNotification('Debug info logged to console', 'info');
    }
    
    fireInitializationComplete() {
        window.dispatchEvent(new CustomEvent('portfolioready', {
            detail: {
                loadTime: performance.now() - this.loadStartTime,
                components: {
                    theme: !!window.themeManager,
                    renderer: !!window.componentRenderer,
                    navigation: !!window.navigationManager
                }
            }
        }));
    }
    
    handleInitializationError(error) {
        Utils.hideLoading();
        
        // Show error message to user
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container';
        errorContainer.innerHTML = `
            <div class="error-message">
                <h2>Oops! Something went wrong</h2>
                <p>There was an error loading the portfolio. Please refresh the page to try again.</p>
                <button onclick="window.location.reload()" class="btn btn--primary">
                    Refresh Page
                </button>
            </div>
        `;
        
        // Add error styles
        const errorStyle = document.createElement('style');
        errorStyle.textContent = `
            .error-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .error-message {
                text-align: center;
                max-width: 500px;
                padding: 2rem;
            }
            
            .error-message h2 {
                color: var(--text-primary);
                margin-bottom: 1rem;
            }
            
            .error-message p {
                color: var(--text-secondary);
                margin-bottom: 2rem;
            }
        `;
        
        document.head.appendChild(errorStyle);
        document.body.appendChild(errorContainer);
    }
    
    // Analytics helper methods
    trackPageView() {
        // Track page view in analytics
        console.log('📊 Page view tracked');
    }
    
    trackEngagement() {
        let startTime = Date.now();
        let maxScroll = 0;
        
        // Track scroll depth
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            maxScroll = Math.max(maxScroll, scrollPercent);
        }, 1000));
        
        // Track time on page when user leaves
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            console.log('📊 Time on page:', timeOnPage, 'ms');
            console.log('📊 Max scroll depth:', maxScroll, '%');
        });
    }
    
    trackMetric(name, value) {
        // Track performance metric in analytics
        console.log(`📊 ${name}:`, value);
    }
    
    trackError(error) {
        // Track error in analytics
        console.log('📊 Error tracked:', error);
    }
    
    // Public methods
    getInitializationStatus() {
        return this.isInitialized;
    }
    
    getLoadTime() {
        return this.isInitialized ? performance.now() - this.loadStartTime : null;
    }
}

// Auto-initialize the application
const portfolioApp = new PortfolioApp();

// Export for global access
window.portfolioApp = portfolioApp;
