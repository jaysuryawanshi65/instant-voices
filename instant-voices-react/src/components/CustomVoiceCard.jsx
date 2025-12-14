import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Trash2 } from 'lucide-react';
import VoiceControls from './VoiceControls';

const CustomVoiceCard = ({ dialogue, customVoice, onSave, onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [pitch, setPitch] = useState(1.0);
    const [speed, setSpeed] = useState(1.0);
    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    // Reset controls when voice changes
    useEffect(() => {
        setPitch(1.0);
        setSpeed(1.0);
        setIsPlaying(false);
    }, [customVoice]);

    // Apply audio settings whenever pitch, speed, or isPlaying changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const applySettings = () => {
            // Logic:
            // If Pitch != 1.0, we want to change pitch.
            // Browsers only allow changing pitch by changing playbackRate with preservesPitch = false.
            // This also changes speed.
            // So:
            // - Pitch 1.0, Speed 1.0 -> Rate 1.0, PreservesPitch True
            // - Pitch 1.0, Speed 1.5 -> Rate 1.5, PreservesPitch True (Time stretch)
            // - Pitch 1.5, Speed 1.0 -> Rate 1.5, PreservesPitch False (Chipmunk)
            // - Pitch 1.5, Speed 1.5 -> Rate 2.25, PreservesPitch False (Fast Chipmunk)
            
            const preservesPitch = pitch === 1.0;
            
            // Set preservesPitch properties for cross-browser support
            if ('preservesPitch' in audio) audio.preservesPitch = preservesPitch;
            if ('mozPreservesPitch' in audio) audio.mozPreservesPitch = preservesPitch;
            if ('webkitPreservesPitch' in audio) audio.webkitPreservesPitch = preservesPitch;

            // Calculate rate
            audio.playbackRate = pitch * speed;
        };

        applySettings();
        
        // Re-apply on play to ensure browser picks it up
        audio.addEventListener('play', applySettings);
        return () => {
            audio.removeEventListener('play', applySettings);
        };
    }, [pitch, speed]);

    const handleReset = () => {
        setPitch(1.0);
        setSpeed(1.0);
    };

    const handlePlay = (e) => {
        e.stopPropagation();
        const audio = audioRef.current;
        
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            const audioSrc = customVoice?.downloadURL || customVoice?.data;
            if (audioSrc) {
                // Only set src if it's different to avoid reloading
                if (audio.src !== audioSrc) {
                    audio.src = audioSrc;
                }
                
                audio.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Playback error", e));
            }
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    const handleUploadClick = (e) => {
        e.stopPropagation();
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg', 'video/mp4', 'audio/mp4'];
        if (!validTypes.some(type => file.type.includes(type.replace('audio/', '').replace('video/', '')))) {
            alert('Please select a valid audio/video file (MP3, WAV, OGG, or MP4)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File is too large. Maximum size is 10MB.');
            return;
        }

        try {
            await onSave(dialogue.id, file);
            alert('Audio uploaded successfully!');
        } catch (error) {
            alert(error.message || 'Error uploading file');
        }
        
        // Reset input
        e.target.value = '';
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this audio?')) {
            onDelete(dialogue.id);
        }
    };

    return (
        <div className={`voice-card custom-voice-card ${isPlaying ? 'playing' : ''}`} onClick={handlePlay}>
            <div className="card-header">
                <span className="card-number">#{dialogue.id}</span>
                <button 
                    className={`play-button ${!customVoice ? 'disabled' : ''} ${isPlaying ? 'playing' : ''}`} 
                    onClick={handlePlay}
                    disabled={!customVoice}
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
            </div>
            
            <div className="dialogue-text">{dialogue.text}</div>
            <div className="dialogue-translation">{dialogue.translation}</div>
            
            <div className="custom-upload-section" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="file-input" 
                    accept="audio/*,video/mp4"
                    onChange={handleFileChange}
                />
                <button className="upload-button" onClick={handleUploadClick}>
                    <Upload size={18} />
                    <span>{customVoice ? 'Change Audio' : 'Upload Audio'}</span>
                </button>
                {customVoice && (
                    <button className="delete-button" onClick={handleDelete} title="Delete audio">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {customVoice && (
                <div onClick={(e) => e.stopPropagation()}>
                    <VoiceControls 
                        pitch={pitch} 
                        setPitch={setPitch} 
                        speed={speed} 
                        setSpeed={setSpeed} 
                        onReset={handleReset} 
                    />
                </div>
            )}
            
            <div className="waveform" style={{ opacity: isPlaying ? 1 : 0 }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
            </div>

            <audio 
                ref={audioRef} 
                onEnded={handleEnded}
                onError={(e) => {
                    console.error("Audio error", e);
                    setIsPlaying(false);
                }}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default CustomVoiceCard;
