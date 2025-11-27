# Instant Voices - Indian Voice Samples

A modern web application for listening to professional Indian male and female voice samples with customizable pitch and speed controls.

![Instant Voices](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- **Multiple Voice Types**: Choose from 11 different voice presets including Normal, Energetic, Calm, Professional, Friendly, Movie Trailer, Radio DJ, News Anchor, Cartoon, Rock Star, and CEO
- **Custom Pitch Control**: Adjust voice pitch from 0.5x to 2.0x with real-time slider
- **Custom Speed Control**: Adjust voice speed from 0.5x to 2.0x with real-time slider
- **Gender Options**: Separate male and female voice sections
- **Custom Voice Upload**: Upload your own audio files (MP3, WAV, OGG, MP4) for each dialogue
- **Background Play**: Audio continues playing even when switching tabs
- **Modern UI**: Beautiful glassmorphism design with smooth animations
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/instant-voices.git
cd instant-voices
```

2. Open `index.html` in your web browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

That's it! No build process or dependencies required.

### Usage

1. **Select a Voice Card**: Choose from male, female, or custom voice sections
2. **Choose Voice Type**: Click on any voice type button (Normal, Energetic, Calm, etc.)
3. **Adjust Pitch**: Use the 🎵 Pitch slider to make the voice higher or lower
4. **Adjust Speed**: Use the ⚡ Speed slider to make the voice faster or slower
5. **Play**: Click the play button or anywhere on the card to hear the voice
6. **Reset**: Click "Reset to Default" to restore original settings

### Custom Voice Upload

1. Navigate to the **Custom Voices** section
2. Click **Upload Audio** button on any dialogue card
3. Select an audio file (MP3, WAV, OGG, or MP4 - max 10MB)
4. Click the play button to hear your custom voice
5. Use the delete button to remove uploaded audio

## 📁 Project Structure

```
instant-voices/
├── index.html              # Main entry point
├── README.md              # This file
├── assets/                # Static assets
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   └── script.js     # Main JavaScript
│   └── images/           # Images and icons
├── docs/                  # Documentation
│   └── USAGE.md          # Detailed user guide
└── .git/                  # Git repository
```

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with glassmorphism effects
- **JavaScript (ES6+)**: Interactive functionality
- **Web Speech API**: Text-to-speech synthesis
- **Media Session API**: Background playback controls
- **LocalStorage API**: Custom voice persistence

## 🌐 Browser Compatibility

- ✅ Chrome 33+
- ✅ Edge 14+
- ✅ Safari 7+
- ✅ Firefox 49+
- ✅ Opera 21+

**Note**: Web Speech API support varies by browser. Chrome and Edge provide the best experience with multiple voice options.

## 📱 Responsive Design

The application is fully responsive and works on:
- 🖥️ Desktop (1920px and above)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect
- **Gradient Backgrounds**: Dynamic color gradients
- **Smooth Animations**: Micro-interactions and transitions
- **Color-coded Sections**: Blue for male, pink for female, purple for custom
- **Dark Theme**: Easy on the eyes with vibrant accents

## 🔧 Customization

### Adding New Dialogues

Edit `assets/js/script.js` and add to the `dialogues` array:

```javascript
{
    id: 6,
    text: "Your dialogue text",
    translation: "Translation or description"
}
```

### Adding New Voice Types

Edit `assets/js/script.js` and add to the `voiceTypes` object:

```javascript
yourVoiceType: {
    name: 'Your Voice Type',
    rate: 1.0,  // Speed (0.1-10)
    pitch: 1.0, // Pitch (0-2)
    volume: 1.0, // Volume (0-1)
    icon: '🎤' // Emoji icon
}
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- Google Fonts for the Inter font family
- Web Speech API for text-to-speech functionality
- Media Session API for background playback controls

---

Made with ❤️ for voice enthusiasts
