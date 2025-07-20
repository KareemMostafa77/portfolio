# Senior Frontend Developer Portfolio

A modern, responsive portfolio website built with vanilla JavaScript, HTML5, and CSS3. Features dark/light theme toggle, multi-language support (English/Arabic), and dynamic content loading from JSON files.

## 🌟 Features

- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Theme Toggle**: Light/Dark mode with smooth transitions
- **Multi-language Support**: English and Arabic with RTL support
- **Dynamic Content**: All content loaded from JSON files for easy customization
- **Performance Optimized**: High Lighthouse scores, lazy loading, and optimized assets
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Progressive Web App**: Service worker ready for offline functionality
- **SEO Optimized**: Semantic HTML, meta tags, and structured data

## 📁 Project Structure

```
Portfolio/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles
├── scripts/                # JavaScript modules
│   ├── utils.js           # Utility functions
│   ├── theme.js           # Theme management
│   ├── render.js          # Component rendering
│   └── main.js            # Main application
├── data/                   # JSON data files
│   ├── about.json         # About section data
│   ├── projects.json      # Projects data
│   ├── experience.json    # Work experience
│   ├── skills.json        # Technical skills
│   ├── certifications.json # Certifications
│   └── contact.json       # Contact information
├── lang/                   # Language files
│   ├── en.json            # English translations
│   └── ar.json            # Arabic translations
├── assets/                 # Images and static files
│   └── profile.svg        # Profile image placeholder
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- A local web server (for development)

### Installation

1. **Clone or download** this repository
2. **Replace placeholder content** with your own:
   - Update `data/*.json` files with your information
   - Replace `assets/profile.svg` with your profile image
   - Modify translations in `lang/*.json` files
3. **Serve the files** using a local web server

### Development Server

Choose one of these methods to run a local server:

**Option 1: Python (if installed)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js (if installed)**
```bash
npx serve .
# or
npx http-server
```

**Option 3: PHP (if installed)**
```bash
php -S localhost:8000
```

**Option 4: VS Code Live Server**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

Then open `http://localhost:8000` in your browser.

## ✏️ Customization

### Personal Information

1. **About Section** (`data/about.json`):
   ```json
   {
     "bio": ["Your bio paragraphs..."],
     "stats": [
       {"number": "X+", "label": "Years Experience"},
       // ... more stats
     ]
   }
   ```

2. **Projects** (`data/projects.json`):
   ```json
   [
     {
       "title": "Project Name",
       "description": "Project description...",
       "technologies": ["Tech1", "Tech2"],
       "demo": "https://demo-url.com",
       "github": "https://github.com/username/repo"
     }
   ]
   ```

3. **Experience** (`data/experience.json`):
   ```json
   [
     {
       "position": "Job Title",
       "company": "Company Name",
       "period": "2020 - Present",
       "description": "Job description...",
       "achievements": ["Achievement 1", "Achievement 2"]
     }
   ]
   ```

4. **Skills** (`data/skills.json`): Organized by categories with skill levels
5. **Certifications** (`data/certifications.json`): Professional certifications
6. **Contact** (`data/contact.json`): Contact information and links

### Styling

The CSS uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  /* ... more variables */
}
```

## 🌐 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch" and choose `main` branch
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify

1. Drag and drop your project folder to [Netlify](https://netlify.com)
2. Your site will be deployed automatically

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

### Traditional Hosting

Upload all files to your web hosting provider's public folder (usually `public_html` or `www`).

## 🎯 Performance Tips

1. **Optimize Images**: Use WebP format and appropriate sizes
2. **Lazy Loading**: Images and components load as needed
3. **Minification**: Minify CSS and JavaScript for production
4. **CDN**: Use a CDN for external libraries
5. **Caching**: Configure proper cache headers

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Focus management
- Skip to main content link

## 🌍 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📱 Mobile Features

- Touch-friendly navigation
- Swipe gestures (where applicable)
- Responsive images
- Mobile-optimized forms
- Fast loading on slow connections

## 🔧 Keyboard Shortcuts

- `H` - Navigate to Home
- `A` - Navigate to About
- `P` - Navigate to Projects
- `E` - Navigate to Experience
- `S` - Navigate to Skills
- `C` - Navigate to Contact
- `Ctrl/Cmd + Shift + T` - Toggle theme
- `Ctrl/Cmd + Shift + L` - Toggle language
- `Ctrl/Cmd + Shift + D` - Show debug info

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 Tips for Success

1. **Keep Content Updated**: Regularly update your projects and skills
2. **Optimize for SEO**: Use proper meta tags and structured data
3. **Monitor Performance**: Use tools like Lighthouse and PageSpeed Insights
4. **Get Feedback**: Ask peers to review your portfolio
5. **Track Analytics**: Use Google Analytics to understand visitor behavior

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for errors
2. Ensure you're running a local server (not opening index.html directly)
3. Verify all JSON files have valid syntax
4. Check that all file paths are correct

## 🎨 Design Credits

- Icons: [Font Awesome](https://fontawesome.com/)
- Fonts: [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)
- Color Palette: Modern, accessible color scheme with proper contrast ratios

---

Built with ❤️ using vanilla JavaScript, HTML5, and CSS3. No frameworks, no build tools, just clean and efficient code.
