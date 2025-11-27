import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Trash2 } from 'lucide-react';

const CustomVoiceCard = ({ dialogue, customVoice, onSave, onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Cleanup audio on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handlePlay = (e) => {
        e.stopPropagation();
        
        if (isPlaying) {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            return;
        }

        const audioSrc = customVoice?.downloadURL || customVoice?.data;
        
        if (audioSrc) {
            // Stop any other audio (simplified for React component isolation, ideally managed by context)
            const audio = new Audio(audioSrc);
            audioRef.current = audio;
            
            audio.onended = () => {
                setIsPlaying(false);
            };
            
            audio.play().catch(e => console.error("Playback error", e));
            setIsPlaying(true);
        }
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
            
            <div className="waveform" style={{ opacity: isPlaying ? 1 : 0 }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
            </div>
        </div>
    );
};

export default CustomVoiceCard;
