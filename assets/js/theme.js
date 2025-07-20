/**
 * Theme management for dark/light mode
 */

class ThemeManager {
    constructor() {
        this.themeKey = 'portfolio-theme';
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.themeToggle = null;
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.updateToggleButton();
    }
    
    getStoredTheme() {
        return Utils.storage.get(this.themeKey);
    }
    
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        Utils.storage.set(this.themeKey, theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme } 
        }));
    }
    
    updateMetaThemeColor(theme) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        
        const colors = {
            light: '#ffffff',
            dark: '#0f172a'
        };
        
        metaTheme.content = colors[theme];
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleButton();
        
        // Add a subtle animation feedback
        this.animateToggle();
        
        // Analytics or tracking can be added here
        this.trackThemeChange(newTheme);
    }
    
    animateToggle() {
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    updateToggleButton() {
        this.themeToggle = Utils.$('#theme-toggle');
        if (this.themeToggle) {
            const isLight = this.currentTheme === 'light';
            this.themeToggle.setAttribute('aria-label', 
                isLight ? 'Switch to dark mode' : 'Switch to light mode'
            );
            
            // Update button title for accessibility
            this.themeToggle.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
        }
    }
    
    bindEvents() {
        // Theme toggle button
        document.addEventListener('click', (e) => {
            const themeToggle = e.target.closest('#theme-toggle');
            if (themeToggle) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
                this.updateToggleButton();
            }
        });
        
        // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    trackThemeChange(theme) {
        // Analytics tracking can be implemented here
        console.log(`Theme changed to: ${theme}`);
        
        // Example: Google Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'theme_name': theme,
                'event_category': 'engagement'
            });
        }
    }
    
    // Public methods for external use
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
            this.updateToggleButton();
        }
    }
    
    // Method to preload theme-specific assets
    preloadThemeAssets() {
        const theme = this.currentTheme;
        
        // Preload theme-specific images or assets
        if (theme === 'dark') {
            // Preload dark theme assets
            this.preloadImage('/assets/logo-dark.png');
        } else {
            // Preload light theme assets
            this.preloadImage('/assets/logo-light.png');
        }
    }
    
    preloadImage(src) {
        const img = new Image();
        img.src = src;
    }
    
    // Export theme configuration for CSS-in-JS or dynamic styling
    getThemeConfig() {
        const themes = {
            light: {
                primary: '#2563eb',
                background: '#ffffff',
                text: '#1e293b',
                secondary: '#64748b'
            },
            dark: {
                primary: '#3b82f6',
                background: '#0f172a',
                text: '#f8fafc',
                secondary: '#cbd5e1'
            }
        };
        
        return themes[this.currentTheme];
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
window.ThemeManager = ThemeManager;
