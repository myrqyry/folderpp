# 📁✨ Folder Icon Generator v2.0

A sophisticated web-based folder icon generator with AI-powered color suggestions, multi-stop gradients, and comprehensive customization options.

![Folder Icon Generator](./docs/preview.png)

## 🌟 Features

### Core Functionality
- **Drag & Drop Interface**: Simply drag and drop images to generate custom folder icons
- **Real-time Preview**: See your icon update in real-time as you adjust settings
- **Multiple Export Sizes**: Download icons in 256px, 512px, 1024px, or 2048px resolutions
- **High-Quality Output**: Canvas-based rendering for crisp, professional results

### Advanced Customization
- **Multi-Stop Gradients**: Create complex gradients with multiple color stops for front panel, back panel, and borders
- **Shape Controls**: Adjust border width, corner radius, taper amount, and tab dimensions
- **Image Transforms**: Scale, rotate, skew, and position your images with precision
- **Visual Effects**: Apply blend modes, opacity, blur, brightness, contrast, and saturation adjustments

### AI-Powered Features
- **Gemini AI Integration**: Get intelligent color suggestions based on your uploaded image
- **Color Harmony Tools**: Generate complementary, analogous, triadic, and monochromatic color schemes
- **Smart Presets**: Professional color combinations designed for modern aesthetics

### Professional Tools
- **Custom Presets**: Save and manage your own color combinations
- **Settings Export/Import**: Share configurations via clipboard
- **Drop Shadow System**: Add realistic shadows with customizable parameters
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

1. **Open the Application**
   ```bash
   # Clone or download this repository
   cd folder-icon-generator-v2
   
   # Start a local server (choose one)
   npm run dev          # Port 3000
   npm start           # Port 8080
   python3 -m http.server 8080
   ```

2. **Generate Your First Icon**
   - Open your browser to `http://localhost:8080`
   - Drag and drop an image onto the canvas area
   - Customize colors, shape, and effects using the settings panel
   - Click "Download Icon" to save your creation

## 🎨 Usage Guide

### Basic Workflow
1. **Load Image**: Drag & drop or click to browse for an image file
2. **Choose Colors**: Select from presets or customize gradients manually
3. **Adjust Shape**: Modify border width, corner radius, and proportions
4. **Apply Effects**: Add shadows, adjust opacity, apply filters
5. **Export**: Download in your preferred size

### Advanced Features

#### AI Color Suggestions
1. Add your Gemini API key in Advanced Settings
2. Upload an image
3. Click "✨ AI Colors" for intelligent color recommendations

#### Custom Presets
1. Configure your desired settings
2. Click "💾 Save Current" in the Presets section
3. Give your preset a custom name
4. Access it anytime from "Your Custom Presets"

#### Settings Transfer
- **Copy Settings**: Export current configuration to clipboard
- **Paste Settings**: Import configuration from another session

## 🛠️ Technical Details

### Project Structure
```
folder-icon-generator-v2/
├── index.html              # Main application interface
├── src/
│   ├── js/                 # JavaScript modules
│   │   ├── state.js        # Application state management
│   │   ├── drawing.js      # Canvas drawing and icon generation
│   │   ├── events.js       # Event handling and user interactions
│   │   ├── presets.js      # Preset management system
│   │   ├── gradients.js    # Gradient creation and management
│   │   ├── shadow.js       # Drop shadow system
│   │   ├── harmony.js      # Color harmony algorithms
│   │   ├── gemini-api.js   # AI integration
│   │   ├── dom-elements.js # DOM element references
│   │   └── utils.js        # Utility functions
│   └── styles/             # CSS stylesheets
│       ├── style.palette.css    # Color system (Catppuccin theme)
│       ├── style.layout.css     # Layout and structure
│       ├── style.controls.css   # UI controls and components
│       ├── style.animations.css # Animations and transitions
│       └── style.responsive.css # Mobile responsiveness
├── docs/                   # Documentation and assets
├── examples/               # Sample icons and presets
└── package.json           # Project configuration
```

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5 Canvas
- **Styling**: Tailwind CSS utility classes, Custom CSS components
- **Color System**: Catppuccin color palette
- **AI Integration**: Google Gemini API
- **Build System**: None required (pure client-side application)

### Browser Requirements
- Modern browsers with ES6 module support
- HTML5 Canvas support
- File API support for drag & drop

## 🔧 Development

### Local Development
```bash
# Start development server
npm run dev

# Run on different port
python3 -m http.server 3000

# Open in browser
# Navigate to http://localhost:3000
```

### Code Organization
- **Modular Architecture**: Each feature is separated into its own module
- **State Management**: Centralized state in `state.js`
- **Event Handling**: Clean separation of UI events in `events.js`
- **Drawing Engine**: Optimized canvas operations in `drawing.js`

### Adding New Features
1. Create new module in `src/js/`
2. Import in `index.html`
3. Add corresponding CSS in appropriate style file
4. Update state management if needed

## 🤖 AI Features Setup

### Gemini API Integration
1. Get your free API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the application
3. Navigate to Advanced Settings
4. Enter your API key and click "💾 Save Key"
5. Test the connection with "🧪 Test Connection"

**Note**: Your API key is stored locally in your browser and never transmitted to our servers.

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized layouts for small screens
- Gesture support for drag & drop
- Mobile-optimized controls

## 🎯 Roadmap

### Planned Features
- [ ] **Batch Processing**: Generate multiple icons at once
- [ ] **Template System**: Pre-made folder icon templates
- [ ] **Animation Preview**: Animated icon previews
- [ ] **Export Formats**: SVG and ICO format support
- [ ] **Cloud Sync**: Save presets to cloud storage
- [ ] **Plugin System**: Extensible architecture for custom effects

### Enhancements
- [ ] **Advanced Filters**: More image processing options
- [ ] **Layer System**: Multiple image layers support
- [ ] **Vector Support**: SVG input and manipulation
- [ ] **Color Picker**: Enhanced color selection tools
- [ ] **Undo/Redo**: History management system

## 🤝 Contributing

Contributions are welcome! This project started as a learning exercise and has evolved into a comprehensive tool. Whether you're a beginner or experienced developer, there are many ways to help improve the project.

### Areas for Contribution
- **UI/UX Improvements**: Better user experience and interface design
- **Performance Optimization**: Canvas rendering and memory usage improvements
- **New Features**: Implement items from the roadmap
- **Bug Fixes**: Report and fix issues
- **Documentation**: Improve guides and examples
- **Testing**: Add automated tests and quality assurance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Catppuccin Color Palette**: Beautiful, consistent color scheme
- **Google Gemini AI**: Intelligent color suggestion capabilities
- **Tailwind CSS**: Utility-first CSS framework
- **Inter Font Family**: Clean, readable typography

---

**Made with ❤️ for creative developers and designers**

*Transform your ordinary folders into beautiful, personalized icons!*
