// Voice types with different characteristics - EXAGGERATED for clear differences
const voiceTypes = {
    normal: {
        name: 'Normal',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        icon: '🗣️'
    },
    energetic: {
        name: 'Energetic',
        rate: 1.5,  // Much faster
        pitch: 1.3,  // Higher pitch
        volume: 1.0,
        icon: '⚡'
    },
    calm: {
        name: 'Calm',
        rate: 0.6,  // Much slower
        pitch: 0.8,  // Lower pitch
        volume: 0.9,
        icon: '🧘'
    },
    professional: {
        name: 'Professional',
        rate: 0.9,
        pitch: 0.9,
        volume: 1.0,
        icon: '💼'
    },
    friendly: {
        name: 'Friendly',
        rate: 1.1,
        pitch: 1.2,  // Slightly higher
        volume: 1.0,
        icon: '😊'
    },
    movieTrailer: {
        name: 'Movie Trailer',
        rate: 0.5,  // Very slow and dramatic
        pitch: 0.6,  // Deep, resonant voice
        volume: 1.0,
        icon: '🎬'
    },
    radioDJ: {
        name: 'Radio DJ',
        rate: 1.2,  // Smooth and flowing
        pitch: 1.1,  // Slightly elevated, friendly
        volume: 1.0,
        icon: '📻'
    },
    newsAnchor: {
        name: 'News Anchor',
        rate: 0.95,  // Clear and measured
        pitch: 0.95,  // Authoritative
        volume: 1.0,
        icon: '📰'
    },
    cartoon: {
        name: 'Cartoon',
        rate: 1.6,  // Very fast, playful
        pitch: 1.5,  // High and squeaky
        volume: 1.0,
        icon: '🎭'
    },
    rockStar: {
        name: 'Rock Star',
        rate: 1.3,  // Fast and energetic
        pitch: 0.7,  // Lower, raspy tone
        volume: 1.0,
        icon: '🎸'
    },
    ceo: {
        name: 'CEO',
        rate: 0.85,  // Deliberate, confident
        pitch: 0.85,  // Commanding presence
        volume: 1.0,
        icon: '👔'
    }
};

// Voice dialogues data
const dialogues = [
    {
        id: 1,
        text: "Kam karo kam karo",
        translation: "Work, work"
    },
    {
        id: 2,
        text: "Need maximum hiring",
        translation: "We need maximum hiring"
    },
    {
        id: 3,
        text: "Go on field",
        translation: "Go to the field"
    },
    {
        id: 4,
        text: "Good job good job",
        translation: "Good job, good job"
    },
    {
        id: 5,
        text: "Need maximum numbers",
        translation: "We need maximum numbers"
    }
];

// Speech synthesis setup
let currentUtterance = null;
let currentCard = null;
let currentAudio = null;

// Custom voice storage (using localStorage)
const customVoices = {};

// Store event listeners for cleanup
const eventListeners = new Map();

// Load custom voices from localStorage
function loadCustomVoices() {
    try {
        const stored = localStorage.getItem('customVoices');
        if (stored) {
            const parsed = JSON.parse(stored);
            Object.assign(customVoices, parsed);
        }
    } catch (error) {
        console.error('Error loading custom voices:', error);
        // Clear corrupted data
        localStorage.removeItem('customVoices');
    }
}

// Save custom voices to localStorage
function saveCustomVoices() {
    try {
        localStorage.setItem('customVoices', JSON.stringify(customVoices));
    } catch (error) {
        console.error('Error saving custom voices:', error);
        if (error.name === 'QuotaExceededError') {
            alert('Storage limit exceeded. Please delete some custom voices.');
        }
    }
}

// Utility to read the currently selected voice type for a card
function getSelectedVoiceType(card) {
    const activeButton = card.querySelector('.voice-type-btn.active');
    if (activeButton?.dataset.type) {
        return activeButton.dataset.type;
    }
    return card.dataset.voiceType || card.getAttribute('data-voice-type') || 'normal';
}

// Initialize the voice cards
function initializeVoiceCards() {
    const customContainer = document.getElementById('custom-voices');
    const maleContainer = document.getElementById('male-voices');
    const femaleContainer = document.getElementById('female-voices');
    
    dialogues.forEach(dialogue => {
        // Create custom voice card
        const customCard = createCustomVoiceCard(dialogue);
        customContainer.appendChild(customCard);
        
        // Create male voice card
        const maleCard = createVoiceCard(dialogue, 'male');
        maleContainer.appendChild(maleCard);
        
        // Create female voice card
        const femaleCard = createVoiceCard(dialogue, 'female');
        femaleContainer.appendChild(femaleCard);
    });
}

// Create a voice card element
function createVoiceCard(dialogue, gender) {
    const card = document.createElement('div');
    card.className = 'voice-card';
    card.dataset.dialogueId = dialogue.id;
    card.dataset.gender = gender;
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-number">#${dialogue.id}</span>
            <button class="play-button" aria-label="Play voice">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
        <div class="dialogue-text">${dialogue.text}</div>
        <div class="dialogue-translation">${dialogue.translation}</div>
        
        <div class="voice-type-selector">
            ${Object.entries(voiceTypes).map(([key, type]) => `
                <button class="voice-type-btn ${key === 'normal' ? 'active' : ''}" data-type="${key}" title="${type.name}">
                    <span class="voice-type-icon">${type.icon}</span>
                    <span class="voice-type-label">${type.name}</span>
                </button>
            `).join('')}
        </div>
        
        <div class="waveform">
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
        </div>
    `;
    
    // Set default voice type
    card.dataset.voiceType = 'normal';
    card.setAttribute('data-voice-type', 'normal');
    
    // Add voice type selector listeners
    const voiceTypeButtons = card.querySelectorAll('.voice-type-btn');
    voiceTypeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remove active class from all buttons in this card
            voiceTypeButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update card's voice type
            const selectedType = btn.dataset.type || 'normal';
            card.dataset.voiceType = selectedType;
            card.setAttribute('data-voice-type', selectedType);
        });
    });
    
    // Add click event listener
    const playButton = card.querySelector('.play-button');
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const voiceType = getSelectedVoiceType(card);
        playVoice(dialogue.text, gender, card, voiceType);
    });
    
    card.addEventListener('click', () => {
        const voiceType = getSelectedVoiceType(card);
        playVoice(dialogue.text, gender, card, voiceType);
    });
    
    return card;
}

// Create a custom voice card with file upload
function createCustomVoiceCard(dialogue) {
    const card = document.createElement('div');
    card.className = 'voice-card custom-voice-card';
    card.dataset.dialogueId = dialogue.id;
    
    const hasCustomVoice = customVoices[dialogue.id];
    
    card.innerHTML = `
        <div class="card-header">
            <span class="card-number">#${dialogue.id}</span>
            <button class="play-button ${!hasCustomVoice ? 'disabled' : ''}" aria-label="Play voice" ${!hasCustomVoice ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
        <div class="dialogue-text">${dialogue.text}</div>
        <div class="dialogue-translation">${dialogue.translation}</div>
        
        <div class="custom-upload-section">
            <input type="file" id="upload-${dialogue.id}" accept="audio/*,video/mp4" class="file-input" />
            <button class="upload-button" data-dialogue-id="${dialogue.id}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
                </svg>
                <span>${hasCustomVoice ? 'Change Audio' : 'Upload Audio'}</span>
            </button>
            ${hasCustomVoice ? '<button class="delete-button" title="Delete audio"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/></svg></button>' : ''}
        </div>
        
        <div class="waveform">
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
        </div>
    `;
    
    // Get references to elements
    const fileInput = card.querySelector('.file-input');
    const uploadButton = card.querySelector('.upload-button');
    
    console.log(`🔧 Setting up upload button for dialogue #${dialogue.id}`);
    console.log('Upload button element:', uploadButton);
    console.log('File input element:', fileInput);
    
    // Add event listener to the upload button
    uploadButton.addEventListener('click', (e) => {
        console.log(`🖱️ Upload button clicked for dialogue #${dialogue.id}`, e.type);
        e.preventDefault();
        e.stopPropagation();
        console.log('📂 Triggering file input click...');
        try {
            // Create a new mouse event to ensure it works across all browsers
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            fileInput.dispatchEvent(clickEvent);
            console.log('✅ File input click triggered');
        } catch (error) {
            console.error('❌ Error triggering file input:', error);
            alert('Error opening file dialog. Please try again.');
        }
    });
    
    // File upload handler
    fileInput.addEventListener('change', async (e) => {
        console.log('📁 File input changed');
        const file = e.target.files && e.target.files[0];
        
        if (!file) {
            console.log('⚠️ No file selected or file dialog was cancelled');
            return;
        }
        
        // Check file type
        const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg', 'video/mp4', 'audio/mp4'];
        if (!validTypes.some(type => file.type.includes(type.replace('audio/', '').replace('video/', '')))) {
            alert('Please select a valid audio/video file (MP3, WAV, OGG, or MP4)');
            return;
        }
        
        // Check file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('File is too large. Maximum size is 10MB.');
            return;
        }
        
        console.log(`📄 File selected: ${file.name} (${file.type}, ${file.size} bytes)`);
            
            // Convert file to base64 for storage
            const reader = new FileReader();
            
            reader.onerror = (error) => {
                console.error('❌ FileReader error:', error);
                alert('Error reading file. Please try again.');
            };
            
            reader.onload = (event) => {
                try {
                    console.log('✅ File loaded successfully');
                    
                    // Check localStorage quota before saving
                    try {
                        customVoices[dialogue.id] = {
                            data: event.target.result,
                            type: file.type,
                            name: file.name,
                            size: file.size,
                            lastModified: file.lastModified
                        };
                        
                        // Test if we can save to localStorage
                        localStorage.setItem('customVoices', JSON.stringify(customVoices));
                        console.log('💾 Saved to localStorage');
                        
                        // Update UI
                        updateCustomVoiceUI(card, dialogue.id, true);
                        
                        alert(`Audio uploaded successfully for dialogue #${dialogue.id}!`);
                    } catch (storageError) {
                        console.error('❌ Error saving to localStorage:', storageError);
                        if (storageError.name === 'QuotaExceededError') {
                            alert('Storage limit exceeded. Please delete some custom voices or clear your browser data.');
                        } else {
                            alert('Error saving audio. Please try again.');
                        }
                        return;
                    }
                } catch (error) {
                    console.error('❌ Error processing file:', error);
                    alert('Error processing file. Please try again.');
                }
            };
            
            reader.readAsDataURL(file);
    });
    
    // Delete button handler
    const deleteButton = card.querySelector('.delete-button');
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this audio?')) {
                deleteCustomVoice(dialogue.id, card);
            }
        });
    }
    
    // Play button handler
    const playButton = card.querySelector('.play-button');
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (customVoices[dialogue.id]) {
            playCustomVoice(dialogue.id, card);
        }
    });
    
    card.addEventListener('click', () => {
        if (customVoices[dialogue.id]) {
            playCustomVoice(dialogue.id, card);
        }
    });
    
    return card;
}

// Delete custom voice
function deleteCustomVoice(dialogueId, card) {
    try {
        delete customVoices[dialogueId];
        localStorage.setItem('customVoices', JSON.stringify(customVoices));
        
        // Update UI
        updateCustomVoiceUI(card, dialogueId, false);
        
        // Clear the file input
        const fileInput = card.querySelector('.file-input');
        if (fileInput) {
            fileInput.value = ''; // Reset the file input
        }
        
        console.log(`🗑️ Deleted custom voice for dialogue #${dialogueId}`);
    } catch (error) {
        console.error('❌ Error deleting custom voice:', error);
        alert('Error deleting audio. Please try again.');
    }
}

// Play custom voice
function playCustomVoice(dialogueId, card) {
    // Stop any currently playing audio or speech
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    if (currentCard) {
        currentCard.classList.remove('playing');
        updatePlayButton(currentCard, false);
    }
    
    // If clicking the same card that's playing, just stop
    if (currentCard === card && card.classList.contains('playing')) {
        currentCard = null;
        // Clear media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
        }
        return;
    }
    
    const voiceData = customVoices[dialogueId];
    if (!voiceData) return;
    
    const audio = new Audio(voiceData.data);
    currentAudio = audio;
    
    // Get dialogue info for media session
    const dialogue = dialogues.find(d => d.id === dialogueId);
    
    // Set up Media Session API for background playback controls
    if ('mediaSession' in navigator && dialogue) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: dialogue.text,
            artist: 'Custom Voice',
            album: 'Instant Voices',
            artwork: [
                { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzY2N2VlYSIvPjxwYXRoIGQ9Ik04IDVWMTlMMTkgMTJMOCA1WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', sizes: '128x128', type: 'image/svg+xml' }
            ]
        });
        
        navigator.mediaSession.setActionHandler('play', () => {
            audio.play();
        });
        
        navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause();
        });
        
        navigator.mediaSession.setActionHandler('stop', () => {
            audio.pause();
            audio.currentTime = 0;
            card.classList.remove('playing');
            updatePlayButton(card, false);
            currentCard = null;
            currentAudio = null;
        });
    }
    
    audio.onplay = () => {
        card.classList.add('playing');
        updatePlayButton(card, true);
        currentCard = card;
        console.log(`🎵 Playing custom voice for dialogue #${dialogueId} (Background play enabled)`);
    };
    
    audio.onended = () => {
        card.classList.remove('playing');
        updatePlayButton(card, false);
        currentCard = null;
        currentAudio = null;
        // Clear media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
        }
    };
    
    audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        card.classList.remove('playing');
        updatePlayButton(card, false);
        currentCard = null;
        currentAudio = null;
        // Clear media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
        }
    };
    
    audio.play();
}


// Play voice using Web Speech API
function playVoice(text, gender, card, voiceType = 'normal') {
    // Stop any currently playing voice
    if (currentUtterance) {
        speechSynthesis.cancel();
        if (currentCard) {
            currentCard.classList.remove('playing');
            updatePlayButton(currentCard, false);
        }
    }
    
    // If clicking the same card that's playing, just stop
    if (currentCard === card && card.classList.contains('playing')) {
        currentCard = null;
        return;
    }
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Try to find an appropriate voice based on gender AND voice type
    let selectedVoice = null;
    
    // Get all available voices
    let voicePool = [...voices];
    
    // Filter by language (prioritize English voices)
    const englishVoices = voicePool.filter(voice => 
        voice.lang.startsWith('en') || // English variants
        voice.lang.includes('en-') ||  // Any English dialect
        voice.name.toLowerCase().includes('english')
    );
    
    // If we found English voices, use them; otherwise fall back to all voices
    voicePool = englishVoices.length > 0 ? englishVoices : voicePool;
    
    // Further filter by Indian English if available
    const indianVoices = voicePool.filter(voice => 
        voice.lang.includes('en-IN') || 
        voice.name.toLowerCase().includes('india') ||
        voice.name.toLowerCase().includes('raveena') ||
        voice.name.toLowerCase().includes('aditi')
    );
    
    if (indianVoices.length > 0) {
        voicePool = indianVoices;
    }
    
    // Filter by gender
    if (voicePool.length > 0) {
        if (gender === 'female') {
            // Look for female voice patterns
            let femaleVoices = voicePool.filter(voice => {
                const nameLower = voice.name.toLowerCase();
                return (
                    (nameLower.includes('female') || 
                     nameLower.includes('woman') ||
                     nameLower.includes('zira') ||
                     nameLower.includes('heera') ||
                     nameLower.includes('raveena') ||
                     nameLower.includes('aditi') ||
                     nameLower.includes('neerja')) &&
                    !nameLower.includes('male') &&
                    !nameLower.includes('man')
                );
            });
            
            // If no specific female voice found, use a voice that's NOT explicitly male
            if (femaleVoices.length === 0) {
                femaleVoices = voicePool.filter(voice => {
                    const nameLower = voice.name.toLowerCase();
                    return !nameLower.includes('male') && !nameLower.includes('man');
                });
            }
            
            voicePool = femaleVoices.length > 0 ? femaleVoices : voicePool;
        } else {
            // Look for male voice patterns
            let maleVoices = voicePool.filter(voice => {
                const nameLower = voice.name.toLowerCase();
                return (
                    nameLower.includes('male') || 
                    nameLower.includes('man') ||
                    nameLower.includes('david') ||
                    nameLower.includes('mark') ||
                    nameLower.includes('prabhat')
                ) && !nameLower.includes('female');
            });
            
            // If no specific male voice found, use any voice that's not explicitly female
            if (maleVoices.length === 0) {
                maleVoices = voicePool.filter(voice => {
                    const nameLower = voice.name.toLowerCase();
                    return !nameLower.includes('female') && !nameLower.includes('woman');
                });
            }
            
            voicePool = maleVoices.length > 0 ? maleVoices : voicePool;
        }
        
        // Select voice based on type
        const typeIndex = Object.keys(voiceTypes).indexOf(voiceType) % voicePool.length;
        selectedVoice = voicePool[typeIndex] || voicePool[0];
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Get voice type settings
    const typeSettings = voiceTypes[voiceType] || voiceTypes.normal;
    
    // Set voice properties based on type and gender - EXTREME but browser-compliant
    // Browser limits: rate (0.1-10), pitch (0-2), volume (0-1)
    utterance.lang = 'en-IN';
    
    // Apply rate (clamped to browser limits)
    utterance.rate = Math.max(0.1, Math.min(10, typeSettings.rate));
    
    // Apply pitch with gender modifier (clamped to browser limits)
    const genderPitchModifier = gender === 'female' ? 1.2 : 0.85;
    utterance.pitch = Math.max(0, Math.min(2, typeSettings.pitch * genderPitchModifier));
    
    utterance.volume = typeSettings.volume;
    
    // Debug logging with visual emphasis
    console.log(`
╔════════════════════════════════════════════════════════════╗
║ 🎵 VOICE PLAYBACK DETAILS
╠════════════════════════════════════════════════════════════╣
║ Voice Type: ${voiceType.toUpperCase()} ${typeSettings.icon}
║ Gender: ${gender === 'male' ? '👨 Male' : '👩 Female'}
║ Rate: ${utterance.rate.toFixed(2)} (${utterance.rate < 0.8 ? 'SLOW' : utterance.rate > 1.2 ? 'FAST' : 'NORMAL'})
║ Pitch: ${utterance.pitch.toFixed(2)} (${utterance.pitch < 0.8 ? 'LOW' : utterance.pitch > 1.2 ? 'HIGH' : 'NORMAL'})
║ Volume: ${utterance.volume.toFixed(2)}
║ Voice: ${selectedVoice ? selectedVoice.name : 'Default System Voice'}
╚════════════════════════════════════════════════════════════╝
    `.trim());
    
    // Add visual indicator to card showing active voice type
    const existingIndicator = card.querySelector('.active-voice-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'active-voice-indicator';
    indicator.innerHTML = `${typeSettings.icon} ${typeSettings.name}`;
    indicator.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
        z-index: 10;
        animation: fadeIn 0.3s ease;
    `;
    card.appendChild(indicator);
    
    // Remove indicator after 2 seconds
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => indicator.remove(), 300);
        }
    }, 2000);
    
    // Set up Media Session API for background playback controls
    if ('mediaSession' in navigator) {
        const dialogue = dialogues.find(d => d.text === text);
        if (dialogue) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: dialogue.text,
                artist: `${gender === 'male' ? 'Male' : 'Female'} Voice - ${typeSettings.name}`,
                album: 'Instant Voices',
                artwork: [
                    { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzY2N2VlYSIvPjxwYXRoIGQ9Ik04IDVWMTlMMTkgMTJMOCA1WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', sizes: '128x128', type: 'image/svg+xml' }
                ]
            });
            
            navigator.mediaSession.setActionHandler('play', () => {
                if (currentUtterance) {
                    speechSynthesis.resume();
                }
            });
            
            navigator.mediaSession.setActionHandler('pause', () => {
                if (currentUtterance) {
                    speechSynthesis.pause();
                }
            });
            
            navigator.mediaSession.setActionHandler('stop', () => {
                speechSynthesis.cancel();
                if (currentCard) {
                    currentCard.classList.remove('playing');
                    updatePlayButton(currentCard, false);
                }
                currentCard = null;
                currentUtterance = null;
            });
        }
    }
    
    // Event handlers
    utterance.onstart = () => {
        card.classList.add('playing');
        updatePlayButton(card, true);
        currentCard = card;
        console.log(`🎵 Playing ${gender} voice (Background play enabled)`);
    };
    
    utterance.onend = () => {
        card.classList.remove('playing');
        updatePlayButton(card, false);
        currentCard = null;
        currentUtterance = null;
        // Clear media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
        }
    };
    
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        card.classList.remove('playing');
        updatePlayButton(card, false);
        currentCard = null;
        currentUtterance = null;
        // Clear media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
        }
    };
    
    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
}

// Update play button icon
function updatePlayButton(card, isPlaying) {
    const playButton = card.querySelector('.play-button');
    const svg = playButton.querySelector('svg');
    
    if (isPlaying) {
        svg.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';
        playButton.classList.add('playing');
    } else {
        svg.innerHTML = '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
        playButton.classList.remove('playing');
    }
}

// Load voices with retry mechanism
function loadVoices() {
    return new Promise((resolve) => {
        if (!window.speechSynthesis) {
            console.warn('Web Speech API not supported');
            resolve([]);
            return;
        }

        let voices = [];
        let retries = 0;
        const maxRetries = 3;
        const timeoutDuration = 2000; // 2 seconds

        const checkVoices = () => {
            voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                console.log(`Loaded ${voices.length} voices`);
                resolve(voices);
            } else if (retries < maxRetries) {
                retries++;
                console.log(`No voices found, retrying (${retries}/${maxRetries})...`);
                setTimeout(checkVoices, 500);
            } else {
                console.warn('No voices available after retries');
                resolve([]);
            }
        };

        // Initial check
        checkVoices();

        // Also listen for voiceschanged event
        const onVoicesChanged = () => {
            console.log('Voices changed, reloading...');
            checkVoices();
        };

        addCleanupListener(speechSynthesis, 'voiceschanged', onVoicesChanged);
    });
}

// Add event listener with cleanup
function addCleanupListener(element, event, handler) {
    element.addEventListener(event, handler);
    if (!eventListeners.has(element)) {
        eventListeners.set(element, []);
    }
    eventListeners.get(element).push({ event, handler });
}

// Cleanup all event listeners
function cleanupEventListeners() {
    eventListeners.forEach((listeners, element) => {
        listeners.forEach(({ event, handler }) => {
            element.removeEventListener(event, handler);
        });
    });
    eventListeners.clear();
}

// Update custom voice UI
function updateCustomVoiceUI(card, dialogueId, hasVoice) {
    const playButton = card.querySelector('.play-button');
    const uploadButton = card.querySelector('.upload-button');
    const uploadLabel = uploadButton?.querySelector('span');
    const deleteButton = card.querySelector('.delete-button');
    
    if (hasVoice) {
        playButton?.classList.remove('disabled');
        if (playButton) playButton.disabled = false;
        if (uploadLabel) uploadLabel.textContent = 'Change Audio';
        
        if (!deleteButton && uploadButton?.parentNode) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.title = 'Delete audio';
            deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/></svg>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this audio?')) {
                    deleteCustomVoice(dialogueId, card);
                }
            });
            uploadButton.parentNode.insertBefore(deleteBtn, uploadButton.nextSibling);
        }
    } else {
        playButton?.classList.add('disabled');
        if (playButton) playButton.disabled = true;
        if (uploadLabel) uploadLabel.textContent = 'Upload Audio';
        deleteButton?.remove();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Check for Web Speech API support
    if (!window.speechSynthesis) {
        alert('Your browser does not support the Web Speech API. Please use a modern browser like Chrome, Edge, or Firefox.');
        return;
    }

    try {
        // Show loading state
        document.body.classList.add('loading');
        
        // Load custom voices from storage
        loadCustomVoices();
        
        // Load voices first
        await loadVoices();
        
        // Initialize voice cards
        initializeVoiceCards();
        
        // Add stagger animation to cards
        const cards = document.querySelectorAll('.voice-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    } catch (error) {
        console.error('Initialization error:', error);
        alert('An error occurred while initializing the application. Please try refreshing the page.');
    } finally {
        document.body.classList.remove('loading');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    // Stop any ongoing speech
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    
    // Stop any playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Clean up event listeners
    cleanupEventListeners();
});

// Handle page visibility changes - Background play enabled
document.addEventListener('visibilitychange', () => {
    // Audio continues playing in background - no pause behavior
    // This allows users to listen while using other tabs/apps
    console.log(document.hidden ? '🎵 Playing in background...' : '👀 Tab is now visible');
});
