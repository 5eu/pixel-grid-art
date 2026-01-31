# 🎨 Pixel Grid Art

A fun and intuitive pixel art editor built with vanilla JavaScript and HTML5 Canvas. Create retro-style pixel art with a grid-based drawing tool!

## 🌐 [✨ Live Demo](https://pixel-grid-art.vercel.app)

## ✨ Features

- **Multiple Grid Sizes** - Choose from 16x16 to 64x64
- **Adjustable Pixel Size** - Zoom in/out for comfortable drawing
- **Drawing Tools**
  - ✏️ **Draw** - Paint pixels
  - 🧹 **Erase** - Remove pixels
  - 🪣 **Fill** - Flood fill areas
  - 💧 **Eyedropper** - Pick colors from the canvas
- **Color Palette** - Quick access to 16 common colors
- **Custom Colors** - Full color picker support
- **Undo** - Undo up to 50 steps (Ctrl+Z)
- **Export** - Download as PNG
- **Keyboard Shortcuts** - Fast workflow

## 🎮 How to Use

### Drawing
1. Select a grid size (16x16 to 64x64)
2. Choose a tool (Draw, Erase, Fill, Eyedropper)
3. Pick a color
4. Click and drag to draw!

### Tools

**Draw (D)** - Paint pixels with the selected color
**Erase (E)** - Remove pixels (paint with white)
**Fill (F)** - Flood fill connected areas
**Eyedropper (I)** - Pick colors from existing pixels

### Keyboard Shortcuts

| Key | Action |
| --- | ------ |
| D | Draw tool |
| E | Erase tool |
| F | Fill tool |
| I | Eyedropper tool |
| C | Clear canvas |
| Ctrl+Z | Undo |

## 🎯 Use Cases

- **Game Sprites** - Create characters and objects
- **Icons** - Design pixel-perfect icons
- **Avatars** - Make unique profile pictures
- **Retro Art** - Nostalgic 8-bit style art
- **Practice** - Learn pixel art techniques
- **Fun** - Just have fun creating!

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5 Canvas** - High-performance drawing
- **CSS3** - Beautiful gradients and styling
- **Canvas API** - Image manipulation

## 🧮 Technical Highlights

### Flood Fill Algorithm
Implements a stack-based flood fill for the fill tool, efficiently coloring connected regions.

### State Management
- Undo history (up to 50 states)
- Canvas state saved as data URLs
- Efficient memory management

### Canvas Rendering
- Pixel-perfect grid rendering
- Anti-aliasing disabled for crisp pixels
- Optimized redrawing

### Color Picking
- Reads pixel data from canvas
- Converts RGB to HEX
- Updates color picker automatically

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🎨 Example Creations

Perfect for creating:
- 8-bit game characters
- Retro icons
- Emoji-style art
- Pixel avatars
- Retro logos

## 📦 Export

Downloads are saved as PNG with transparent grid removed. File format:
- **Format:** PNG
- **Filename:** `pixel-art-[timestamp].png`
- **Quality:** Lossless

## 🚀 Features Breakdown

### Grid System
- Dynamic grid size selection
- Adjustable pixel size (8px to 24px)
- Grid overlay for precise drawing

### Color Management
- 16-color quick palette
- Full color picker
- Eyedropper tool for color sampling

### Drawing Engine
- Mouse drag support
- Smooth drawing experience
- Real-time pixel rendering

### History System
- Undo support (Ctrl+Z)
- 50-step history buffer
- Efficient state storage

## 🌐 Live Demo

[View Live Demo](#) *(Coming soon)*

## 🤝 Contributing

Ideas for future features:
- Redo functionality
- Layers support
- Animation frames
- More export formats (GIF, SVG)
- Import existing images
- Shape tools (line, rectangle, circle)

## 📝 License

MIT

---

Built for pixel art enthusiasts and retro gaming fans 🕹️
