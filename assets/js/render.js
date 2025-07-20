/**
 * Render components and manage dynamic content
 */

class ComponentRenderer {
    constructor() {
        this.dataCache = new Map();
        this.components = {
            about: this.renderAboutSection.bind(this),
            projects: this.renderProjectsSection.bind(this),
            experience: this.renderExperienceSection.bind(this),
            skills: this.renderSkillsSection.bind(this),
            certifications: this.renderCertificationsSection.bind(this),
            contact: this.renderContactSection.bind(this)
        };
    }
    
    async init() {
        Utils.performanceMetrics.start('componentInit');
        
        try {
            // Load all data files
            await this.loadAllData();
            
            // Render all components
            await this.renderAllComponents();
            
            // Initialize scroll animations
            Utils.initScrollAnimations();
            
            Utils.performanceMetrics.end('componentInit');
            
        } catch (error) {
            console.error('Error initializing components:', error);
            this.renderFallbackContent();
        }
    }
    
    async loadAllData() {
        const dataFiles = [
            'assets/data/about.json',
            'assets/data/projects.json',
            'assets/data/experience.json',
            'assets/data/skills.json',
            'assets/data/certifications.json',
            'assets/data/contact.json'
        ];
        
        const promises = dataFiles.map(async (file) => {
            const key = file.split('/').pop().replace('.json', '');
            const data = await Utils.fetchData(file);
            if (data) {
                this.dataCache.set(key, data);
            }
        });
        
        await Promise.all(promises);
    }
    
    async renderAllComponents() {
        const renderPromises = Object.keys(this.components).map(component => 
            this.components[component]()
        );
        
        await Promise.all(renderPromises);
    }
    
    async renderAboutSection() {
        const data = this.dataCache.get('about');
        if (!data) return;
        
        // Render bio
        const bioContainer = Utils.$('#about-bio');
        if (bioContainer && data.bio) {
            bioContainer.innerHTML = data.bio.map(paragraph => 
                `<p>${paragraph}</p>`
            ).join('');
        }
    }
    
    async renderProjectsSection() {
        const data = this.dataCache.get('projects');
        if (!data) return;
        
        const container = Utils.$('#projects-grid');
        if (!container) return;

        // Generate dynamic filter buttons
        this.generateProjectFilters(data);
        
        container.innerHTML = data.map(project => `
            <div class="project-card" data-company="${project.company}" onclick="window.location.href='project-detail.html?project=${encodeURIComponent(project.title)}'">
                <div class="project-card__image" data-project-image="${project.title}">
                    ${project.image ? 
                        `<img src="${project.image}" alt="${project.title}" onerror="this.parentElement.classList.add('project-card__image--no-image'); this.style.display='none';" onload="this.parentElement.classList.remove('project-card__image--no-image');">` : 
                        ''
                    }
                </div>
                <div class="project-card__content">
                    <div class="project-card__company">${project.company}</div>
                    <h3 class="project-card__title">${project.title}</h3>
                    <div class="project-card__actions">
                        ${project.demo ? 
                            `<a href="${project.demo}" class="btn btn--primary btn--small" target="_blank" rel="noopener" onclick="event.stopPropagation()">
                                <i class="fas fa-external-link-alt"></i>
                                Live Demo
                            </a>` : ''
                        }
                        <a href="project-detail.html?project=${encodeURIComponent(project.title)}" class="btn btn--outline btn--small" onclick="event.stopPropagation()">
                            <i class="fas fa-info-circle"></i>
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Handle images that don't have a src or failed to load
        this.handleProjectImages(data);
        
        // Initialize project filtering
        this.initProjectFiltering(data);
    }

    generateProjectFilters(projects) {
        const filterContainer = Utils.$('#project-filters');
        if (!filterContainer) return;

        // Get unique companies from projects
        const companies = [...new Set(projects.map(project => project.company))];
        
        // Generate filter buttons HTML
        const filterButtons = companies.map((company, index) => {
            const isActive = index === 0 ? 'filter-btn--active' : '';
            return `<button class="filter-btn ${isActive}" data-filter="${company}">${company}</button>`;
        }).join('');

        filterContainer.innerHTML = filterButtons;
    }
    
    handleProjectImages(projects) {
        // Preload first few project images for better performance
        const imagesToPreload = projects.slice(0, 6).filter(p => p.image);
        imagesToPreload.forEach(project => {
            const img = new Image();
            img.src = project.image;
        });
        
        const imageContainers = Utils.$$('.project-card__image');
        
        imageContainers.forEach((container, index) => {
            const project = projects[index];
            
            // If no image URL provided, add no-image class immediately
            if (!project.image) {
                container.classList.add('project-card__image--no-image');
            }
        });
    }
    
    initProjectFiltering(projects) {
        const filterButtons = Utils.$$('.filter-btn');
        const projectCards = Utils.$$('.project-card');
        
        // Apply initial filter (first company)
        if (filterButtons.length > 0) {
            const initialFilter = filterButtons[0].getAttribute('data-filter');
            this.applyProjectFilter(projectCards, initialFilter);
        }
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
                // Add active class to clicked button
                btn.classList.add('filter-btn--active');
                
                const filter = btn.getAttribute('data-filter');
                this.applyProjectFilter(projectCards, filter);
            });
        });
    }
    
    applyProjectFilter(projectCards, filter) {
        projectCards.forEach(card => {
            const company = card.getAttribute('data-company');
            if (company === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    async renderExperienceSection() {
        const data = this.dataCache.get('experience');
        if (!data) return;
        
        const container = Utils.$('#experience-timeline');
        if (!container) return;
        
        container.innerHTML = data.map(experience => `
            <div class="timeline-item">
                <div class="timeline-item__content">
                    <div class="timeline-item__header">
                        <h3 class="timeline-item__title">${experience.position}</h3>
                        <div class="timeline-item__company">${experience.company}</div>
                        <div class="timeline-item__period">${experience.period}</div>
                    </div>
                    <p class="timeline-item__description">${experience.description}</p>
                    ${experience.achievements && experience.achievements.length > 0 ? `
                        <ul class="timeline-item__achievements">
                            ${experience.achievements.map(achievement => 
                                `<li>${achievement}</li>`
                            ).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    async renderSkillsSection() {
        const data = this.dataCache.get('skills');
        if (!data) return;
        
        const container = Utils.$('#skills-content');
        if (!container) return;
        
        container.innerHTML = data.map(category => `
            <div class="skills-category">
                <h3 class="skills-category__title">
                    <i class="${category.icon}"></i>
                    ${category.title}
                </h3>
                <div class="skills-grid">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-item__icon">
                                <i class="${skill.icon}"></i>
                            </div>
                            <div class="skill-item__name">${skill.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    async renderCertificationsSection() {
        const data = this.dataCache.get('certifications');
        if (!data) return;
        
        const container = Utils.$('#certifications-grid');
        if (!container) return;
        
        container.innerHTML = data.map(cert => `
            <div class="certification-card">
                <div class="certification-card__badge">
                    <i class="${cert.icon}"></i>
                </div>
                <h3 class="certification-card__title">${cert.title}</h3>
                <div class="certification-card__issuer">${cert.issuer}</div>
                <div class="certification-card__date">${cert.date}</div>
                ${cert.link ? `
                    <a href="${cert.link}" class="btn btn--secondary btn--sm" target="_blank" rel="noopener">
                        View Certificate
                    </a>
                ` : ''}
            </div>
        `).join('');
    }
    
    async renderContactSection() {
        const data = this.dataCache.get('contact');
        if (!data) return;
        
        // Filter out GitHub from contact cards (but keep it for footer)
        const contactCardsData = data.filter(contact => contact.title !== 'GitHub');
        
        // Render contact cards
        const contactCardsContainer = Utils.$('.contact__cards');
        if (contactCardsContainer) {
            contactCardsContainer.innerHTML = contactCardsData.map(contact => `
                <a href="${contact.link}" class="contact-card" ${contact.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
                    <div class="contact-card__icon">
                        <i class="${contact.icon}"></i>
                    </div>
                    <h3 class="contact-card__title">${contact.title}</h3>
                    <span class="contact-card__action">
                        ${contact.title === 'Email' ? 'Send Email' : 
                          contact.title === 'Phone' ? 'Call Now' : 
                          contact.title === 'LinkedIn' ? 'Connect' : 
                          contact.title === 'WhatsApp' ? 'Chat Now' :
                          'Visit'}
                    </span>
                </a>
            `).join('');
        }
        
        // Render footer social links (uses original data with GitHub included)
        this.renderFooterSocial(data);
    }
    
    renderFooterSocial(contactData) {
        const footerSocialContainer = Utils.$('.footer__social');
        if (!footerSocialContainer || !contactData) return;
        
        // Filter for social media links (GitHub and LinkedIn)
        const socialLinks = contactData.filter(contact => 
            contact.title === 'GitHub' || contact.title === 'LinkedIn'
        );
        
        footerSocialContainer.innerHTML = socialLinks.map(social => `
            <a href="${social.link}" class="footer__social-link" aria-label="${social.title}" target="_blank" rel="noopener">
                <i class="${social.icon}"></i>
            </a>
        `).join('');
    }
    
    renderFallbackContent() {
        console.log('Rendering fallback content...');
        
        // Fallback content for when data files are not available
        const fallbackData = {
            about: {
                bio: [
                    "I'm a passionate Senior Frontend Developer with over 8 years of experience in creating exceptional digital experiences.",
                    "Specialized in Angular, React, and modern JavaScript frameworks, I've led multiple successful projects from concept to deployment."
                ]
            }
        };
        
        // Render fallback about section
        const bioContainer = Utils.$('#about-bio');
        if (bioContainer) {
            bioContainer.innerHTML = fallbackData.about.bio.map(p => `<p>${p}</p>`).join('');
        }
    }
    
    // Public method to refresh a specific component
    async refreshComponent(componentName) {
        if (this.components[componentName]) {
            await this.components[componentName]();
        }
    }
    
    // Public method to get cached data
    getData(key) {
        return this.dataCache.get(key);
    }
    
    // Public method to update data cache
    updateData(key, data) {
        this.dataCache.set(key, data);
    }
}

// Navigation and scroll management
class NavigationManager {
    constructor() {
        this.navbar = null;
        this.navLinks = [];
        this.sections = [];
        this.currentSection = '';
        
        this.init();
    }
    
    init() {
        this.navbar = Utils.$('.navbar');
        this.navLinks = Utils.$$('.navbar__link');
        this.sections = Utils.$$('section[id]');
        
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    this.scrollToSection(targetId);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
        
        // Mobile menu toggle
        const mobileToggle = Utils.$('#mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = Utils.$('.navbar__menu');
            const mobileToggle = Utils.$('#mobile-menu-toggle');
            
            if (navMenu && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    scrollToSection(sectionId) {
        const section = Utils.$(`#${sectionId}`);
        if (section) {
            const navbarHeight = this.navbar ? this.navbar.offsetHeight : 70;
            const targetPosition = section.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    handleScroll() {
        // Add/remove scrolled class to navbar
        if (this.navbar) {
            if (window.scrollY > 50) {
                this.navbar.classList.add('navbar--scrolled');
            } else {
                this.navbar.classList.remove('navbar--scrolled');
            }
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
    }
    
    updateActiveNavLink() {
        const navbarHeight = this.navbar ? this.navbar.offsetHeight : 70;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let activeSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        });
        
        if (activeSection !== this.currentSection) {
            this.currentSection = activeSection;
            
            // Update active link
            this.navLinks.forEach(link => {
                link.classList.remove('navbar__link--active');
                if (link.getAttribute('href') === `#${activeSection}`) {
                    link.classList.add('navbar__link--active');
                }
            });
        }
    }
    
    toggleMobileMenu() {
        const navMenu = Utils.$('.navbar__menu');
        const mobileToggle = Utils.$('#mobile-menu-toggle');
        const isActive = navMenu?.classList.contains('navbar__menu--active');
        
        if (navMenu) {
            navMenu.classList.toggle('navbar__menu--active');
        }
        
        if (mobileToggle) {
            mobileToggle.classList.toggle('mobile-menu-toggle--active');
        }
        
        // Prevent body scroll when menu is open
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Add/remove click outside listener
        if (!isActive) {
            document.addEventListener('click', this.handleClickOutside.bind(this));
        } else {
            document.removeEventListener('click', this.handleClickOutside.bind(this));
        }
    }
    
    handleClickOutside(event) {
        const navMenu = Utils.$('.navbar__menu');
        const mobileToggle = Utils.$('#mobile-menu-toggle');
        const navbar = Utils.$('.navbar');
        
        if (navbar && !navbar.contains(event.target)) {
            this.closeMobileMenu();
        }
    }
    
    closeMobileMenu() {
        const navMenu = Utils.$('.navbar__menu');
        const mobileToggle = Utils.$('#mobile-menu-toggle');
        
        if (navMenu) {
            navMenu.classList.remove('navbar__menu--active');
        }
        
        if (mobileToggle) {
            mobileToggle.classList.remove('mobile-menu-toggle--active');
        }
        
        document.body.style.overflow = '';
        
        // Remove click outside listener
        document.removeEventListener('click', this.handleClickOutside.bind(this));
    }
}

// Contact form management
class ContactFormManager {
    constructor() {
        this.form = null;
        this.submitButton = null;
        
        this.init();
    }
    
    init() {
        this.form = Utils.$('#contact-form');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        
        if (this.form) {
            this.bindEvents();
        }
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(data);
            
            Utils.showNotification('Message sent successfully!', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            Utils.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For demo purposes, always resolve
                // In real implementation, make actual API call
                console.log('Form data:', data);
                resolve();
            }, 2000);
        });
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && value && !Utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        // Minimum length validation
        if (value && field.minLength && value.length < field.minLength) {
            isValid = false;
            errorMessage = `Minimum ${field.minLength} characters required.`;
        }
        
        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('form__input--error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'form__error';
            errorElement.textContent = message;
            
            field.parentNode.appendChild(errorElement);
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('form__input--error');
        
        const existingError = field.parentNode.querySelector('.form__error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    setLoadingState(loading) {
        if (this.submitButton) {
            this.submitButton.disabled = loading;
            
            if (loading) {
                this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            } else {
                this.submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        }
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing portfolio components...');
    
    // Initialize component renderer first
    window.componentRenderer = new ComponentRenderer();
    await window.componentRenderer.init();
    
    // Initialize navigation
    window.navigationManager = new NavigationManager();
    
    // Initialize contact form
    window.contactFormManager = new ContactFormManager();
    
    console.log('All components initialized successfully');
});

// Export for use in other modules
window.ComponentRenderer = ComponentRenderer;
window.NavigationManager = NavigationManager;
window.ContactFormManager = ContactFormManager;
