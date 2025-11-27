# Usage Guide - Instant Voices

Complete guide to using all features of the Instant Voices application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Voice Controls](#voice-controls)
3. [Pitch and Speed Adjustment](#pitch-and-speed-adjustment)
4. [Custom Voice Upload](#custom-voice-upload)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Opening the Application

Simply open `index.html` in any modern web browser. No installation or setup required.

### Interface Overview

The application has three main sections:

1. **Custom Voices** (Purple) - Upload and play your own audio files
2. **Male Voice** (Blue) - Male voice samples with various styles
3. **Female Voice** (Pink) - Female voice samples with various styles

Each section contains cards for different dialogues.

## Voice Controls

### Voice Type Presets

Each voice card includes 11 preset voice types:

| Voice Type | Icon | Description |
|------------|------|-------------|
| Normal | 🗣️ | Standard speaking voice |
| Energetic | ⚡ | Fast and high-pitched, enthusiastic |
| Calm | 🧘 | Slow and low-pitched, relaxed |
| Professional | 💼 | Measured and authoritative |
| Friendly | 😊 | Warm and approachable |
| Movie Trailer | 🎬 | Deep and dramatic |
| Radio DJ | 📻 | Smooth and flowing |
| News Anchor | 📰 | Clear and measured |
| Cartoon | 🎭 | Very fast and high-pitched |
| Rock Star | 🎸 | Fast with lower tone |
| CEO | 👔 | Deliberate and confident |

**How to Use:**
1. Click on any voice type button
2. The button will highlight to show it's selected
3. Click the play button to hear the voice with that preset

## Pitch and Speed Adjustment

### Pitch Control 🎵

The pitch slider adjusts how high or low the voice sounds.

**Range:** 0.5x to 2.0x (default: 1.0x)

- **Lower (0.5x - 0.9x)**: Deeper, more bass-heavy voice
- **Normal (1.0x)**: Natural pitch
- **Higher (1.1x - 2.0x)**: Sharper, more treble voice

**How to Adjust:**
1. Drag the pitch slider left (lower) or right (higher)
2. The value updates in real-time (e.g., "1.5x")
3. Click play to hear the adjusted voice

### Speed Control ⚡

The speed slider adjusts how fast the voice speaks.

**Range:** 0.5x to 2.0x (default: 1.0x)

- **Slower (0.5x - 0.9x)**: More deliberate, easier to understand
- **Normal (1.0x)**: Natural speaking speed
- **Faster (1.1x - 2.0x)**: Quick, energetic delivery

**How to Adjust:**
1. Drag the speed slider left (slower) or right (faster)
2. The value updates in real-time (e.g., "1.5x")
3. Click play to hear the adjusted voice

### Reset to Default

Click the **"Reset to Default"** button to restore both pitch and speed to 1.0x.

### Combining Controls

You can combine voice type presets with custom pitch and speed:

1. Select a voice type (e.g., "Energetic")
2. Adjust pitch slider (e.g., 1.5x)
3. Adjust speed slider (e.g., 0.8x)
4. Click play to hear the combined effect

**Note:** Custom pitch and speed values override the preset values when not at default (1.0x).

## Custom Voice Upload

### Uploading Audio

1. Navigate to the **Custom Voices** section (purple cards)
2. Find the dialogue you want to upload audio for
3. Click the **"Upload Audio"** button
4. Select an audio file from your computer

**Supported Formats:**
- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- MP4 (.mp4)

**File Size Limit:** 10MB maximum

### Playing Custom Audio

1. After uploading, the play button becomes active
2. Click the play button or anywhere on the card
3. Your custom audio will play

### Deleting Custom Audio

1. Click the delete button (trash icon) next to the upload button
2. Confirm the deletion
3. The card returns to upload-ready state

### Storage

Custom voices are stored in your browser's LocalStorage:
- Persists between sessions
- Specific to your browser and device
- Clearing browser data will remove custom voices

## Keyboard Shortcuts

Currently, the application uses mouse/touch interaction. Keyboard shortcuts may be added in future versions.

## Troubleshooting

### No Sound Playing

**Problem:** Clicking play button but no sound
**Solutions:**
- Check your device volume
- Ensure browser has permission to play audio
- Try a different browser (Chrome recommended)
- Check browser console (F12) for errors

### Voice Sounds Wrong

**Problem:** Voice doesn't match expected gender or style
**Solutions:**
- Different browsers have different voices available
- Try Chrome or Edge for best voice selection
- Check console logs to see which voice is being used
- Reset pitch and speed to default (1.0x)

### Pitch/Speed Not Working

**Problem:** Sliders don't change the voice
**Solutions:**
- Ensure you're dragging the slider, not just clicking
- Check that values are updating (shown next to slider)
- Open browser console (F12) to see debug logs
- Try refreshing the page

### Custom Voice Upload Fails

**Problem:** Can't upload custom audio
**Solutions:**
- Check file format (MP3, WAV, OGG, MP4 only)
- Ensure file is under 10MB
- Clear browser LocalStorage if quota exceeded
- Try a different audio file

### Audio Cuts Off When Switching Tabs

**Problem:** Audio stops when changing tabs
**Solution:** This shouldn't happen - the app uses Media Session API for background playback. If it does:
- Check browser settings for background audio
- Try a different browser
- Ensure browser is up to date

### Sliders Not Visible

**Problem:** Can't see pitch/speed controls
**Solutions:**
- Scroll down on the voice card
- Try zooming out (Ctrl + Mouse Wheel)
- Check browser window size
- Refresh the page

## Browser Console

For advanced troubleshooting, open the browser console (F12) to see detailed logs:

- Pitch/speed updates: `🎵 Pitch updated to X.Xx`
- Voice playback details: Shows rate, pitch, volume, and selected voice
- Custom voice operations: Upload, delete, and playback logs

## Tips and Best Practices

1. **Experiment**: Try different combinations of voice types, pitch, and speed
2. **Start Simple**: Begin with default settings, then adjust gradually
3. **Save Favorites**: Note down your favorite combinations
4. **Custom Voices**: Use high-quality audio files for best results
5. **Browser Choice**: Chrome and Edge provide the most voice options

## Getting Help

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Try a different browser
3. Clear browser cache and reload
4. Open an issue on GitHub with details

---

Enjoy creating unique voice experiences! 🎤
